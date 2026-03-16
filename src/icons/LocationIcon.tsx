import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: string
  height?: string
}

const LocationIcon: React.FC<IconProps> = ({
  width,
  height
}) => {
  return (
    <svg width={width || '20'} height={height || "22"} viewBox="0 0 20 22" fill="none">
      <path d="M9.677 0C4.85 0.066 0 4.808 0 9.455C0 15.871 8.773 21.601 9.145 21.837C9.617 22.138 10.087 21.941 10.257 21.825C10.625 21.573 19.278 15.575 19.383 9.407C19.237 4.637 14.533 0.066 9.678 0H9.677ZM12.503 12.129C11.563 13.069 10.638 13.529 9.686 13.529C9.61 13.529 9.534 13.526 9.457 13.52C8.58 13.453 7.761 13.011 6.879 12.128C5.013 10.263 5.013 8.37 6.879 6.504C8.746 4.638 10.637 4.639 12.504 6.504C14.369 8.371 14.369 10.263 12.504 12.128L12.503 12.129Z" fill="white"/>
    </svg>
  );
};

export default LocationIcon;
