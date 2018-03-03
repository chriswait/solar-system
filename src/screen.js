import {
  SphereGeometry,
  // TorusGeometry,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  Mesh,
  PointLight,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  BackSide,
  Vector2,
  Vector3,
  Raycaster,
  Color
} from 'three'

import {auToMeters, degreesToRadians} from './util'
import StarField from './images/starfield.png'
import store from './store'
import {ORBIT_POINTS} from './constants'

const NEAR = 0.01
const FAR = 3000
const VIEW_ANGLE = 45
const SPHERE_SEGMENTS = 16
const SPHERE_RINGS = 16
const ORBIT_MAX_UNITS = 500
const HOVER_COLOR = 'white'

export class Screen {
  canvasElement
  renderer
  camera
  scene = new Scene()
  width
  height
  aspect
  raycaster = new Raycaster()
  hoverObject
  mousePosition
  scaleFactor = 1
  meshes = {}
  orbitMeshes = {}

  get cameraFOVRadians() {
    return degreesToRadians(this.camera.fov)
  }

  onMouseMove(event) {
    event.preventDefault()
    this.mousePosition = new Vector2(
      (event.clientX / this.width) * 2 - 1,
      - (event.clientY / this.height) * 2 + 1
    )
  }

  onClick(event) {
    if (this.hoverObject) {
      event.preventDefault()
      store.commit('setTargetName', this.hoverObject.userData.name)
    }
  }

  resetRendererSize() {
    // clear existing styles before resetting
    this.canvasElement.style.width = null
    this.canvasElement.style.height = null
    this.width = this.canvasElement.clientWidth
    this.height = this.canvasElement.clientHeight

    this.renderer.setSize(this.width, this.height)
  }

  resetCameraAspect() {
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  initRenderer(canvasElement) {
    this.canvasElement = canvasElement
    this.renderer = new WebGLRenderer({
      canvas: this.canvasElement,
      antialias: true
    })
    this.resetRendererSize()
    this.camera = new PerspectiveCamera(VIEW_ANGLE, this.width / this.height, NEAR, FAR)

    document.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    document.addEventListener('click', this.onClick.bind(this), false)
    window.addEventListener('resize', () => {
      this.resetRendererSize()
      this.resetCameraAspect()
    }, false)

    this.loadStars()
  }

  render() {
    if (this.renderer) {

      if (this.mousePosition) {
        this.raycaster.setFromCamera(this.mousePosition, this.camera)
        let intersects = this.raycaster.intersectObjects(this.scene.children).filter((intersect) => intersect.object.userData.name)
        if (intersects.length > 0) {
          // If we have an existing hoverObject, reset the color
          if (this.hoverObject) {
            this.hoverObject.material.color = this.hoverObject.currentColor
          }
          this.hoverObject = intersects[0].object
          this.hoverObject.currentColor = this.hoverObject.material.color
          this.hoverObject.material.color = new Color(HOVER_COLOR)
        } else {
          if (this.hoverObject) {
            this.hoverObject.material.color = this.hoverObject.currentColor
            this.hoverObject = undefined
          }
        }
      }

      if (store.getters.currentTargetName) {
        let newParent = this.meshes[store.getters.currentTargetName]
        if (this.camera.parent !== newParent) {
          if (this.camera.parent) {
            this.camera.parent.remove(this.camera)
          }
          newParent.add(this.camera)
          this.camera.position.set(0, 70, 0)
        }
      }

      this.renderer.render(this.scene, this.camera)
    }
  }

  loadStars() {
    let loader = new TextureLoader()
    loader.load(
      StarField,
      (texture) => {
        let material = new MeshBasicMaterial({map: texture})
        let geometry = new SphereGeometry(ORBIT_MAX_UNITS, 32, 32)
        let mesh = new Mesh(geometry, material)
        mesh.material.side = BackSide
        this.scene.add(mesh)
      }
    )
  }

  setScaleForOuterObject(lastObject) {
    let furthestOrbitMeters = auToMeters(lastObject.orbit.keplerianElements.initial.semiMajorAxisAu)
    this.scaleFactor = ORBIT_MAX_UNITS / furthestOrbitMeters
  }

  get2DCoordinateForObject3D(object3d) {
    if (!this.camera.parent) {
      return undefined
    }

    // get global coordinates
    let objectVector = new Vector3().setFromMatrixPosition(object3d.matrixWorld)
    let cameraVector = new Vector3().setFromMatrixPosition(this.camera.matrixWorld)
    let projectedObjectVector = new Vector3().copy(objectVector).project(this.camera)

    // ensure the camera can see the object
    let lookAt = this.camera.getWorldDirection()
    let pos = new Vector3().copy(objectVector).sub(cameraVector)
    if (pos.angleTo(lookAt) > this.cameraFOVRadians) {
      return undefined
    }

    // work out screen coordinates
    let x = (projectedObjectVector.x * this.width / 2) + this.width / 2
    let y = -(projectedObjectVector.y * this.height / 2) + this.height / 2

    // calculate visible dimensions based on camera's view
    // the total visible height at dist is 2x the base of the triangle with angle of FOV/2 and length dist
    let dist = cameraVector.distanceTo(objectVector)
    let visibleHeight = 2 * Math.tan(this.cameraFOVRadians / 2) * dist
    // scale the ratio of object height to visible height for the screen height
    let heightPixels = this.height * (object3d.geometry.parameters.radius * 2) / visibleHeight

    return {
      x: x,
      y: y,
      side: heightPixels,
      dist: dist
    }
  }

  realToVisualised(position) {
    // OpenGL uses right-hand coordinate system: y-out, y-up
    return new Vector3(position.x, position.z, position.y)
    .multiplyScalar(this.scaleFactor) // scale
  }

  redrawObject(object) {
    let newPositionScaled = this.realToVisualised(object.position)
    this.meshes[object.name].position.copy(newPositionScaled)
    store.commit('setPosition2DForObject', {
      object: object,
      position2D: this.get2DCoordinateForObject3D(this.meshes[object.name])
    })
  }

  drawObject(object) {
    let radius = object.radius * 1000 * this.scaleFactor * 10
    let geometry = new SphereGeometry(radius, SPHERE_SEGMENTS, SPHERE_RINGS)
    let material
    if (object.star) {
      material = new MeshDepthMaterial()
    } else {
      material = new MeshLambertMaterial({color: new Color(object.color)})
    }
    let mesh = new Mesh(geometry, material)
    mesh.userData.name = object.name
    this.scene.add(mesh)
    this.meshes[object.name] = mesh
  }

  drawLightForObject(object) {
    let light = new PointLight((new Color(object.color)).getHex(), 1, 0)
    light.position.copy(this.meshes[object.name].position)
    this.scene.add(light)
    return light
  }

  // drawOrbitForObject(object) {
  //   let radius = auToMeters(object.orbit.keplerianElements.initial.semiMajorAxisAu) * this.scaleFactor
  //   let geometry = new TorusGeometry(radius, 0.1, 3, 360, Math.PI * 2)
  //   geometry.rotateX(Math.PI / 2) // rotate to horizontal
  //   let material = new MeshBasicMaterial({color: object.color})
  //   let mesh = new Mesh(geometry, material)
  //   mesh.position.set(0, 0, 0)
  //   this.scene.add(mesh)
  //   return mesh
  // }

  drawOrbitForObject(object) {
    let orbitMeshes = []
    for (let i = 0; i < ORBIT_POINTS; i++) {
      let radius = 0.1
      let geometry = new SphereGeometry(radius, SPHERE_SEGMENTS, SPHERE_RINGS)
      let material = new MeshLambertMaterial({color: new Color(object.color)})
      let mesh = new Mesh(geometry, material)
      orbitMeshes.push(mesh)
      this.scene.add(mesh)
    }
    this.orbitMeshes[object.name] = orbitMeshes
  }

  redrawOrbitForObject(object) {
    if (!object.lastOrbit) {
      return
    }
    let orbitMeshes = this.orbitMeshes[object.name]
    for (let i = 0; i < ORBIT_POINTS; i++) {
      let mesh = orbitMeshes[i]
      let positionScaled = this.realToVisualised(object.lastOrbit[i])
      mesh.position.copy(positionScaled)
    }
  }
}
