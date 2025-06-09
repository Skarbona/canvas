import type { Position } from "./App.interfaces";

export function getUpdatedRect(
  rect: Position,
  anchor: string,
  pos: Pick<Position, "x" | "y">
) {
  let { x, y, width, height } = rect;
  const { color, id } = rect;
  switch (anchor) {
    case "tl": // top-left
      width = width + (x - pos.x);
      height = height + (y - pos.y);
      x = pos.x;
      y = pos.y;
      break;
    case "tr": // top-right
      width = pos.x - x;
      height = height + (y - pos.y);
      y = pos.y;
      break;
    case "bl": // bottom-left
      width = width + (x - pos.x);
      x = pos.x;
      height = pos.y - y;
      break;
    case "br": // bottom-right
      width = pos.x - x;
      height = pos.y - y;
      break;
  }
  // Prevent negative width/height
  width = Math.max(10, width);
  height = Math.max(10, height);
  return { x, y, width, height, color, id };
}
