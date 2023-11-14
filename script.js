import * as THREE from 'three'

import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from '/node_modules/three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from '/node_modules/three/examples/jsm/geometries/TextGeometry.js'

import GUI from 'lil-gui'

/*
******** Checklist ******** 
0. Canvas
1. Scene
2. Objects (Mesh = Geometry + Material)
3. Camera
4. Renderer
*/

// Debug
const gui = new GUI()


// 0. Canvas
const canvas = document.querySelector('canvas.webgl')


// 1. Scene
const scene = new THREE.Scene()


// Textures
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('static/textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

// 2. Objects
/// 2.1. Objects - Font
const fontLoader = new FontLoader()
fontLoader.load(
    'static/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const textGeometry = new TextGeometry(
            'the bee\'s knees',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 1,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 1
            }
        )
        textGeometry.center()
        
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        /// 2.2. Objects around

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        donutGeometry.computeBoundingSphere()
    
        for (let i = 0; i < 100; i++) {
            
            const donut = new THREE.Mesh(donutGeometry, material)
        
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
        
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }
    }
)


// sizes for viewport 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    // update sizes
    sizes.width = window.innerWidth,
    sizes.height = window.innerHeight

    // update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// 3. Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// 4. Renderer
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // update controls
    controls.update()

    // render
    renderer.render(scene, camera)

    // call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()