import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import './PanoramaViewer.css';

const PanoramaViewer = ({ imageUrl }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const isUserInteracting = useRef(false);
  const onPointerDownMouseX = useRef(0);
  const onPointerDownMouseY = useRef(0);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const onPointerDownLon = useRef(0);
  const onPointerDownLat = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();
    const texture = loader.load(imageUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      update();
    };

    const update = () => {
      if (isUserInteracting.current === false) {
        lonRef.current += 0.1;
      }

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(camera.target);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
    };
  }, [imageUrl]);

  const onPointerDown = (event) => {
    if (event.isPrimary === false) return;

    isUserInteracting.current = true;

    onPointerDownMouseX.current = event.clientX;
    onPointerDownMouseY.current = event.clientY;

    onPointerDownLon.current = lonRef.current;
    onPointerDownLat.current = latRef.current;
  };

  const onPointerMove = (event) => {
    if (event.isPrimary === false) return;

    if (isUserInteracting.current) {
      lonRef.current = (onPointerDownMouseX.current - event.clientX) * 0.1 + onPointerDownLon.current;
      latRef.current = (event.clientY - onPointerDownMouseY.current) * 0.1 + onPointerDownLat.current;
    }
  };

  const onPointerUp = () => {
    isUserInteracting.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="panorama-container"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    />
  );
};

export default PanoramaViewer;