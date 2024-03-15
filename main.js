const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set camera position
camera.position.set(0, 0, 30);

// Add a torus to the scene
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Set up basic controls for keyboard input
const keyboardControls = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  moveUp: false,
  moveDown: false
};

function handleKeyDown(event) {
  event.preventDefault(); // Prevent default behavior
  switch (event.key) {
    case 'w': keyboardControls.moveForward = true; break;
    case 's': keyboardControls.moveBackward = true; break;
    case 'a': keyboardControls.moveLeft = true; break;
    case 'd': keyboardControls.moveRight = true; break;
    case ' ': keyboardControls.moveUp = true; break;
    case 'Shift': keyboardControls.moveDown = true; break;
  }
}

function handleKeyUp(event) {
  event.preventDefault(); // Prevent default behavior
  switch (event.key) {
    case 'w': keyboardControls.moveForward = false; break;
    case 's': keyboardControls.moveBackward = false; break;
    case 'a': keyboardControls.moveLeft = false; break;
    case 'd': keyboardControls.moveRight = false; break;
    case ' ': keyboardControls.moveUp = false; break;
    case 'Shift': keyboardControls.moveDown = false; break;
  }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
  

// Add lights to the scene
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 15, 15);
pointLight.intensity = 1000.0;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
ambientLight.intensity = 800.0;

// Add helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

// Initial camera view - orbit control
let isRocketView = false;

// Function to toggle camera view
function toggleCameraView() {
  if (isRocketView) {
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
  } else {
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0); // Look at the center of the scene
  }
  isRocketView = !isRocketView;
}

// Event listener for toggling camera view
document.addEventListener('keydown', function (event) {
  if (event.key === 't') { // Press 't' to toggle camera view
    toggleCameraView();
  }
});

// Add stars to the scene
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update rocket ship's position and rotation based on keyboard controls
  var speed = 0.1;
  var rotationSpeed = 0.05;
  
  if (keyboardControls.moveForward) {
    camera.position.x -= Math.sin(camera.rotation.y) * speed;
    camera.position.z -= Math.cos(camera.rotation.y) * speed;
  }
  if (keyboardControls.moveBackward) {
    camera.position.x += Math.sin(camera.rotation.y) * speed;
    camera.position.z += Math.cos(camera.rotation.y) * speed;
  }
  
  if (keyboardControls.moveLeft) camera.rotation.y += rotationSpeed; // Rotate camera to the left
  if (keyboardControls.moveRight) camera.rotation.y -= rotationSpeed; // Rotate camera to the right
  
  if (keyboardControls.moveUp) camera.position.y += speed;
  if (keyboardControls.moveDown) camera.position.y -= speed;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate();
