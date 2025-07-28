import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BlogCard from '@/components/BlogCard';
import { supabase } from '@/integrations/supabase/client';
import { getImageWithFallback } from '@/lib/imageUtils';

const CILGBlog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        return;
      }

      // Transform Supabase data to match BlogCard props
      const transformedPosts = data.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        author: post.author_name || 'Anonymous',
        date: new Date(post.created_at).toLocaleDateString(),
        category: post.category,
        featured: post.featured,
        image: getImageWithFallback(undefined, post.category) // Use category-based image since blog_posts doesn't have image_url
      }));

      setBlogPosts(transformedPosts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  const filteredPosts = blogPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'author') {
        return a.author.localeCompare(b.author);
      }
      return 0;
    });

  return (
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="academic-heading text-4xl md:text-5xl mb-4">
            CILG Blog Posts
          </h1>
          <p className="academic-text text-lg max-w-2xl mx-auto">
            Browse our collection of approved research articles and scholarly contributions 
            from the international law community.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-muted/30 rounded-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles, authors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="author">Author A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Showing {filteredPosts.length} of {blogPosts.length} articles
            {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="academic-text">Loading blog posts...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="academic-heading text-xl mb-4">No articles found</h3>
              <p className="academic-text mb-6">
                {blogPosts.length === 0 
                  ? "No approved articles are available yet. Check back soon for new content!"
                  : "Try adjusting your search terms or filters to find what you're looking for."
                }
              </p>
              {filteredPosts.length === 0 && blogPosts.length > 0 && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSortBy('date');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-muted/30 rounded-lg p-12">
          <h2 className="academic-heading text-2xl md:text-3xl mb-4">
            Contribute to Our Research
          </h2>
          <p className="academic-text text-lg mb-6 max-w-2xl mx-auto">
            Share your insights and research with our academic community. 
            We welcome submissions from scholars, practitioners, and students.
          </p>
          <Button asChild size="lg">
            <a href="/submit-blog">Submit Your Article</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CILGBlog;