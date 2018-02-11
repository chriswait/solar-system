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
  Vector3
} from 'three'

import {auToMeters} from './util'
import StarField from './images/starfield.png'

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const ASPECT = WIDTH / HEIGHT
const NEAR =  0.1
const FAR = 3000
const VIEW_ANGLE = 90

const SPHERE_SEGMENTS = 16
const SPHERE_RINGS = 16

export const ORBIT_MAX_UNITS = 500

export class Screen {
  renderer
  camera
  scene
  controls
  scaleFactor = 1
  constructor() {
    this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    this.scene = new Scene()
    this.camera.position.set(0, 20, -20)
    this.scene.add(this.camera)
    this.loadStars()
  }

  initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: document.getElementById('solar-system-canvas'),
      antialias: true
    })
    this.renderer.setSize(WIDTH - 300, HEIGHT)
  }

  render() {
    if (this.renderer) {
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
    return new Vector3(
      position.x * this.scaleFactor,
      position.y * this.scaleFactor,
      position.z * this.scaleFactor
    )
  }

  redrawObject(object) {
    let newPositionScaled = this.scaleRealToVisualised(object.position)
    object.mesh.position.copy(newPositionScaled)
  }

  drawObject(object) {
    let mesh = this.getMeshForObject(object)
    this.scene.add(mesh)
    return mesh
  }
  getMeshForObject(object) {
    let geometry = new SphereGeometry(2, SPHERE_SEGMENTS, SPHERE_RINGS)
    let material = object.star ? new MeshDepthMaterial() : material = new MeshLambertMaterial({color: object.color})
    return new Mesh(geometry, material)
  }

  drawLightForObject(object) {
    let light = this.getLightForObject(object)
    light.position.copy(object.mesh.position)
    this.scene.add(light)
    return light
  }
  getLightForObject(object) {
    return new PointLight(object.color, 1, 0)
  }

  drawOrbitForObject(object) {
    let mesh = this.getOrbitMeshForObject(object)
    mesh.position.set(0, 0, 0)
    this.scene.add(mesh)
    return mesh
  }
  getOrbitMeshForObject(object) {
    let radius = (auToMeters(object.orbit.keplerianElements.initial.semiMajorAxisAu) * this.scaleFactor)
    let geometry = new RingGeometry(radius + 0.01, radius - 0.01, 360)
    let material = new MeshBasicMaterial({color: object.color})
    return new Mesh(geometry, material)
  }
}
