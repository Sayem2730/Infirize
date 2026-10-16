"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

// Shows an image. If there is no file yet, shows a blue block instead.
export default function SiteImage({
  src,
  alt,
  className = "",
  sizes = "(min-width: 768px) 33vw, 100vw",
  priority = false,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div role="img" aria-label={alt} className={`bg-accent ${className}`} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={src.startsWith("http")}
        onError={() => setFailed(true)}
        className="object-cover"
      />
    </div>
  );
}
