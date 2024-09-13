import useLocalStorage from "@/lib/useLocalStorage";

const useScale = () => {
  return useLocalStorage("canvasScale", 1);
};

export default useScale;