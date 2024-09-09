import ControlButton from "@/components/ControlButton";
import clsx from "clsx";

interface ColorPickerProps {
  setColor: (color: string) => void;
  color: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ setColor, color }) => {
  const presetColors = [
    { name: "black", hex: "#000000" },
    { name: "red", hex: "#EF4444" },
    { name: "green", hex: "#10B981" },
    { name: "blue", hex: "#3B82F6" },
    { name: "yellow", hex: "#F59E0B" },
  ];

  return (
    <div className="flex items-center gap-1.5 mt-1">
      {presetColors.map(({ name, hex }) => (
        <ControlButton
          key={name}
          className={clsx({
            'bg-black': name === 'black',
            'bg-red-500': name === 'red',
            'bg-green-500': name === 'green',
            'bg-blue-500': name === 'blue',
            'bg-yellow-500': name === 'yellow',
          })}
          onClick={() => setColor(hex)}
        />
      ))}
      <div
        className={clsx("w-7 h-7 rounded ml-1 border border-gray-50", {
          'bg-black': color === '#000000',
          'bg-red-500': color === '#EF4444',
          'bg-green-500': color === '#10B981',
          'bg-blue-500': color === '#3B82F6',
          'bg-yellow-500': color === '#F59E0B',
        })}
      />
    </div>
  );
};

export default ColorPicker;