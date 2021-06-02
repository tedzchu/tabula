import { RefObject } from "react";
import { Coordinates } from "../editableBlock/editableBlock.type";

export type Props = {
  onSelect: (tag: string) => void
  close: () => void
  position: Coordinates
}