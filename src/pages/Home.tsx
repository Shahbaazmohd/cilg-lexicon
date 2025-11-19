import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/BlogCard';
import NewsTicker from '@/components/NewsTicker';
import CosmopolitanBulletin from '@/components/CosmopolitanBulletin';

import { SettingsService } from '@/lib/settingsService';
import { DynamicImageService } from '@/lib/dynamicImageService';
import { BlogSection } from '@/components/ui/blog-section';
import { ModernHeroSection } from '@/components/ui/modern-hero-section';
import { BentoDemo } from '@/components/ui/bento-demo';

import heroImage from '@/assets/hero-image.jpg';
import academicBuilding from '@/assets/academic-building.jpg';
import lawBooks from '@/assets/law-books.jpg';
import { supabase } from '@/integrations/supabase/client';
import { getImageWithFallback } from '@/lib/imageUtils';
import { BlogImageService } from '@/lib/blogImageService';

const Home = () => {
  const [heroImageUrl, setHeroImageUrl] = useState(heroImage);
  const [aboutImageUrl, setAboutImageUrl] = useState(academicBuilding);
  const [researchAreaImages, setResearchAreaImages] = useState({
    'research-area-1': lawBooks,
    'research-area-2': lawBooks,
    'research-area-3': academicBuilding,
  });
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dynamic images on component mount
  useEffect(() => {
    loadDynamicImages();
    fetchBlogPosts();
  }, []);

  const loadDynamicImages = async () => {
    try {
      // Load hero image
      const heroUrl = await DynamicImageService.getImageUrlWithFallback('hero');
      setHeroImageUrl(heroUrl);

      // Load about image
      const aboutUrl = await DynamicImageService.getImageUrlWithFallback('about');
      setAboutImageUrl(aboutUrl);

      // Load research area images
      const researchArea1Url = await DynamicImageService.getImageUrlWithFallback('research-area-1');
      const researchArea2Url = await DynamicImageService.getImageUrlWithFallback('research-area-2');
      const researchArea3Url = await DynamicImageService.getImageUrlWithFallback('research-area-3');

      setResearchAreaImages({
        'research-area-1': researchArea1Url,
        'research-area-2': researchArea2Url,
        'research-area-3': researchArea3Url,
      });
    } catch (error) {
      console.error('Error loading dynamic images:', error);
      // Keep default images if loading fails
    }
  };

  const fetchBlogPosts = async () => {
    try {
      // Fetch featured posts only
      let { data: featuredData, error: featuredError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('featured', true)
        .eq('status', 'approved')
        .order('featured_order', { ascending: true })
        .order('created_at', { ascending: false });

      // If featured_order doesn't exist, fallback to created_at ordering
      if (featuredError && featuredError.message.includes('featured_order')) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('featured', true)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (fallbackError) {
          console.error('Error fetching featured posts:', fallbackError);
        } else {
          featuredData = fallbackData;
        }
      } else if (featuredError) {
        console.error('Error fetching featured posts:', featuredError);
      }

      // Transform data to match BlogSection props
      const transformPost = (post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...',
        author: post.author_name || 'Anonymous',
        date: new Date(post.created_at).toLocaleDateString(),
        category: post.category,
        featured: post.featured,
        image_url: BlogImageService.getImageUrlWithFallback(post.image_url, post.category),
        created_at: post.created_at
      });

      setFeaturedPosts((featuredData || []).map(transformPost));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <ModernHeroSection 
        heroImageUrl={heroImageUrl}
      />

      {/* About Preview */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="academic-container">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="academic-heading text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-6 text-center lg:text-left">
                Pioneering Research in International Law
              </h2>
              <div className="space-y-4 md:space-y-6 academic-text text-base md:text-lg text-center lg:text-left">
                <p>
                  The Cell for International Law and Governance (CILG) stands at the forefront 
                  of legal scholarship, fostering innovative research and discourse in international
                  law, policy, and governance.
                </p>
                <p>
                  Our multidisciplinary approach brings together scholars, practitioners, and 
                  students to explore complex global challenges through the lens of legal analysis 
                  and policy development.
                </p>
                <div className="flex justify-center lg:justify-start">
                  <Button asChild variant="outline" className="mt-4 md:mt-6">
                    <Link to="/about" className="flex items-center space-x-2">
                      <span>Read Our Story</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 mb-6 lg:mb-0">
              <img
                src={aboutImageUrl}
                alt="Academic Building"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="bg-muted/30">
        {loading ? (
          <div className="academic-container py-16">
            <div className="text-center mb-12">
              <div className="h-8 bg-muted-foreground/20 rounded mb-4 w-64 mx-auto"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-96 mx-auto"></div>
            </div>
            <div className="relative">
              <div className="overflow-x-auto scroll-smooth pb-4 scrollbar-thin">
                <div className="flex gap-6 min-w-max px-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-muted rounded-lg p-6 animate-pulse cursor-pointer hover:shadow-lg transition-all duration-300 min-w-[300px] max-w-[350px] flex-shrink-0 h-full flex flex-col">
                      <div className="h-48 bg-muted-foreground/20 rounded mb-4 flex-shrink-0"></div>
                      <div className="flex flex-col flex-grow">
                        <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded mb-2 w-2/3"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded mb-2 w-1/2"></div>
                        <div className="mt-auto">
                          <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
                     <BlogSection 
             posts={featuredPosts} 
             title="Featured Research"
             showViewAll={true}
             maxPosts={8}
           />
        )}
      </section>

      {/* Research Areas */}
      <section className="py-8 md:py-16">
        <div className="academic-container">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="academic-heading text-2xl sm:text-3xl md:text-4xl mb-3 md:mb-4">Research Areas</h2>
            <p className="academic-text text-base md:text-lg max-w-2xl mx-auto px-4">
              Our research spans across multiple disciplines within international law and governance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0">
            {[
              {
                title: 'International Criminal Law',
                description: 'Exploring justice mechanisms and accountability in international crimes',
                image: researchAreaImages['research-area-1'],
              },
              {
                title: 'International Relations',
                description: 'Diplomacy, foreign policy, and global governance dynamics',
                image: researchAreaImages['research-area-2'],
              },
              {
                title: 'International Investment and Trade Law',
                description: 'Legal frameworks governing cross-border investment and international trade',
                image: researchAreaImages['research-area-3'],
              },
            ].map((area, index) => (
              <div key={index} className="academic-card p-4 md:p-6 group hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-3 md:mb-4">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="academic-heading text-lg md:text-xl mb-2 md:mb-3">{area.title}</h3>
                <p className="academic-text text-sm md:text-base">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Services Grid */}
      <section className="py-8 md:py-16 bg-muted/30">
        <div className="academic-container px-4 sm:px-0">
          <BentoDemo />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 md:py-16 bg-primary text-primary-foreground">
        <div className="academic-container text-center px-4 sm:px-0">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-6">
            Join Our Academic Community
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Contribute to the discourse on international law and governance. 
            Submit your research or join our upcoming events.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-black hover:bg-primary-foreground hover:text-primary">
              <Link to="/submit-blog">Submit Research</Link>
            </Button>
            <Button asChild size="lg" className="bg-academic hover:bg-academic/90">
              <Link to="/events">View Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Ticker */}
      <NewsTicker />
      
      {/* Cosmopolitan Bulletin */}
      <CosmopolitanBulletin />
    </div>
  );
};

export default Home;