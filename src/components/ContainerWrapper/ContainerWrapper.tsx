import React from "react";
import bgImage from "../../assets/bgBooking.png";
import logo from "../../assets/logo.png";
import { HeaderStyle, HeaderWrapper, Logo } from './ContainerWrapper.style'

interface ContainerWrapperProps {
  children: React.ReactNode;
}

const ContainerWrapper: React.FC<ContainerWrapperProps> = ({ children }) => {
  return (
    <div
      className={HeaderWrapper}
    >
      <div className="absolute inset-0 bg-gradient-to-b to-transparent via-transparent from-[color:var(--color-bg)]/70 h-[120px] z-5"></div>
      <header
        className={HeaderStyle}
        style={{ backgroundImage: `url(${bgImage})` }}
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