import React from "react";

interface ContainerWrapperProps {
  children: React.ReactNode;
}

const ContainerWrapper: React.FC<ContainerWrapperProps> = ({ children }) => {
  return (
    <div className="mx-auto max-w-[600px] w-full bg-[var(--color-bg-secondary)] rounded-[var(--radius-lg)] box-border p-[var(--space-lg)]">
      {children}
    </div>
  );
};

export default ContainerWrapper;