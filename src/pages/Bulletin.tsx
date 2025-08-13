import { useState, useEffect } from 'react';
import { Calendar, Download, Share2, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BulletinPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_email: string;
  image_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Bulletin = () => {
  const { toast } = useToast();
  const [bulletinPosts, setBulletinPosts] = useState<BulletinPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BulletinPost | null>(null);

  useEffect(() => {
    fetchBulletinPosts();
  }, []);

  const fetchBulletinPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('cosmopolitan_bulletins')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bulletin posts:', error);
        toast({
          title: "Error",
          description: "Failed to load bulletin posts",
          variant: "destructive"
        });
        return;
      }

      setBulletinPosts((data || []) as BulletinPost[]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load bulletin posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="academic-container">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 academic-text">Loading bulletin posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="academic-heading text-4xl md:text-5xl mb-6">
            Cosmopolitan Bulletin
          </h1>
          <p className="academic-text text-lg max-w-2xl mx-auto">
            Our flagship publication featuring cutting-edge research and analysis 
            in international law and governance.
          </p>
        </div>

        {/* Latest Posts */}
        {bulletinPosts.length > 0 ? (
          <div className="mb-16">
            <h2 className="academic-heading text-2xl mb-8">Latest Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bulletinPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  {post.image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    <h3 className="academic-heading text-lg mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="academic-text text-sm mb-4 line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        By {post.author_name}
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Read</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="academic-text text-lg text-muted-foreground">
              No bulletin posts available yet.
            </p>
          </div>
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedPost.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      By {selectedPost.author_name} • {new Date(selectedPost.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedPost(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {selectedPost.image_url && (
                  <div className="mb-6">
                    <img
                      src={selectedPost.image_url}
                      alt={selectedPost.title}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}
                <div className="prose max-w-none">
                  <p className="academic-text text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}


      </div>
    </div>
  );
};

export default Bulletin;