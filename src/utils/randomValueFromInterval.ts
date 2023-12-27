// get random value between two numbers



export const randomValueFromInterval =
  ({ min, max }: { min: number; max: number }): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
};