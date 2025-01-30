import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImageToStorage } from '@/utils/supabase_utils';

interface ImagePreview {
  file: File;
  preview: string;
}

export default function StoryImageUpload({ userId }: { userId: string }) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

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

  const handleSubmit = async () => {
    if (images.length === 0) return;
    setIsUploading(true);

    try {
      // Test with first image
      const imageUrl = await uploadImageToStorage(images[0].file, userId);
      console.log('Uploaded image URL:', imageUrl);
      
      // Clear the preview
      URL.revokeObjectURL(images[0].preview);
      setImages([]);
      
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
              <img
                src={image.preview}
                alt={`Upload preview ${index + 1}`}
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

      {images.length > 0 && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isUploading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isUploading ? 'Uploading...' : `Upload ${images.length} Images`}
          </Button>
        </div>
      )}
    </div>
  );
}