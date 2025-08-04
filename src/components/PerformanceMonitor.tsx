import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  heroImageLoadTime: number;
  totalLoadTime: number;
  imageSize: number;
  isOptimized: boolean;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    // Monitor hero image performance
    const monitorHeroImage = () => {
      const startTime = performance.now();
      
      // Find hero image element
      const heroSection = document.querySelector('[style*="background-image"]');
      
      if (heroSection) {
        const style = window.getComputedStyle(heroSection);
        const backgroundImage = style.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
          const url = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
          
          // Create a test image to measure load time
          const img = new Image();
          const imageStartTime = performance.now();
          
          img.onload = () => {
            const imageLoadTime = performance.now() - imageStartTime;
            const totalLoadTime = performance.now() - startTime;
            
            // Estimate image size (this is approximate)
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              ctx.drawImage(img, 0, 0);
              
              // Get image data size
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const imageSize = imageData.data.length;
              
              setMetrics({
                heroImageLoadTime: imageLoadTime,
                totalLoadTime,
                imageSize: Math.round(imageSize / 1024), // KB
                isOptimized: url.includes('webp') || url.includes('optimized')
              });
            }
          };
          
          img.src = url;
        }
      }
    };

    // Monitor after a short delay to ensure DOM is ready
    const timer = setTimeout(monitorHeroImage, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || !metrics) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Performance Monitor</h3>
      <div className="space-y-1">
        <div>Hero Image Load: {metrics.heroImageLoadTime.toFixed(0)}ms</div>
        <div>Total Load: {metrics.totalLoadTime.toFixed(0)}ms</div>
        <div>Image Size: {metrics.imageSize}KB</div>
        <div>Optimized: {metrics.isOptimized ? '✅' : '❌'}</div>
        <div className="text-xs text-gray-300 mt-2">
          {metrics.heroImageLoadTime > 1000 ? '⚠️ Slow loading' : '✅ Good performance'}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 