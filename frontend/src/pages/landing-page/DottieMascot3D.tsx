import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useMemo, useRef, useEffect } from 'react';
import { Group } from 'three';

function TeardropBody() {
  const points = useMemo(() => {
    const shape = [];
    shape.push(new THREE.Vector2(0, 0));
    shape.push(new THREE.Vector2(0.05, 0.05));
    shape.push(new THREE.Vector2(0.1, 0.1));
    shape.push(new THREE.Vector2(0.18, 0.2));
    shape.push(new THREE.Vector2(0.25, 0.3));
    shape.push(new THREE.Vector2(0.35, 0.45));
    shape.push(new THREE.Vector2(0.42, 0.566));
    shape.push(new THREE.Vector2(0.5, 0.72));
    shape.push(new THREE.Vector2(0.56, 0.85));
    shape.push(new THREE.Vector2(0.62, 0.99));
    shape.push(new THREE.Vector2(0.67, 1.15));
    shape.push(new THREE.Vector2(0.7, 1.33));
    shape.push(new THREE.Vector2(0.7, 1.4));
    shape.push(new THREE.Vector2(0.7, 1.44));
    shape.push(new THREE.Vector2(0.69, 1.5));
    shape.push(new THREE.Vector2(0.65, 1.575));
    shape.push(new THREE.Vector2(0.6, 1.63));
    shape.push(new THREE.Vector2(0.5, 1.668));
    shape.push(new THREE.Vector2(0.3, 1.69));
    shape.push(new THREE.Vector2(0.3, 1.69));
    shape.push(new THREE.Vector2(0.15, 1.7));
    shape.push(new THREE.Vector2(0, 1.7));
    return shape;
  }, []);

  // Ref for the mesh
  const latheRef = useRef<THREE.Mesh>(null);

  // Create a ref for the mascot's main group
  const mascotRef = useRef<Group>(null);

  useEffect(() => {
    if (latheRef.current && latheRef.current.geometry) {
      latheRef.current.geometry.computeVertexNormals();
    }
  }, []);

  // Add floating animation
  useFrame(({ clock }) => {
    if (mascotRef.current) {
      // Smooth floating motion with sine wave
      const floatOffset = Math.sin(clock.getElapsedTime() * 0.6) * 0.1;
      mascotRef.current.position.y = 1 + floatOffset;
    }
  });

  return (
    /* eslint-disable react/no-unknown-property */
    <group ref={mascotRef} scale={[1.2, 1.2, 1.2]} position={[0, 1, 0]}>
      {/* Main body */}
      <mesh ref={latheRef} rotation={[Math.PI, 0, 0]}>
        <latheGeometry args={[points, 128]} />
        <meshStandardMaterial
          color="#ab1553"
          emissive="#db2777"
          emissiveIntensity={0.2}
          roughness={0.6}
          metalness={0}
          flatShading={false}
        />
      </mesh>

      {/* Eyes */}
      <group position={[0, -0.8, 0.6]}>
        {/* Left eye */}
        <group position={[-0.22, -0.1, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial
              color="white"
              emissive="white"
              emissiveIntensity={0.3}
              roughness={1.0}
              metalness={0}
            />
          </mesh>
          <mesh position={[0.03, -0.01, 0.08]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          {/* Small white highlight dot */}
          <mesh position={[0.024, 0, 0.125]}>
            <sphereGeometry args={[0.02, 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>

        {/* Right eye */}
        <group position={[0.22, -0.1, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial
              color="white"
              emissive="white"
              emissiveIntensity={0.3}
              roughness={1.0}
              metalness={0}
            />
          </mesh>
          <mesh position={[0.02, -0.01, 0.08]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          {/* Add small white highlight dot */}
          <mesh position={[0.012, 0, 0.125]}>
            <sphereGeometry args={[0.02, 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      </group>

      {/* Cheeks */}
      <group position={[0, -0.99, 0.48]}>
        {/* Left cheek */}
        <mesh position={[-0.32, -0.1, 0.07]}>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial
            color="#d1608c"
            transparent={true}
            opacity={0.4}
            roughness={1.0}
            metalness={0}
          />
        </mesh>

        {/* Right cheek */}
        <mesh position={[0.32, -0.1, 0.07]}>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial
            color="#d1608c"
            transparent={true}
            opacity={0.4}
            roughness={1.0}
            metalness={0}
          />
        </mesh>
      </group>

      {/* Smile */}
      <group position={[0, -1.15, 0]} rotation={[0, 0, Math.PI]}>
        {/* Use a custom curve that follows the teardrop surface */}
        <mesh>
          <tubeGeometry
            args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.2, 0, 0.62), // Left end
                new THREE.Vector3(-0.1, 0.05, 0.68), // Left middle
                new THREE.Vector3(0, 0.07, 0.7), // Center (further out)
                new THREE.Vector3(0.1, 0.05, 0.68), // Right middle
                new THREE.Vector3(0.2, 0, 0.62) // Right end
              ]),
              32, // tubular segments
              0.02, // radius of the tube
              8, // radial segments
              false
            ]}
          />
          <meshStandardMaterial color="#111827" />
        </mesh>
      </group>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} intensity={4} />
      <pointLight position={[-10, 5, 10]} intensity={3} color="#ffffff" />
      <directionalLight position={[0, 0, 5]} intensity={3} />
      <spotLight position={[0, 5, 5]} angle={0.6} penumbra={1} intensity={2.5} castShadow />
      <hemisphereLight args={['#ffffff', '#ff8ddb', 2]} />
      <TeardropBody />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export default function TeardropShape3D() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true }}>
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}

/* eslint-enable react/no-unknown-property */
