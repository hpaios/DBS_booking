import React from "react";

interface PhoneProps extends React.SVGProps<SVGSVGElement> {
  width?: string
  height?: string
}

const PhoneIcon: React.FC<PhoneProps> = () => {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <g clip-path="url(#clip0_1237_948)">
    <path d="M20.2425 14.4405C18.8956 14.4405 17.5731 14.2298 16.3198 13.8157C15.7057 13.6062 14.9508 13.7984 14.576 14.1833L12.1023 16.0507C9.23355 14.5193 7.46644 12.7528 5.956 9.90556L7.76843 7.49633C8.23931 7.02608 8.4082 6.33915 8.20585 5.69462C7.78991 4.43478 7.57862 3.11289 7.57862 1.76539C7.57868 0.791943 6.78673 0 5.81335 0H1.77314C0.799755 0 0.0078125 0.791943 0.0078125 1.76533C0.0078125 12.9229 9.08499 22 20.2425 22C21.2159 22 22.0079 21.2081 22.0079 20.2347V16.2058C22.0078 15.2324 21.2159 14.4405 20.2425 14.4405Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_1237_948">
    <rect width="22" height="22" fill="none"/>
    </clipPath>
    </defs>
    </svg>
  );
};

export default PhoneIcon;