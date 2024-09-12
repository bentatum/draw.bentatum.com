export const presetColors = [
    { name: "black", hex: "#000000", tailwindClass: "to-black" },
    { name: "white", hex: "#FFFFFF", tailwindClass: "to-white" },
    { name: "red", hex: "#EF4444", tailwindClass: "to-red-500" },
    { name: "green", hex: "#10B981", tailwindClass: "to-green-500" },
    { name: "blue", hex: "#3B82F6", tailwindClass: "to-blue-500" },
    { name: "yellow", hex: "#F59E0B", tailwindClass: "to-yellow-500" },
    { name: "purple", hex: "#8B5CF6", tailwindClass: "to-purple-500" },
  ];
  
  export const getColorTailwindClass = (colorHex: string): string => {
    const colorObj = presetColors.find(c => c.hex === colorHex);
    return colorObj ? colorObj.tailwindClass : "to-black dark:to-white";
  };