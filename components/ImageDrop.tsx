import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

// TODO: Add database image upload
// import { uploadImageToStorage } from '@/utils/supabase_utils';

interface ImagePreview {
  file: File;
  preview: string;
}

interface StoryImageUploadProps {
  onImagesUploaded: () => void;
}

export default function StoryImageUpload({ onImagesUploaded }: StoryImageUploadProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => {
      const updatedImages = [...prev, ...newImages];
      // Trigger checkbox when first image is added
      if (prev.length === 0 && updatedImages.length > 0) {
        onImagesUploaded();
      }
      return updatedImages;
    });
  }, [onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'}
        `}
      >
        <input {...getInputProps()} />
        <ImageIcon className="mx-auto h-12 w-12 text-purple-400" />
        <p className="mt-2 text-sm text-purple-600">
          Drop images here, or click to select files
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={image.preview}
                alt={`Upload preview ${index + 1}`}
                width={128}
                height={128}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg 
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}