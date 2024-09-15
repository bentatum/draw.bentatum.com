import fetcher from "@/lib/fetcher";
import { LineData } from "@/types";
import { useCallback } from "react";

const useLinesMutation = () => useCallback(async (lines: LineData[]) => {
  try {
    await fetcher(`/lines`, {
      method: 'POST',
      body: JSON.stringify(lines),
    });
  } catch (error) {
    console.error('Error saving lines:', error);
  }
}, []);

export default useLinesMutation;