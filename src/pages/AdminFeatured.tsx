import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, ArrowUp, ArrowDown, X, Calendar, User, Search, Plus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  author_name: string;
  author_email: string;
  category: string | null;
  excerpt: string | null;
  content: string;
  status: string;
  featured: boolean;
  featured_order: number | null;
  created_at: string;
  updated_at: string;
}

const AdminFeatured = () => {
  const { toast } = useToast();
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState<string | null>(null);
  const [showBrowseDialog, setShowBrowseDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchFeaturedPosts();
    fetchAllPosts();
  }, []);

  const fetchFeaturedPosts = async () => {
    try {
      // Try to order by featured_order first, fallback to created_at if featured_order doesn't exist
      let { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('featured', true)
        .eq('status', 'approved')
        .order('featured_order', { ascending: true, nullsLast: true })
        .order('created_at', { ascending: false });

      if (error && error.message.includes('featured_order')) {
        // If featured_order doesn't exist, fallback to ordering by created_at
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('featured', true)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (fallbackError) {
          console.error('Error fetching featured posts:', fallbackError);
          toast({
            title: "Error",
            description: "Failed to load featured posts",
            variant: "destructive"
          });
          return;
        }

        data = fallbackData;
      } else if (error) {
        console.error('Error fetching featured posts:', error);
        toast({
          title: "Error",
          description: "Failed to load featured posts",
          variant: "destructive"
        });
        return;
      }

      setFeaturedPosts((data || []) as BlogPost[]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load featured posts",
        variant: "destructive"
      });
    }
  };

  const fetchAllPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all posts:', error);
        return;
      }

      setAllPosts((data || []) as BlogPost[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (postId: string, currentFeatured: boolean) => {
    try {
      if (currentFeatured) {
        // Removing from featured - clear the order
        const { error } = await supabase
          .from('blog_posts')
          .update({ featured: false, featured_order: null })
          .eq('id', postId);

        if (error) throw error;
      } else {
        // Adding to featured - assign the next order number
        // First try to get the max order, but handle the case where featured_order doesn't exist yet
        let nextOrder = 1;
        try {
          const { data: maxOrderData } = await supabase
            .from('blog_posts')
            .select('featured_order')
            .eq('featured', true)
            .not('featured_order', 'is', null)
            .order('featured_order', { ascending: false })
            .limit(1);

          nextOrder = (maxOrderData?.[0]?.featured_order || 0) + 1;
        } catch (orderError) {
          // If featured_order field doesn't exist yet, just use the count of featured posts
          const { data: featuredCount } = await supabase
            .from('blog_posts')
            .select('id', { count: 'exact' })
            .eq('featured', true);

          nextOrder = (featuredCount?.length || 0) + 1;
        }

        const { error } = await supabase
          .from('blog_posts')
          .update({ featured: true, featured_order: nextOrder })
          .eq('id', postId);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Post ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
      });

      // Refresh both lists
      fetchFeaturedPosts();
      fetchAllPosts();
    } catch (error: any) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status",
        variant: "destructive"
      });
    }
  };

  const movePost = async (postId: string, direction: 'up' | 'down') => {
    try {
      setReordering(postId);
      
      const currentIndex = featuredPosts.findIndex(post => post.id === postId);
      if (currentIndex === -1) return;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= featuredPosts.length) return;

      const currentPost = featuredPosts[currentIndex];
      const targetPost = featuredPosts[targetIndex];

      // Check if featured_order field exists by trying to update it
      try {
        // Get the current order values
        const currentOrder = currentPost.featured_order || 0;
        const targetOrder = targetPost.featured_order || 0;

        // Update both posts with new order values
        const { error: error1 } = await supabase
          .from('blog_posts')
          .update({ featured_order: targetOrder })
          .eq('id', currentPost.id);

        if (error1) throw error1;

        const { error: error2 } = await supabase
          .from('blog_posts')
          .update({ featured_order: currentOrder })
          .eq('id', targetPost.id);

        if (error2) throw error2;

        toast({
          title: "Success",
          description: `Post moved ${direction} successfully`,
        });
      } catch (orderError: any) {
        // If featured_order doesn't exist, show a message about the migration
        if (orderError.message && orderError.message.includes('featured_order')) {
          toast({
            title: "Info",
            description: "Reordering requires database migration. Please contact the administrator.",
          });
        } else {
          throw orderError;
        }
      }

      // Refresh the featured posts list
      fetchFeaturedPosts();
    } catch (error: any) {
      console.error('Error moving post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to move post",
        variant: "destructive"
      });
    } finally {
      setReordering(null);
    }
  };

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.author_name && post.author_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory && !post.featured; // Exclude already featured posts
  });

  const categories = ['all', ...Array.from(new Set(allPosts.map(post => post.category).filter(Boolean)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4">Loading featured posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground">Featured Blogs</h1>
            <p className="text-muted-foreground mt-2">
              Manage featured articles displayed on the homepage
            </p>
          </div>

          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  Homepage Featured Articles
                </CardTitle>
                <CardDescription>
                  Currently featured articles on the homepage
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-4">
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post, index) => (
                <Card key={post.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center space-y-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-6 w-6 p-0 ${reordering === post.id ? 'opacity-50' : ''}`}
                            disabled={index === 0 || reordering === post.id}
                            onClick={() => movePost(post.id, 'up')}
                          >
                            {reordering === post.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                            ) : (
                              <ArrowUp className="h-3 w-3" />
                            )}
                          </Button>
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-6 w-6 p-0 ${reordering === post.id ? 'opacity-50' : ''}`}
                            disabled={index === featuredPosts.length - 1 || reordering === post.id}
                            onClick={() => movePost(post.id, 'down')}
                          >
                            {reordering === post.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                          <CardDescription className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {post.author_name || 'Anonymous'}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                            {post.category && (
                              <Badge variant="outline">{post.category}</Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => toggleFeatured(post.id, true)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Featured Articles</h3>
                  <p className="text-muted-foreground mb-4">
                    No articles are currently featured on the homepage.
                  </p>
                  <Button onClick={() => setShowBrowseDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Featured Articles
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Add More Featured Articles</CardTitle>
                <CardDescription>
                  Select from published articles to feature on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowBrowseDialog(true)}
                >
                  Browse Published Articles
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Browse Articles Dialog */}
      <Dialog open={showBrowseDialog} onOpenChange={setShowBrowseDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Browse Published Articles</DialogTitle>
            <DialogDescription>
              Select articles to feature on the homepage. Only approved articles are shown.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles, authors, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Articles List */}
            <div className="space-y-3">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{post.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {post.author_name || 'Anonymous'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          {post.category && (
                            <Badge variant="outline">{post.category}</Badge>
                          )}
                        </div>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeatured(post.id, false)}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Feature
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'No articles match your search criteria.' 
                      : 'No published articles available to feature.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFeatured;