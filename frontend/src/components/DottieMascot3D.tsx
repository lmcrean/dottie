import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useMemo } from 'react'

function TeardropBody() {
  const points = useMemo(() => {
    const shape = []
    shape.push(new THREE.Vector2(0, 0))
    shape.push(new THREE.Vector2(0.1, 0.1))
    shape.push(new THREE.Vector2(0.25, 0.3))
    shape.push(new THREE.Vector2(0.5, 0.6))
    shape.push(new THREE.Vector2(0.65, 0.9))
    shape.push(new THREE.Vector2(0.75, 1.2))
    shape.push(new THREE.Vector2(0.7, 1.4))
    shape.push(new THREE.Vector2(0.5, 1.6))
    shape.push(new THREE.Vector2(0.3, 1.7))
    shape.push(new THREE.Vector2(0, 1.75))
    return shape
  }, [])

  return (
    <group scale={[1.2, 1.2, 1.2]} position={[0, 1, 0]}>
      {/* Main body */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <latheGeometry args={[points, 64]} />
        <meshStandardMaterial 
          color="#A03C7D" 
          emissive="#ff4db8"
          emissiveIntensity={0.2}
          roughness={1.0}
          metalness={0}
        />
      </mesh>

      {/* Eyes */}
      <group position={[0, -0.8, 0.6]}>
        {/* Left eye */}
        <group position={[-0.25, 0, 0]}>
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
          <mesh position={[0.02, -0.02, 0.08]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        
        {/* Right eye */}
        <group position={[0.25, 0, 0]}>
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
          <mesh position={[0.02, -0.02, 0.08]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
      </group>

      {/* Smile */}
      <group position={[0, -1.1, 0.8]} rotation={[0, 0, Math.PI]}>
        <mesh>
          <ringGeometry args={[0.15, 0.17, 32, 1, 0, Math.PI]} />
          <meshStandardMaterial color="black" side={THREE.DoubleSide} emissive="black" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} intensity={4} />
      <pointLight position={[-10, 5, 10]} intensity={3} color="#ffffff" />
      <directionalLight position={[0, 0, 5]} intensity={3} />
      <spotLight 
        position={[0, 5, 5]} 
        angle={0.6} 
        penumbra={1} 
        intensity={2.5} 
        castShadow 
      />
      <hemisphereLight 
        args={["#ffffff", "#ff8ddb", 2]}
      />
      <TeardropBody />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export default function TeardropShape3D() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ alpha: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  )
}
