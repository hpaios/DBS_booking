import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: string
  height?: string
}

const ErrorIcon: React.FC<IconProps> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><linearGradient id="SVGID_1_" x1="37.5" x2="10.5" y1="10.5" y2="37.5" gradientUnits="userSpaceOnUse"><stop offset=".014" stop-color="#fe6d60"/><stop offset=".046" stop-color="#fe766a"/><stop offset=".208" stop-color="#fea097"/><stop offset=".37" stop-color="#ffc2bd"/><stop offset=".532" stop-color="#ffddda"/><stop offset=".692" stop-color="#fff0ee"/><stop offset=".849" stop-color="#fffbfb"/><stop offset="1" stop-color="#fff"/></linearGradient><path fill="url(#SVGID_1_)" d="M39.975,12.975l-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0L24,16.222l-8.197-8.197 c-0.781-0.781-2.047-0.781-2.828,0l-4.95,4.95c-0.781,0.781-0.781,2.047,0,2.828L16.222,24l-8.197,8.197 c-0.781,0.781-0.781,2.047,0,2.828l4.95,4.95c0.781,0.781,2.047,0.781,2.828,0L24,31.778l8.197,8.197 c0.781,0.781,2.047,0.781,2.828,0l4.95-4.95c0.781-0.781,0.781-2.047,0-2.828L31.778,24l8.197-8.197 C40.756,15.022,40.756,13.756,39.975,12.975z"/><path fill="none" stroke="#e02f24" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M11.728,28.494l-3.703,3.703c-0.781,0.781-0.781,2.047,0,2.828l4.95,4.95c0.781,0.781,2.047,0.781,2.828,0 L24,31.778l8.197,8.197c0.781,0.781,2.047,0.781,2.828,0l4.95-4.95c0.781-0.781,0.781-2.047,0-2.828L31.778,24l8.197-8.197 c0.781-0.781,0.781-2.047,0-2.828l-2.571-2.571"/><path fill="none" stroke="#e02f24" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M33.079,7.143L24,16.222l-8.197-8.197c-0.781-0.781-2.047-0.781-2.828,0l-4.95,4.95 c-0.781,0.781-0.781,2.047,0,2.828L16.222,24"/></svg>
  );
};

export default ErrorIcon;
