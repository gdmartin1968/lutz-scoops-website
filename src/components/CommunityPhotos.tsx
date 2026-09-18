import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { communityPhotos, COMMUNITY_FADE_MS, COMMUNITY_ROTATION_MS } from "../config/communityPhotos";

export function CommunityPhotos({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const loaded = useRef(new Set<number>());
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || communityPhotos.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex(current => {
        const next = (current + 1) % communityPhotos.length;
        // Keep the current image until the next asset is ready.
        return loaded.current.has(next) ? next : current;
      });
    }, COMMUNITY_ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div data-community-photos className={`relative overflow-hidden bg-[#fffaf5] ${className}`}>
      {communityPhotos.map((photo, photoIndex) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={photoIndex === index ? photo.alt : ""}
          aria-hidden={photoIndex !== index}
          data-community-active={photoIndex === index}
          onLoad={() => { loaded.current.add(photoIndex); }}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: photo.objectPosition, opacity: photoIndex === index ? 1 : 0, transition: reducedMotion ? "none" : `opacity ${COMMUNITY_FADE_MS}ms ease-in-out` }}
        />
      ))}
    </div>
  );
}
