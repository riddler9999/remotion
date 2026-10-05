import {ThreeCanvas} from '@remotion/three';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const SkyAndGround = () => (
  <>
    <color attach="background" args={['#8ca8ba']} />
    <ambientLight intensity={1.1} />
    <directionalLight position={[4, 9, 3]} intensity={2.2} />
    <mesh position={[0, -2.8, -10]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#546b45" roughness={1} />
    </mesh>
    <mesh position={[0, -2.55, -18]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[32, 14]} />
      <meshStandardMaterial color="#6d8ea1" roughness={0.3} metalness={0.05} />
    </mesh>
  </>
);

const Asteroid = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 690], [-55, -6], clamp);
  const x = interpolate(frame, [0, 690], [5.2, 0.9], clamp);
  const y = interpolate(frame, [0, 690], [10.5, 2.8], clamp);
  const scale = interpolate(frame, [0, 690], [0.28, 2.4], clamp);
  const glow = interpolate(frame, [250, 690], [0.05, 1], clamp);

  return (
    <group position={[x, y, z]} rotation={[frame * 0.007, frame * 0.011, frame * 0.005]} scale={scale}>
      <pointLight intensity={glow * 60} distance={18} color="#ff7a1a" />
      <mesh>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#2f2b28"
          roughness={0.95}
          emissive="#ff5a14"
          emissiveIntensity={glow * 1.5}
        />
      </mesh>
    </group>
  );
};

const Explosion = () => {
  const frame = useCurrentFrame();
  const local = frame - 690;
  const size = interpolate(local, [0, 18, 120, 360], [0, 5.5, 10, 14], clamp);
  const opacity = interpolate(local, [0, 12, 170, 420], [0, 1, 0.72, 0], clamp);

  if (local < 0) return null;

  return (
    <mesh position={[0.8, 1, -8]} scale={size}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#ff8a2b" transparent opacity={opacity} />
    </mesh>
  );
};

const Hud = () => {
  const frame = useCurrentFrame();
  const altitude = Math.max(
    0,
    Math.round(interpolate(frame, [0, 690], [1312, 0], clamp)),
  );
  const shockwaveSeconds = Math.max(
    0,
    Math.round(interpolate(frame, [1050, 1500], [171, 0], clamp)),
  );
  const mm = Math.floor(shockwaveSeconds / 60);
  const ss = String(shockwaveSeconds % 60).padStart(2, '0');

  return (
    <AbsoluteFill style={{fontFamily: 'Arial, sans-serif', color: 'white'}}>
      <div
        style={{
          position: 'absolute',
          top: 92,
          left: 70,
          fontSize: 34,
          letterSpacing: 3,
          textShadow: '0 2px 10px rgba(0,0,0,.6)',
        }}
      >
        ALTITUDE {altitude.toLocaleString()} mi
      </div>
      {frame >= 1050 && frame < 1540 ? (
        <div
          style={{
            position: 'absolute',
            top: 92,
            right: 70,
            fontSize: 34,
            letterSpacing: 3,
            textShadow: '0 2px 10px rgba(0,0,0,.6)',
          }}
        >
          SHOCKWAVE {mm}:{ss}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Shockwave = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [1080, 1560], [0, 1], clamp);
  const opacity = interpolate(frame, [1080, 1380, 1560], [0, 0.2, 0.85], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 52% 60%, rgba(255,214,150,0) 0%, rgba(164,123,84,.15) 35%, rgba(87,61,44,.75) 100%)',
        opacity,
        scale: 1 + progress * 0.18,
      }}
    />
  );
};

const Flash = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [688, 696, 724, 770], [0, 1, 0.35, 0], clamp);
  return <AbsoluteFill style={{backgroundColor: 'white', opacity}} />;
};

export const AsteroidSimulation = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const aftermath = interpolate(frame, [1480, 1900], [0, 0.72], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#111'}}>
      <ThreeCanvas width={width} height={height} camera={{position: [0, 2, 8], fov: 52}}>
        <SkyAndGround />
        <Asteroid />
        <Explosion />
      </ThreeCanvas>

      <Hud />
      <Flash />
      <Shockwave />

      <AbsoluteFill
        style={{
          backgroundColor: '#382d27',
          opacity: aftermath,
          mixBlendMode: 'multiply',
        }}
      />

      <Sequence from={1830} durationInFrames={210}>
        <AbsoluteFill
          style={{
            backgroundColor: '#050505',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 100,
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            fontSize: 70,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          What if an asteroid exploded over your town?
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
