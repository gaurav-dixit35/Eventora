import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

let scene, camera, renderer, stars = [];

function init() {
  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.z = 1;

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bgCanvas'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add Stars
  for (let i = 0; i < 800; i++) {
    const geometry = new THREE.SphereGeometry(0.2, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 0x00eeff });
    const star = new THREE.Mesh(geometry, material);

    star.position.x = (Math.random() - 0.5) * 200;
    star.position.y = (Math.random() - 0.5) * 200;
    star.position.z = -Math.random() * 500;

    scene.add(star);
    stars.push(star);
  }

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Move stars slowly
  stars.forEach((star) => {
    star.position.z += 0.5;
    if (star.position.z > 0) {
      star.position.z = -500;
    }
  });

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
