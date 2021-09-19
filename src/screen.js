import {
  SphereGeometry,
  BufferGeometry,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  LineBasicMaterial,
  Mesh,
  PointLight,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  BackSide,
  Vector2,
  Vector3,
  Line,
  Raycaster,
  Color,
} from "three";

import { auToMeters, degreesToRadians } from "./util";
import StarField from "./images/starfield.png";
import { ORBIT_POINTS } from "./constants";

const NEAR = 0.01;
const FAR = 3000;
const VIEW_ANGLE = 45;
const SPHERE_SEGMENTS = 16;
const SPHERE_RINGS = 16;
const ORBIT_MAX_UNITS = 500;
const HOVER_COLOR = "white";

export class Screen {
  canvasElement;
  renderer;
  camera;
  scene = new Scene();
  width;
  height;
  aspect;
  raycaster = new Raycaster();
  hoverObject;
  scaleFactor = 1;
  meshes = {};
  orbitLines = {};

  get cameraFOVRadians() {
    return degreesToRadians(this.camera.fov);
  }

  checkHoverObject(clientX, clientY) {
    const mousePosition = new Vector2(
      (clientX / this.width) * 2 - 1,
      -(clientY / this.height) * 2 + 1
    );
    this.raycaster.setFromCamera(mousePosition, this.camera);
    let intersects = this.raycaster
      .intersectObjects(this.scene.children)
      .filter((intersect) => intersect.object.userData.name);

    if (intersects.length > 0) {
      // If we have an existing hoverObject, reset the color
      if (this.hoverObject) {
        this.hoverObject.material.color = this.hoverObject.currentColor;
      }
      this.hoverObject = intersects[0].object;
      this.hoverObject.currentColor = this.hoverObject.material.color;
      this.hoverObject.material.color = new Color(HOVER_COLOR);
    } else {
      if (this.hoverObject) {
        this.hoverObject.material.color = this.hoverObject.currentColor;
        this.hoverObject = undefined;
      }
    }
  }

  resetRendererSize() {
    // clear existing styles before resetting
    this.canvasElement.style.width = null;
    this.canvasElement.style.height = null;
    this.width = this.canvasElement.clientWidth;
    this.height = this.canvasElement.clientHeight;

    this.renderer.setSize(this.width, this.height);
  }

  resetCameraAspect() {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  initRenderer(canvasElement) {
    this.canvasElement = canvasElement;
    this.renderer = new WebGLRenderer({
      canvas: this.canvasElement,
      antialias: true,
    });
    this.resetRendererSize();
    this.camera = new PerspectiveCamera(
      VIEW_ANGLE,
      this.width / this.height,
      NEAR,
      FAR
    );

    window.addEventListener(
      "resize",
      () => {
        this.resetRendererSize();
        this.resetCameraAspect();
      },
      false
    );

    this.loadStars();
    this.scene.background = new Color("white");
    this.camera.position.set(0, 70, 0);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  getMeshWithName(name) {
    return this.meshes[name];
  }

  setCameraTarget(currentTargetName, controls) {
    controls.target = this.getMeshWithName(currentTargetName).position;
  }

  loadStars() {
    let loader = new TextureLoader();
    loader.load(StarField, (texture) => {
      let material = new MeshBasicMaterial({ map: texture });
      let geometry = new SphereGeometry(ORBIT_MAX_UNITS * 2, 32, 32);
      let mesh = new Mesh(geometry, material);
      mesh.material.side = BackSide;
      this.scene.add(mesh);
    });
  }

  setScaleForOuterObject(lastObject) {
    let furthestOrbitMeters = auToMeters(
      lastObject.orbit.keplerianElements.initial.semiMajorAxisAu
    );
    this.scaleFactor = ORBIT_MAX_UNITS / furthestOrbitMeters;
  }

  get2DCoordinateForObject3D(object3d) {
    if (!this.camera) {
      return undefined;
    }

    // get global coordinates
    let objectVector = new Vector3().setFromMatrixPosition(
      object3d.matrixWorld
    );
    let cameraVector = new Vector3().setFromMatrixPosition(
      this.camera.matrixWorld
    );
    let projectedObjectVector = new Vector3()
      .copy(objectVector)
      .project(this.camera);

    // ensure the camera can see the object
    let lookAt = new Vector3();
    this.camera.getWorldDirection(lookAt);
    let pos = new Vector3().copy(objectVector).sub(cameraVector);
    if (pos.angleTo(lookAt) > this.cameraFOVRadians) {
      return undefined;
    }

    // work out screen coordinates
    let x = (projectedObjectVector.x * this.width) / 2 + this.width / 2;
    let y = -((projectedObjectVector.y * this.height) / 2) + this.height / 2;

    // calculate visible dimensions based on camera's view
    // the total visible height at dist is 2x the base of the triangle with angle of FOV/2 and length dist
    let dist = cameraVector.distanceTo(objectVector);
    let visibleHeight = 2 * Math.tan(this.cameraFOVRadians / 2) * dist;
    // scale the ratio of object height to visible height for the screen height
    let heightPixels =
      (this.height * (object3d.geometry.parameters.radius * 2)) / visibleHeight;

    return {
      x: x,
      y: y,
      side: heightPixels,
      dist: dist,
    };
  }

  realToVisualised(position) {
    // OpenGL uses right-hand coordinate system: y-out, y-up
    return new Vector3(position.x, position.z, position.y).multiplyScalar(
      this.scaleFactor
    ); // scale
  }

  redrawObject(object) {
    let newPositionScaled = this.realToVisualised(object.position);
    this.getMeshWithName(object.name).position.copy(newPositionScaled);
    if (object.orbit) {
      this.redrawOrbitForObject(object);
    }
  }

  drawObject(object) {
    let radius = object.radius * 1000 * this.scaleFactor * 1000;
    let geometry = new SphereGeometry(radius, SPHERE_SEGMENTS, SPHERE_RINGS);
    let material;
    if (object.star) {
      material = new MeshDepthMaterial();
    } else {
      material = new MeshLambertMaterial({ color: new Color(object.color) });
    }
    let mesh = new Mesh(geometry, material);
    mesh.userData.name = object.name;
    this.scene.add(mesh);
    this.meshes[object.name] = mesh;

    if (object.star) {
      this.drawLightForObject(object);
    }
  }

  drawLightForObject(object) {
    let light = new PointLight(new Color(object.color).getHex(), 1, 0);
    light.position.copy(this.getMeshWithName(object.name).position);
    this.scene.add(light);
    return light;
  }

  redrawOrbitForObject(object) {
    if (!object.lastOrbit) {
      return;
    }
    if (this.orbitLines[object.name]) {
      this.scene.remove(this.orbitLines[object.name]);
    }

    const points = [];
    for (let i = 0; i < ORBIT_POINTS; i++) {
      let positionScaled = this.realToVisualised(object.lastOrbit[i]);
      points.push(positionScaled);
    }
    let positionScaled = this.realToVisualised(object.lastOrbit[0]);
    points.push(positionScaled);

    let orbitGeometry = new BufferGeometry().setFromPoints(points);
    let material = new LineBasicMaterial({ color: new Color(object.color) });
    let line = new Line(orbitGeometry, material);
    this.scene.add(line);
    this.orbitLines[object.name] = line;
  }
}
