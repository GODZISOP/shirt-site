import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export default function BaseballCapIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Crown of the Cap */}
      <path d="M4 14.5C4 9.8 7.6 6 12 6s8 3.8 8 8.5" />
      {/* Top Button / Eyelet */}
      <circle cx="12" cy="5.5" r="1" />
      {/* Visor / Bill */}
      <path d="M2 14.5c0 0 2-1 6-1 5 0 10 1.5 13 1.5 1.5 0 2 .5 2 1.5s-2 1.5-6 1.5c-4 0-9-1.5-12-1.5-1.5 0-3-.5-3-2z" />
      {/* Seam line */}
      <path d="M12 6.5v8" />
    </svg>
  );
}
