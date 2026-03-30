export const navButtonClass = `
  py-[var(--space-sm)] 
  px-[var(--space-lg)] 
  bg-[var(--color-bg-secondary)] 
  rounded-[var(--radius-xl)] 
  transition 
  border 
  border-[var(--color-border)] 
  flex 
  items-center 
  hover:border-[var(--color-border-hover)] 
  disabled:bg-[var(--color-disabled)] 
  disabled:cursor-not-allowed 
  disabled:hover:border-[var(--color-border)] 
  cursor-pointer
`;

export const stepClass = `
  w-full h-[0.5rem] flex items-center justify-center transition-colors duration-300
`;

export const stepContainer = `
  relative flex items-center justify-between gap-[4px]
`;