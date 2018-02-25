import {
  SphereGeometry,
  TorusGeometry,
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

const NEAR = 0.01
const FAR = 3000
const VIEW_ANGLE = 90
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
          this.camera.position.set(0, 10, 0)
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
    let vector = (new Vector3()).setFromMatrixPosition(object3d.matrixWorld)

    // work out if behind camera
    let lookAt = this.camera.getWorldDirection()
    let cameraPos = new Vector3().setFromMatrixPosition(this.camera.matrixWorld)
    let pos = (new Vector3()).copy(vector).sub(cameraPos)
    let behind = pos.angleTo(lookAt) > (Math.PI / 2)
    if (behind) return undefined

    // work out screen coordinates
    vector.project(this.camera)
    let x = (vector.x * this.width / 2) + this.width / 2
    let y = -(vector.y * this.height / 2) + this.height / 2

    // calculate draw size
    let visibleHeight, dist
    let radius = object3d.geometry.parameters.radius
    if (this.camera.parent) {
      if (this.camera.parent === object3d) {
        dist = this.camera.position.length()
      } else {
        // find the vector between the object and the camera
        let objToCamera = (new Vector3())
        .copy(object3d.position)
        .add(this.camera.parent.position)
        .add(this.camera.position)
        dist = objToCamera.length()
      }
      let fov = degreesToRadians(this.camera.fov)
      let height = 2 * Math.tan(fov / 2) * dist
      let fraction = (radius * 2) / height
      visibleHeight = this.height * fraction
    }
    return {
      x: x,
      y: y,
      side: visibleHeight,
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

  drawOrbitForObject(object) {
    let radius = auToMeters(object.orbit.keplerianElements.initial.semiMajorAxisAu) * this.scaleFactor
    let geometry = new TorusGeometry(radius, 0.1, 3, 360, Math.PI * 2)
    geometry.rotateX(Math.PI / 2) // rotate to horizontal
    let material = new MeshBasicMaterial({color: object.color})
    let mesh = new Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    this.scene.add(mesh)
    return mesh
  }
}
