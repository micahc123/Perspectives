import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Confetti from 'react-confetti';
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
  const [buttons, setButtons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [clickedCoordinates, setClickedCoordinates] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

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

    setButtons(prevButtons => prevButtons.map(button => {
      const vector = new THREE.Vector3(button.point.x, button.point.y, button.point.z);
      vector.project(cameraRef.current);

      const x = (vector.x * 0.5 + 0.5) * containerRef.current.clientWidth;
      const y = (vector.y * -0.5 + 0.5) * containerRef.current.clientHeight;

      const isVisible = vector.z < 1 && 
                        x >= 0 && x <= containerRef.current.clientWidth &&
                        y >= 0 && y <= containerRef.current.clientHeight;

      return { ...button, x, y, visible: isVisible };
    }));

    setPopups(prevPopups => prevPopups.map(popup => {
      const vector = new THREE.Vector3(popup.point.x, popup.point.y, popup.point.z);
      vector.project(cameraRef.current);

      const x = (vector.x * 0.5 + 0.5) * containerRef.current.clientWidth;
      const y = (vector.y * -0.5 + 0.5) * containerRef.current.clientHeight;

      const isVisible = vector.z < 1 && 
                        x >= 0 && x <= containerRef.current.clientWidth &&
                        y >= 0 && y <= containerRef.current.clientHeight;

      return { ...popup, x, y, visible: isVisible };
    }));
  }, []);

  const handleSphereClick = useCallback((event) => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);

    if (intersects.length > 0) {
      const intersectionPoint = intersects[0].point;
      setClickedCoordinates({
        x: intersectionPoint.x.toFixed(2),
        y: intersectionPoint.y.toFixed(2),
        z: intersectionPoint.z.toFixed(2)
      });
    }
  }, []);

  useEffect(() => {
    setPopups([]);
    setButtons([]);
    setIsLoading(true);
    setLoadingProgress(0);

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.position.y += 100;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxAzimuthAngle = THREE.MathUtils.degToRad(40);
    controls.minAzimuthAngle = THREE.MathUtils.degToRad(-40);
    controls.enablePan = false;
    controls.enableZoom = false;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true,
          opacity: 0
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const fadeIn = () => {
          if (material.opacity < 1) {
            material.opacity += 0.05;
            requestAnimationFrame(fadeIn);
            renderer.render(scene, camera);
          } else {
            setIsLoading(false);
          }
        };
        fadeIn();

        const buttonsData = interactivePoints.map(point => ({
          id: point.id,
          text: point.text,
          buttonText: point.buttonText || 'Click me',
          point: new THREE.Vector3(point.x, point.y, point.z),
          visible: true
        }));
        setButtons(buttonsData);

        update();
        animate();
      },
      (xhr) => {
        setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
      },
      (error) => {
        console.error('An error occurred while loading the texture', error);
        setIsLoading(false);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      if (isUserInteracting.current) {
        update();
      }
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      update();
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
  }, [imageUrl, interactivePoints, update, handleSphereClick]);

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
      update();
    }
  };

  const onPointerUp = () => {
    isUserInteracting.current = false;
    update();
  };

  const handleButtonClick = (buttonId) => {
    setButtons(prevButtons => prevButtons.filter(button => button.id !== buttonId));

    const clickedButton = buttons.find(b => b.id === buttonId);
    if (clickedButton) {
      setPopups(prevPopups => [
        ...prevPopups,
        {
          id: clickedButton.id,
          visible: true,
          text: clickedButton.text,
          x: clickedButton.x,
          y: clickedButton.y,
          point: clickedButton.point
        }
      ]);

      // Check if the button is an acceptance letter
      if (clickedButton.buttonText.toLowerCase().includes('acceptance') ||
          clickedButton.text.toLowerCase().includes('admitted') ||
          clickedButton.text.toLowerCase().includes('congratulations')) {
        setShowConfetti(true);
        // Optionally, set a timer to stop the confetti after a few seconds
        setTimeout(() => setShowConfetti(false), 5000);
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
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
      onClick={handleSphereClick}
    >
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-bar">
            <div className="loading-progress" style={{ width: `${loadingProgress}%` }}></div>
          </div>
          <div className="loading-text">{loadingProgress}% Loaded</div>
        </div>
      )}
      {clickedCoordinates && (
        <div className="coordinates-debug" style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontFamily: '"Roboto Mono", monospace',
          fontSize: '14px',
        }}>
          Clicked coordinates:
          <br />
          x: {clickedCoordinates.x}
          <br />
          y: {clickedCoordinates.y}
          <br />
          z: {clickedCoordinates.z}
        </div>
      )}
      {buttons.map((button) => (
        <button
          key={button.id}
          className="panorama-button"
          style={{
            position: 'absolute',
            left: `${button.x}px`,
            top: `${button.y}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s, transform 0.3s',
            opacity: button.visible ? 1 : 0,
            pointerEvents: button.visible ? 'auto' : 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            color: 'white',
            fontSize: '14px',
            fontFamily: '"Roboto Mono", monospace',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '5px',
          }}
          onClick={() => handleButtonClick(button.id)}
        >
          {button.buttonText}
        </button>
      ))}
      {popups.map((popup) => (
        popup.visible && (
          <div
            key={popup.id}
            className="popup"
            style={{
              position: 'absolute',
              left: `${popup.x}px`,
              top: `${popup.y}px`,
              transform: 'translate(-50%, -100%)',
              transition: 'opacity 0.5s',
              maxWidth: '200px',
              padding: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              borderRadius: '5px',
              fontSize: '14px',
              fontFamily: '"Roboto Mono", monospace',
              pointerEvents: 'none'
            }}
          >
            {popup.text}
          </div>
        )
      ))}
    </div>
  );
};

export default PanoramaViewer;