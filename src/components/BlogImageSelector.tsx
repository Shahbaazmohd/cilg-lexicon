import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BLOG_IMAGES, getImageByCategory, getRandomImage } from '@/lib/imageUtils';

interface BlogImageSelectorProps {
  onImageSelect: (imagePath: string) => void;
  currentImage?: string;
  category?: string;
}

const BlogImageSelector = ({ onImageSelect, currentImage, category }: BlogImageSelectorProps) => {
  const [selectedImage, setSelectedImage] = useState(currentImage || '');

  const handleImageSelect = (imagePath: string) => {
    setSelectedImage(imagePath);
    onImageSelect(imagePath);
  };

  const handleCategoryImage = () => {
    if (category) {
      const categoryImage = getImageByCategory(category);
      handleImageSelect(categoryImage);
    }
  };

  const handleRandomImage = () => {
    const randomImage = getRandomImage();
    handleImageSelect(randomImage);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Blog Post Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          {category && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCategoryImage}
            >
              Use Category Image
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRandomImage}
          >
            Random Image
          </Button>
        </div>

        {/* Available Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(BLOG_IMAGES).map(([key, imagePath]) => {
            if (typeof imagePath === 'string') {
              return (
                <div
                  key={key}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === imagePath 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleImageSelect(imagePath)}
                >
                  <img
                    src={imagePath}
                    alt={key}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                    {key}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Category Images */}
        {Object.keys(BLOG_IMAGES.categoryImages).length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Category-Specific Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(BLOG_IMAGES.categoryImages).map(([categoryName, imagePath]) => (
                <div
                  key={categoryName}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === imagePath 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleImageSelect(imagePath)}
                >
                  <img
                    src={imagePath}
                    alt={categoryName}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                    {categoryName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Selection */}
        {selectedImage && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Selected Image:</p>
            <div className="flex items-center gap-3">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-16 h-16 object-cover rounded"
              />
              <span className="text-sm text-muted-foreground">{selectedImage}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogImageSelector; 