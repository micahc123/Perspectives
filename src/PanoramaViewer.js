import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import './PanoramaViewer.css';

const PanoramaViewer = ({ imageUrl, interactivePoints }) => {
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
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const [popups, setPopups] = useState([]);

  const update = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return;

    latRef.current = Math.max(-85, Math.min(85, latRef.current));
    const phi = THREE.MathUtils.degToRad(90 - latRef.current);
    const theta = THREE.MathUtils.degToRad(lonRef.current);

    cameraRef.current.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.target.y = 500 * Math.cos(phi);
    cameraRef.current.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    cameraRef.current.lookAt(cameraRef.current.target);
    rendererRef.current.render(sceneRef.current, cameraRef.current);

    setPopups(prevPopups => prevPopups.map(popup => {
      const vector = new THREE.Vector3(popup.point.x, popup.point.y, popup.point.z);
      vector.project(cameraRef.current);

      if (vector.z < 1) {
        const x = (vector.x * 0.5 + 0.5) * containerRef.current.clientWidth;
        const y = (vector.y * -0.5 + 0.5) * containerRef.current.clientHeight;
        return { ...popup, x, y, visible: true };
      } else {
        return { ...popup, visible: false };
      }
    }));
  }, []);

  useEffect(() => {
    setPopups([]);

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

    interactivePoints.forEach(point => {
      const pointGeometry = new THREE.SphereGeometry(5, 32, 32);
      const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
      pointMesh.position.set(point.x, point.y, point.z);
      pointMesh.userData = { id: point.id, text: point.text };
      scene.add(pointMesh);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (isUserInteracting.current) {
        update();
      }
    };

    update(); // Initial render
    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      update(); // Re-render after resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
      }
    };
  }, [imageUrl, interactivePoints, update]);

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
      update(); // Update view while dragging
    }
  };

  const onPointerUp = () => {
    isUserInteracting.current = false;
    update(); // Ensure final position is rendered
  };

  const onClick = (event) => {
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      if (intersected.userData.text) {
        const vector = new THREE.Vector3(intersected.position.x, intersected.position.y, intersected.position.z);
        vector.project(cameraRef.current);

        const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
        const y = (vector.y * -0.5 + 0.5) * container.clientHeight;

        setPopups(prevPopups => {
          const existingPopupIndex = prevPopups.findIndex(popup => popup.id === intersected.userData.id);
          if (existingPopupIndex !== -1) {
            const updatedPopups = [...prevPopups];
            updatedPopups[existingPopupIndex] = {
              ...updatedPopups[existingPopupIndex],
              visible: !updatedPopups[existingPopupIndex].visible,
              text: intersected.userData.text,
              x,
              y,
              point: intersected.position
            };
            return updatedPopups;
          } else {
            return [
              ...prevPopups,
              { id: intersected.userData.id, visible: true, text: intersected.userData.text, x, y, point: intersected.position }
            ];
          }
        });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="panorama-container"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onClick={onClick}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      {popups.map((popup, index) => (
        popup.visible && (
          <div
            key={popup.id}
            className="popup"
            style={{ position: 'absolute', left: popup.x, top: popup.y, transition: 'opacity 0.5s' }}
          >
            {popup.text}
          </div>
        )
      ))}
    </div>
  );
};

export default PanoramaViewer;