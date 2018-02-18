import {
  SphereGeometry, RingGeometry,
  MeshBasicMaterial, MeshDepthMaterial, MeshLambertMaterial,
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

import {auToMeters} from './util'
import StarField from './images/starfield.png'
import store from './store'

const NEAR =  0.1
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
  scene
  width
  height
  aspect
  raycaster
  hoverObject
  mousePosition
  controls
  scaleFactor = 1
  meshes = {}

  constructor() {
    this.scene = new Scene()
    this.raycaster = new Raycaster()
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

  onResize() {
    this.width = this.canvasElement.clientWidth
    this.height = window.innerHeight
    this.renderer.setSize(this.width, this.height)

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  initRenderer(canvasElement) {
    this.canvasElement = canvasElement
    this.renderer = new WebGLRenderer({
      canvas: this.canvasElement,
      antialias: true
    })

    this.width = this.canvasElement.clientWidth
    this.height = window.innerHeight
    this.renderer.setSize(this.width, this.height)

    this.camera = new PerspectiveCamera(VIEW_ANGLE, this.width / this.height, NEAR, FAR)
    this.camera.position.set(0, 0, 50)
    this.scene.add(this.camera)

    document.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    document.addEventListener('click', this.onClick.bind(this), false)
    window.addEventListener('resize', this.onResize.bind(this), false)

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

  scaleRealToVisualised(position) {
    return new Vector3(position.x, position.y, position.z).multiplyScalar(this.scaleFactor)
  }

  redrawObject(object) {
    let newPositionScaled = this.scaleRealToVisualised(object.position)
    this.meshes[object.name].position.copy(newPositionScaled)
  }

  drawObject(object) {
    let geometry = new SphereGeometry(2, SPHERE_SEGMENTS, SPHERE_RINGS)
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
    let geometry = new RingGeometry(radius + 0.01, radius - 0.01, 360)
    geometry.rotateX(Math.PI)
    let material = new MeshBasicMaterial({color: object.color})
    let mesh = new Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    this.scene.add(mesh)
    return mesh
  }
}
