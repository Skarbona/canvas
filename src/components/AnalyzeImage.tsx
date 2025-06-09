import React, { useState } from "react";
import type { ImageShelfProducts, Position } from "../utils/App.interfaces";
import { Stage } from "konva/lib/Stage";
import { MESSAGE_TO_AI } from "../utils/App.constants";
import { hexToRgba } from "../utils/getColors";

interface Props {
  positions?: Position[];
  stageRef: React.RefObject<Stage | null>;
}

export const AnalyzeImage: React.FC<Props> = ({ positions, stageRef }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ImageShelfProducts | null>(null);

  const getScreenshotForBox = (box: Position): string => {
    return (
      stageRef?.current?.toDataURL({
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      }) || ""
    );
  };

  const handleAnalyzeImage = async () => {
    if (!positions || !stageRef?.current) return;

    setLoading(true);

    const screenshots: string[] = [];
    try {
      // (base64 dataURL)
      for (const position of positions) {
        const dataUrl = getScreenshotForBox(position);
        if (dataUrl) {
          screenshots.push(dataUrl);
        }
      }

      const messages = [
        {
          role: "user",
          content: [
            MESSAGE_TO_AI,
            ...screenshots.map((dataUrl) => ({
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            })),
          ],
        },
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages,
          max_tokens: 1000,
        }),
      });

      const json = await res.json();
      setData(JSON.parse(json.choices[0].message.content));
    } catch (error) {
      console.error("Error analyzing image:", error);
      return;
    } finally {
      setLoading(false);
    }
  };

  const disabled = !positions || positions.length === 0 || loading;

  return (
    <div className="flex flex-col items-center w-full">
      {data && (
        <div className="mt-4 flex flex-col items-start w-full">
          <h2 className="text-lg font-semibold">Analysis Results:</h2>
          <div className="mt-4 w-full flex flex-color flex-start gap-4">
            {Object.values(data).map((image, index) => (
              <div
                key={index}
                className="mb-2 flex flex-col flex-start justify-start"
              >
                <h3
                  className="font-semibold radius-lg px-2 py-1 mb-2"
                  style={{
                    backgroundColor: hexToRgba(
                      positions?.[index].color ?? "",
                      0.4
                    ),
                  }}
                >
                  Image {index}
                </h3>
                <ol>
                  {image.map((shelf, shelfIndex) => (
                    <li key={shelfIndex} className="mb-2">
                      <strong>Shelf: {shelf.shelf}</strong>
                      <ul>
                        {shelf.products.map((product, productIndex) => (
                          <li key={productIndex}>{product}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="text-gray-600 mb-4">
        Click the button below to analyze the image and get shelf product
        information.
      </p>
      <button
        style={{
          backgroundColor: disabled ? "#ccc" : "#007bff",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        disabled={disabled}
        onClick={handleAnalyzeImage}
      >
        {loading ? "Loading..." : "Analyze image"}
      </button>
    </div>
  );
};
