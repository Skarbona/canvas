import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadedImage } from "./Image";

interface ImageUploadProps {
  onImageUpload?: (file: File) => void;
  currentPreview?: string;
}

export const ImageUpload = ({
  onImageUpload,
  currentPreview,
}: ImageUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onImageUpload?.(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  if (currentPreview) {
    return <UploadedImage imageUrl={currentPreview} />;
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full aspect-video border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className="text-gray-500 w-[250px] h-[150px] flex items-center justify-center">
          {isDragActive ? (
            <p>Drop the image here</p>
          ) : (
            <p>Drag and drop an image here, or click to select</p>
          )}
        </div>
      </div>
    </div>
  );
};
