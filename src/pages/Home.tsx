import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/BlogCard';
import NewsTicker from '@/components/NewsTicker';
import CosmopolitanBulletin from '@/components/CosmopolitanBulletin';
import { SettingsService } from '@/lib/settingsService';

import heroImage from '@/assets/hero-image.jpg';
import academicBuilding from '@/assets/academic-building.jpg';
import lawBooks from '@/assets/law-books.jpg';
import { supabase } from '@/integrations/supabase/client';
import { getImageWithFallback } from '@/lib/imageUtils';

const Home = () => {
  const [heroImageUrl, setHeroImageUrl] = useState(heroImage);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load hero image from settings on component mount
  useEffect(() => {
    loadHeroImage();
    fetchBlogPosts();
  }, []);

  const loadHeroImage = async () => {
    try {
      const url = await SettingsService.getHeroImageUrl();
      setHeroImageUrl(url);
    } catch (error) {
      console.error('Error loading hero image:', error);
      setHeroImageUrl(heroImage);
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
        .order('featured_order', { ascending: true, nullsLast: true })
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

      // Transform data to match BlogCard props
      const transformPost = (post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...',
        author: post.author_name || 'Anonymous',
        date: new Date(post.created_at).toLocaleDateString(),
        category: post.category,
        featured: post.featured,
        image: getImageWithFallback(undefined, post.category)
      });

      setFeaturedPosts((featuredData || []).map(transformPost));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Research Papers', value: '150+', icon: FileText },
    { label: 'Faculty Members', value: '25+', icon: Users },
    { label: 'Events Annually', value: '40+', icon: Calendar },
    { label: 'Publications', value: '200+', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        >
          <div className="absolute inset-0 bg-navy/70"></div>
        </div>
        

        
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

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="academic-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="academic-heading text-3xl mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20">
        <div className="academic-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="academic-heading text-3xl md:text-4xl mb-6">
                Pioneering Research in International Law
              </h2>
              <div className="space-y-6 academic-text text-lg">
                <p>
                  The Centre for International Law and Governance (CILG) stands at the forefront 
                  of legal scholarship, fostering innovative research and discourse in international 
                  law, policy, and governance.
                </p>
                <p>
                  Our multidisciplinary approach brings together scholars, practitioners, and 
                  students to explore complex global challenges through the lens of legal analysis 
                  and policy development.
                </p>
                <Button asChild variant="outline" className="mt-6">
                  <Link to="/about" className="flex items-center space-x-2">
                    <span>Read Our Story</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={academicBuilding}
                alt="Academic Building"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-20 bg-muted/30">
        <div className="academic-container">
          <div className="text-center mb-12">
            <h2 className="academic-heading text-3xl md:text-4xl mb-4">Featured Research</h2>
            <p className="academic-text text-lg max-w-2xl mx-auto">
              Explore our latest scholarly contributions to international law and governance
            </p>
          </div>

          <div className="relative">
            {/* Gradient fade indicators for scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
            <div className="overflow-x-auto scroll-smooth pb-4 mb-12 scrollbar-thin">
              <div className="flex gap-6 min-w-max px-4">
              {loading ? (
                // Loading skeleton - show 6 cards horizontally
                Array.from({ length: 6 }).map((_, index) => (
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
                ))
              ) : featuredPosts.length > 0 ? (
                // Show only featured posts
                featuredPosts.map((post) => (
                  <BlogCard key={post.id} {...post} />
                ))
              ) : (
                // No featured posts available
                <div className="min-w-full text-center py-12">
                  <p className="text-muted-foreground">No featured articles available at the moment.</p>
                </div>
              )}
            </div>
          </div>
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="cursor-pointer hover:shadow-md transition-shadow duration-300">
              <Link to="/blog" className="flex items-center space-x-2">
                <span>View All Blogs</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-20">
        <div className="academic-container">
          <div className="text-center mb-12">
            <h2 className="academic-heading text-3xl md:text-4xl mb-4">Research Areas</h2>
            <p className="academic-text text-lg max-w-2xl mx-auto">
              Our research spans across multiple disciplines within international law and governance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'International Criminal Law',
                description: 'Exploring justice mechanisms and accountability in international crimes',
                image: lawBooks,
              },
              {
                title: 'Human Rights Law',
                description: 'Contemporary issues in human rights protection and implementation',
                image: lawBooks,
              },
              {
                title: 'Conflict Resolution',
                description: 'Legal approaches to international dispute resolution and peacebuilding',
                image: academicBuilding,
              },
            ].map((area, index) => (
              <div key={index} className="academic-card p-6 group hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="academic-heading text-xl mb-3">{area.title}</h3>
                <p className="academic-text">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="academic-container text-center">
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-6">
            Join Our Academic Community
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contribute to the discourse on international law and governance. 
            Submit your research or join our upcoming events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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