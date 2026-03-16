import React from "react";
import bgImage from "../../assets/bg.png";
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