import React, { useRef, useState } from "react";
import { Stage, Layer, Rect, Group, Circle } from "react-konva";
import { URLImage } from "./URLImage";
import { getColor, hexToRgba } from "../utils/getColors";
import { uniqueId } from "../utils/uniqueId";
import type { Position } from "../utils/App.interfaces";
import { getUpdatedRect } from "../utils/getUpdatedRect";
import { MINIMUM_SELECTION_SIZE } from "../utils/App.constants";
import type Konva from "konva";
import { AnalyzeImage } from "./AnalyzeImage";

interface Props {
  imageUrl: string;
}

export const UploadedImage: React.FC<Props> = ({ imageUrl }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [currentRect, setCurrentRect] = useState<Position | null>(null);
  const [rectangles, setRectangles] = useState<Position[]>([]);
  const [startPos, setStartPos] = useState<Pick<Position, "x" | "y"> | null>(
    null
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredRect, setHoveredRect] = useState<string | null>(null);

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (pointerPos) {
      setStartPos({ x: pointerPos.x, y: pointerPos.y });
      setCurrentRect({
        x: pointerPos.x,
        y: pointerPos.y,
        id: uniqueId(),
        width: 0,
        height: 0,
        color: getColor(rectangles.length),
      });
      setIsDrawing(true);
      if (!hoveredRect) {
        setHoveredRect(null);
      }
    }
  };

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (!isDrawing || !startPos) return;
    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (pointerPos) {
      const newW = pointerPos.x - startPos.x;
      const newH = pointerPos.y - startPos.y;
      setCurrentRect((prevState) => ({
        x: startPos.x,
        y: startPos.y,
        width: newW,
        height: newH,
        color: prevState?.color || getColor(rectangles.length),
        id: prevState?.id || uniqueId(),
      }));
    }
  };

  const handleMouseUp = () => {
    if (
      currentRect &&
      (currentRect.width <= MINIMUM_SELECTION_SIZE ||
        currentRect.height <= MINIMUM_SELECTION_SIZE)
    ) {
      // If the rectangle is too small, do not add it
      setIsDrawing(false);
      setCurrentRect(null);
      setStartPos(null);
      return;
    }
    if (currentRect) {
      setRectangles([...rectangles, currentRect]);
    }
    setIsDrawing(false);
    setCurrentRect(null);
    setStartPos(null);
  };

  const handleRectClick = (rectId: string) => {
    setRectangles(rectangles.filter((rect) => rect.id !== rectId));
  };

  const handleAnchorDrag = (
    rectId: string,
    anchor: string,
    pos: Pick<Position, "x" | "y">
  ) => {
    setRectangles((rectangles) =>
      rectangles.map((rect) =>
        rect.id !== rectId ? rect : getUpdatedRect(rect, anchor, pos)
      )
    );
  };

  return (
    <div className="relative w-full aspect-video flex flex-col items-center justify-center">
      <Stage
        ref={stageRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          <URLImage src={imageUrl} />
          {rectangles.map((r) => (
            <Group
              key={r.id}
              onMouseEnter={() => {
                setHoveredRect(r.id);
              }}
              onTouchStart={() => {
                setHoveredRect((prevState) => (!prevState ? r.id : null));
              }}
              onMouseLeave={() => {
                setHoveredRect(null);
              }}
            >
              <Rect
                x={r.x}
                y={r.y}
                width={r.width}
                height={r.height}
                stroke={hoveredRect === r.id ? "#fff" : r.color}
                fill={
                  hoveredRect === r.id
                    ? hexToRgba("#fff", 0.4)
                    : hexToRgba(r.color, 0.5)
                }
                dash={[10, 5]}
                strokeWidth={10}
              />
              {hoveredRect === r.id && [
                // Top-left
                <Circle
                  key="tl"
                  x={r.x}
                  y={r.y}
                  radius={7}
                  fill="#fff"
                  stroke={r.color}
                  strokeWidth={2}
                  draggable
                  onDragMove={(e) =>
                    handleAnchorDrag(r.id, "tl", {
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }
                  onMouseDown={(e) => (e.cancelBubble = true)}
                  onTouchStart={(e) => (e.cancelBubble = true)}
                />,
                // Top-right
                <Circle
                  key="tr"
                  x={r.x + r.width}
                  y={r.y}
                  radius={7}
                  fill="#fff"
                  stroke={r.color}
                  strokeWidth={2}
                  draggable
                  onDragMove={(e) =>
                    handleAnchorDrag(r.id, "tr", {
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }
                  onMouseDown={(e) => (e.cancelBubble = true)}
                  onTouchStart={(e) => (e.cancelBubble = true)}
                />,
                // Bottom-left
                <Circle
                  key="bl"
                  x={r.x}
                  y={r.y + r.height}
                  radius={7}
                  fill="#fff"
                  stroke={r.color}
                  strokeWidth={2}
                  draggable
                  onDragMove={(e) =>
                    handleAnchorDrag(r.id, "bl", {
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }
                  onMouseDown={(e) => (e.cancelBubble = true)}
                  onTouchStart={(e) => (e.cancelBubble = true)}
                />,
                // Bottom-right
                <Circle
                  key="br"
                  x={r.x + r.width}
                  y={r.y + r.height}
                  radius={7}
                  fill="#fff"
                  stroke="#d00"
                  strokeWidth={2}
                  draggable
                  onDragMove={(e) =>
                    handleAnchorDrag(r.id, "br", {
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }
                  onMouseDown={(e) => (e.cancelBubble = true)}
                  onTouchStart={(e) => (e.cancelBubble = true)}
                />,
              ]}
              {hoveredRect === r.id && (
                <URLImage
                  maxHeight={48}
                  maxWidth={48}
                  x={r.x + r.width / 2 - 12}
                  y={r.y + r.height / 2 - 12}
                  onClick={() => handleRectClick(r.id)}
                  onTap={() => handleRectClick(r.id)}
                  src="/delete.svg"
                />
              )}
            </Group>
          ))}
          {currentRect && (
            <Rect
              x={currentRect.x}
              y={currentRect.y}
              width={currentRect.width}
              height={currentRect.height}
              stroke={currentRect.color}
              fill={hexToRgba(currentRect.color, 0.3)}
              strokeWidth={10}
              dash={[10, 5]}
            />
          )}
        </Layer>
      </Stage>
      <AnalyzeImage
        key={rectangles.map((r) => r.id).join(",")}
        positions={rectangles}
        stageRef={stageRef}
      />
    </div>
  );
};
