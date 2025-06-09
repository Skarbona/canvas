import { useState } from "react";
import "./App.css";
import { ImageUpload } from "./components/ImageUpload";

function App() {
  const [uploadedImage, setUploadedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage({
        file,
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleResetImage = () => {
    setUploadedImage(null);
  };

  return (
    <>
      <div className="p-5 max-w-2xl mx-auto">
        <div className="flex justify-between flex-col items-center mb-4">
          <h1 className="text-2xl font-bold">Shelfie</h1>
          {uploadedImage && (
            <button
              onClick={handleResetImage}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Remove Image
            </button>
          )}
        </div>
        <ImageUpload
          key={uploadedImage?.file.name || "image-upload"}
          onImageUpload={handleImageUpload}
          currentPreview={uploadedImage?.preview}
        />
      </div>
    </>
  );
}

export default App;
