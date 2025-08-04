import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsService } from '@/lib/settingsService';
import { preloadImage, optimizeHeroImage } from '@/lib/imageOptimization';
import heroImage from '@/assets/hero-image.jpg';

interface OptimizedHeroProps {
  className?: string;
}

const OptimizedHero = ({ className = '' }: OptimizedHeroProps) => {
  const [heroImageUrl, setHeroImageUrl] = useState<string>(heroImage);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Preload the hero image
  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        // Start with default image for immediate display
        setHeroImageUrl(heroImage);
        setImageLoaded(true);
        setIsLoading(false);

        // Then try to load the custom hero image
        const customUrl = await SettingsService.getHeroImageUrl();
        
        if (customUrl && customUrl !== heroImage) {
          // Optimize and preload the custom image
          const optimizedUrl = optimizeHeroImage(customUrl);
          
          try {
            await preloadImage(optimizedUrl);
            setHeroImageUrl(optimizedUrl);
            setImageLoaded(true);
            setIsLoading(false);
          } catch (error) {
            console.warn('Failed to load optimized hero image, using fallback');
            setFallbackUsed(true);
            setImageLoaded(true);
            setIsLoading(false);
          }
        } else {
          setImageLoaded(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading hero image:', error);
        setFallbackUsed(true);
        setImageLoaded(true);
        setIsLoading(false);
      }
    };

    loadHeroImage();
  }, []);

  // Preload the image in the background
  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => {
        console.warn('Image failed to load, using fallback');
        setFallbackUsed(true);
        setImageLoaded(true);
      };
    }
  }, [heroImageUrl]);

  return (
    <section className={`relative h-[70vh] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-navy/80 z-20 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}

      {/* Background image with optimization */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Hidden image for preloading */}
        <img
          ref={imageRef}
          src={heroImageUrl}
          alt=""
          className="hidden"
          loading="eager"
          decoding="async"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-navy/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 academic-container text-center text-white">
        <h1 className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
          Centre for International<br />
          <span className="text-gold">Law & Governance</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Advancing academic research and discourse in international law, policy, and governance 
          through scholarly excellence and innovative thinking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-academic hover:bg-academic/90 text-academic-foreground">
            <Link to="/about" className="flex items-center space-x-2">
              <span>Learn More</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-navy">
            <Link to="/submit-blog">Submit Manuscript</Link>
          </Button>
        </div>
      </div>


    </section>
  );
};

export default OptimizedHero; 