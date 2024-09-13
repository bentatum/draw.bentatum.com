import { useTheme } from "next-themes";

const BLACK = '#000000';
const WHITE = '#FFFFFF';

export const useDefaultLineColor = () => {
  const { resolvedTheme } = useTheme();
  return (lineColor: string) => {
    const isBlackOrWhite = [BLACK, WHITE].includes(lineColor);
    const adjustedColor = resolvedTheme === 'dark' ? WHITE : BLACK;
    return isBlackOrWhite ? adjustedColor : lineColor;
  }
}