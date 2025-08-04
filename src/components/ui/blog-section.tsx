import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url?: string;
  category?: string;
  created_at: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
  title?: string;
  showViewAll?: boolean;
  maxPosts?: number;
}

const BlogSection = ({ 
  posts, 
  title = "Featured Research", 
  showViewAll = true, 
  maxPosts = 4 
}: BlogSectionProps) => {
  const displayPosts = posts.slice(0, maxPosts);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h4 className="academic-heading text-3xl md:text-5xl tracking-tighter max-w-xl">
            {title}
          </h4>
          {showViewAll && (
            <Link to="/blog">
              <Button className="gap-4 academic-button">
                View all articles <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
        <div className="relative">
          {/* Gradient fade indicators for scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
          
          <div className="overflow-x-auto scroll-smooth pb-4 scrollbar-thin">
            <div className="flex gap-6 min-w-max px-4">
              {displayPosts.map((post) => (
                <div key={post.id} className="flex flex-col gap-2 hover:opacity-75 cursor-pointer transition-opacity duration-300 min-w-[300px] max-w-[350px] flex-shrink-0 h-full">
                  <Link to={`/blog/${post.id}`} className="flex flex-col gap-2 h-full">
                    <div className="bg-muted rounded-md aspect-video mb-4 overflow-hidden">
                      {post.image_url ? (
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <span className="text-primary/60 text-sm font-medium">
                            {post.category || 'Research'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="academic-heading text-xl tracking-tight line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="academic-text text-muted-foreground text-base line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        {post.category && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {post.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BlogSection }; 