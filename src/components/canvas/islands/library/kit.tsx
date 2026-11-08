// World 5 ride pieces: downloaded when someone enters the world (see world/rideKits.ts).
import { useEffect } from 'react';
import { useLibraryTextures, type LibraryTextures } from './libraryTextures';

/** Draws the book pages and ring halo and hands them to BookstagramIsland (freed when the ride ends). */
export function LibraryTextureMaker({ onChange }: { onChange: (tex: LibraryTextures | null) => void }) {
  const tex = useLibraryTextures(true);
  useEffect(() => {
    onChange(tex);
    return () => onChange(null);
  }, [tex, onChange]);
  return null;
}
