export interface LineData {
  points: number[];
  color: string;
  brushRadius: number;
  brushOpacity: number;
}

export type Tool = "pencil" | "hand";