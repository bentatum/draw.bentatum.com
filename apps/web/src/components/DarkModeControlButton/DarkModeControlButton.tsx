import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import ControlButton, { ControlButtonProps } from "@/components/ControlButton";
import clsx from "clsx";

const DarkModeControlButton: React.FC<ControlButtonProps> = ({ className, ...props }) => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <ControlButton onClick={toggleTheme} className={clsx("h-12 w-12", className)} {...props}>
      {resolvedTheme !== "dark" ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
    </ControlButton>
  );
};

export default DarkModeControlButton;
