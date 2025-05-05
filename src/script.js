import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
/**
 * Base
 */
// Debug
// Create a loading manager
const loadingManager = new THREE.LoadingManager();

// Show loading screen
const loadingScreen = document.createElement('div');
loadingScreen.style.position = 'fixed';
loadingScreen.style.top = '0';
loadingScreen.style.left = '0';
loadingScreen.style.width = '100%';
loadingScreen.style.height = '100%';
loadingScreen.style.backgroundColor = '#000';
loadingScreen.style.color = '#fff';
loadingScreen.style.display = 'flex';
loadingScreen.style.justifyContent = 'center';
loadingScreen.style.alignItems = 'center';
loadingScreen.style.fontSize = '24px';
loadingScreen.innerText = 'Loading...';
document.body.appendChild(loadingScreen);


// Add spinner
const spinner = document.createElement('div');
spinner.style.border = '8px solid #f3f3f3';
spinner.style.borderTop = '8px solid #3498db';
spinner.style.borderRadius = '50%';
spinner.style.width = '50px';
spinner.style.height = '50px';
spinner.style.animation = 'spin 1s linear infinite';
loadingScreen.appendChild(spinner);


// Add spinner animation (CSS)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
// Hide loading screen when all assets are loaded
loadingManager.onLoad = () => {
    // loadingScreen.style.display = 'none';
    loadingScreen.style.transition = 'opacity 0.5s';
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
};

// Update loading progress
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    loadingScreen.innerText = `Loading... (${itemsLoaded}/${itemsTotal})`;
};

// Handle errors
loadingManager.onError = (url) => {
    console.error(`There was an error loading ${url}`);
};
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)
/**
 * Textures
 */
const chocolateTexture = new THREE.TextureLoader().load('/textures/matcaps/1006_baseColor.png')
chocolateTexture.colorSpace = THREE.SRGBColorSpace
const cakeTexture = new THREE.TextureLoader().load('/textures/matcaps/1007_baseColor.png')
cakeTexture.colorSpace = THREE.SRGBColorSpace
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace
/**
 * Fonts
 */

const gltfLoader = new GLTFLoader(loadingManager)
const fontLoader = new FontLoader(loadingManager)
fontLoader.load('/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry('Happy Birthday <3 <3', {
            font,
            size: 0.5,
            depth: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        })
        const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const chocolateMaterial = new THREE.MeshStandardMaterial({map: chocolateTexture})
        const cakeMaterial = new THREE.MeshStandardMaterial({map: cakeTexture})
        const textMesh = new THREE.Mesh(textGeometry,[cakeMaterial,chocolateMaterial])
        textGeometry.center()
        // const text = new THREE.Mesh(textGeometry, textMaterial)
        // textGeometry.center()
        scene.add(textMesh)
        // console.time('donuts')
        // const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        // const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        // for (let i = 0; i < 100; i++) {
         
        //     const donut = new THREE.Mesh(donutGeometry, donutMaterial)
        //     donut.position.x = (Math.random() - 0.5) * 10 
        //     donut.position.y = (Math.random() - 0.5) * 10
        //     donut.position.z = (Math.random() - 0.5) * 10
        //     donut.rotation.x = Math.random() * Math.PI
        //     donut.rotation.y = Math.random() * Math.PI

        //     const scale = Math.random()
        //     donut.scale.x = scale
        //     donut.scale.y = scale
        //     donut.scale.z = scale
        //     scene.add(donut) 
            
        // }
        // console.timeEnd('donuts')
        gltfLoader.load('/models/birthday_cake.glb', (gltf) => {
            const cakeModel = gltf.scene
            console.time('cakes')
        
            for (let i = 0; i < 200; i++) {
                const cake = cakeModel.clone()
        
                // Randomize position
                cake.position.x = (Math.random() - 0.5) * 10
                cake.position.y = (Math.random() - 0.5) * 10
                cake.position.z = (Math.random() - 0.5) * 10
        
                // Randomize rotation
                cake.rotation.x = Math.random() * Math.PI
                cake.rotation.y = Math.random() * Math.PI
        
                // Randomize scale
                const scale = Math.random()*30 // Ensure cakes are not too small
                cake.scale.set(scale, scale, scale)
        
                scene.add(cake)
            }
        
            console.timeEnd('cakes')
        })
    }
)
/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Bright white light
scene.add(ambientLight);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
     // Camera zoom-in animation
    const zoomDuration = 3; // Duration of the zoom-in animation in seconds
     if (elapsedTime < zoomDuration) {
         const progress = elapsedTime / zoomDuration; // Progress from 0 to 1
         camera.position.z = 20 - (18 * progress); // Start at z = 20, end at z = 2
     }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()