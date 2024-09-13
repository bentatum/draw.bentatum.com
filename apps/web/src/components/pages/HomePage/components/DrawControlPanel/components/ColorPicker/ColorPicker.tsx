import ControlButton from "@/components/ControlButton";
import clsx from "clsx";
import { useTheme } from "next-themes";

interface ColorPickerProps {
  setColor: (color: string) => void;
  color: string;
  onColorChange?: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ setColor, color, onColorChange }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const presetColors = [
    { name: isDarkMode ? "white" : "black", hex: isDarkMode ? "#FFFFFF" : "#000000" },
    { name: "red", hex: "#EF4444" },
    { name: "green", hex: "#10B981" },
    { name: "blue", hex: "#3B82F6" },
    { name: "yellow", hex: "#F59E0B" },
    { name: "purple", hex: "#8B5CF6" },
  ];

  return (
    <div className="flex items-center gap-1.5 mt-1">
      {presetColors.map(({ name, hex }) => {
        const colorClassName = clsx({
          'bg-black dark:bg-white': name === 'white' || name === 'black',
          'bg-red-500': name === 'red',
          'bg-green-500': name === 'green',
          'bg-blue-500': name   === 'blue',
          'bg-yellow-500': name === 'yellow',
          'bg-purple-500': name === 'purple',
        });
        
        return (
          <ControlButton
            key={name}
            selected={color === hex}
            selectedClassName={colorClassName}
            className={colorClassName}
            onClick={() => {
              setColor(hex);
              onColorChange?.();
            }}
          />
        );
      })}
    </div>
  );
};

export default ColorPicker;