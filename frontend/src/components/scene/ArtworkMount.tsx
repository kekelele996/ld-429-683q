import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Artwork, ArtworkMountPoint } from '../../types';
import { FRAME_STYLE_COLORS } from '../../constants/frameStyles';
import { loadArtworkTexture } from '../../utils/threeUtils';

interface ArtworkMountProps {
  artwork: Artwork;
  mountPoint?: ArtworkMountPoint;
  onFocus: (id: string) => void;
}

export function ArtworkMount({ artwork, mountPoint, onFocus }: ArtworkMountProps) {
  const texture = loadArtworkTexture(artwork.imageUrl);
  const frameWidth = mountPoint?.width ?? 2.45;
  const frameHeight = mountPoint?.height ?? 1.7;
  const artWidth = frameWidth * 0.89;
  const artHeight = frameHeight * 0.84;
  return (
    <group
      position={[artwork.mountPosition.x, artwork.mountPosition.y, artwork.mountPosition.z]}
      rotation={[0, mountPoint?.rotationY ?? 0, 0]}
    >
      <mesh onClick={() => onFocus(artwork.id)}>
        <boxGeometry args={[frameWidth, frameHeight, 0.08]} />
        <meshStandardMaterial color={FRAME_STYLE_COLORS[artwork.frameStyle]} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.055]} onClick={() => onFocus(artwork.id)}>
        <planeGeometry args={[artWidth, artHeight]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[0, -frameHeight / 2 - 0.23, 0.12]} center>
        <button
          className="border border-black/20 bg-[#fffaf1] px-3 py-1 text-xs text-[#1d1d1b] shadow-line"
          onClick={() => onFocus(artwork.id)}
        >
          {artwork.title}
        </button>
      </Html>
    </group>
  );
}
