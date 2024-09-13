import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useLinesQuery from "./useLinesQuery";
import { LineData } from "@/types";

const useLines = (): [LineData[], Dispatch<SetStateAction<LineData[]>>]  => {
  const { lines: fetchedLines } = useLinesQuery();
  const [lines, setLines] = useState<LineData[]>([]);

  useEffect(() => {
    if (fetchedLines) {
      setLines(fetchedLines);
    }
  }, [fetchedLines]);

  return [lines, setLines];
};

export default useLines;