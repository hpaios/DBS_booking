import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: string
  height?: string
}

const InfoIcon: React.FC<IconProps> = ({
  width,
  height
}) => {
  return (
    <svg width={width || '27'} height={height || "27"} viewBox="0 0 27 27" fill="none">
      <path d="M13.3333 0C5.9696 0 0 5.96934 0 13.3333C0 20.6973 5.9696 26.6667 13.3333 26.6667C20.6971 26.6667 26.6667 20.6973 26.6667 13.3333C26.6667 5.96934 20.6971 0 13.3333 0ZM13.3333 6.66667C14.0697 6.66667 14.6667 7.264 14.6667 8C14.6667 8.736 14.0697 9.33333 13.3333 9.33333C12.5969 9.33333 12 8.736 12 8C12 7.264 12.5969 6.66667 13.3333 6.66667ZM13.3333 10.6667C14.0697 10.6667 14.6667 11.264 14.6667 12V18.6667C14.6667 19.4027 14.0697 20 13.3333 20C12.5969 20 12 19.4027 12 18.6667V12C12 11.264 12.5969 10.6667 13.3333 10.6667Z" fill="white"/>
      </svg>
  );
};

export default InfoIcon;