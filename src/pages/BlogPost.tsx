import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, BookOpen, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import NotFound from './NotFound';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_email: string;
  category: string;
  excerpt: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        setPost(null);
        return;
      }

      setPost(data as BlogPost);
      
      // Fetch related posts
      const { data: related, error: relatedError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'approved')
        .eq('category', data.category)
        .neq('id', id)
        .limit(2);

      if (!relatedError && related) {
        setRelatedPosts(related as BlogPost[]);
      }
    } catch (error) {
      console.error('Error:', error);
      setPost(null);
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
            <p className="mt-4 academic-text">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="p-0">
            <Link to="/blog" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category */}
            <div className="mb-4">
              <Badge variant="secondary" className="text-sm">
                {post.category}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="academic-heading text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{post.author_name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share Article</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <div className="academic-text text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </article>

          {/* Category */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">Category:</span>
            </div>
            <Badge variant="outline">{post.category}</Badge>
          </div>

          {/* Author Info */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-bold">
                  {post.author_name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="academic-heading text-xl mb-2">{post.author_name}</h3>
                <p className="academic-text">
                  {post.author_name.includes('Dr.') || post.author_name.includes('Prof.') 
                    ? 'Senior Researcher and Academic at the Centre for International Law and Governance'
                    : 'Researcher at the Centre for International Law and Governance'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-16">
            <h2 className="academic-heading text-2xl mb-8 flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>Related Articles</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="academic-card p-6 hover:shadow-lg transition-shadow duration-300 group"
                >
                  <h3 className="academic-heading text-lg mb-2 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="academic-text text-sm line-clamp-2">
                    {relatedPost.excerpt || relatedPost.content.substring(0, 100) + '...'}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-3">
                    <span>{relatedPost.author_name}</span>
                    <span>{new Date(relatedPost.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;