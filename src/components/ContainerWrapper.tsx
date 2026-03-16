import React from "react";
import bgImage from "../assets/bg.png";
import logo from "../assets/logo.png";

interface ContainerWrapperProps {
  children: React.ReactNode;
}

const ContainerWrapper: React.FC<ContainerWrapperProps> = ({ children }) => {
  return (
     <div
      className="mx-auto max-w-[600px] w-full rounded-[var(--radius-lg)] box-border p-[var(--space-lg)] bg-cover bg-center"
    >
      <header
        className="relative h-[100px] bg-cover bg-center rounded-t-[1rem]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute w-full inset-0 bg-[color:var(--color-bg)]/50 h-[100px]"></div>

        <img
          src={logo}
          alt="logo DBS"
          className="absolute left-1/2 top-[80px] h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
        />

      </header>
      {children}
    </div>
  );
};

export default ContainerWrapper;