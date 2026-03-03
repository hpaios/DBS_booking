export const toggleId = (arr: number[], id: number): number[] => {
  return arr.includes(id)
    ? arr.filter((item) => item !== id)
    : [...arr, id];
};
