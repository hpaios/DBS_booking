import React from "react";
import bgImage from "../../assets/bgBooking.png";
import bgError from "../../assets/bgError.png";
import logo from "../../assets/logo.png";
import { HeaderStyle, HeaderWrapper, Logo } from './ContainerWrapper.style'

interface ContainerWrapperProps {
  isErrorSubmit?: boolean
  children: React.ReactNode
}

const ContainerWrapper: React.FC<ContainerWrapperProps> = ({ isErrorSubmit,children }) => {
  const backgroundImage = isErrorSubmit ? bgError : bgImage
  return (
    <div
      className={HeaderWrapper}
    >
      <div className="absolute inset-0 bg-gradient-to-b to-transparent via-transparent from-[color:var(--color-bg)]/70 h-[120px] z-5"></div>
      <header
        className={HeaderStyle}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <img
          src={logo}
          alt="logo DBS"
          className={Logo}
        />
      </header>
      {children}
    </div>
  );
};

export default ContainerWrapper;