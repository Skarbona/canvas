import { Image } from "react-konva";
import useImage from "use-image";

interface URLImageProps {
  src: string;
  maxWidth?: number;
  maxHeight?: number;
  x?: number;
  y?: number;
  onClick?: () => void;
  onTap?: () => void;
}

export const URLImage = ({
  src,
  maxWidth = 800,
  x,
  y,
  maxHeight = 600,
  onClick,
  onTap,
}: URLImageProps) => {
  const [image] = useImage(src, "anonymous");

  if (!image) {
    return null;
  }

  // Calculate scaling to fit within maxWidth and maxHeight while maintaining aspect ratio
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height);

  return (
    <Image
      x={x}
      y={y}
      onClick={onClick}
      onTap={onTap}
      image={image}
      scaleX={scale}
      scaleY={scale}
      width={image.width}
      height={image.height}
    />
  );
};
