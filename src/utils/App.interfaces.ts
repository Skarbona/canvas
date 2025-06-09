export interface Position {
  x: number;
  y: number;
  id: string;
  width: number;
  height: number;
  color: string;
}

export interface ShelfProducts {
  shelf: string;
  products: string[];
}

export interface ImageShelfProducts {
  [imageName: string]: ShelfProducts[];
}
