import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category?: string;
  featured?: boolean;
}

const BlogCard = ({ id, title, excerpt, author, date, image, category, featured }: BlogCardProps) => {
  // Ensure consistent data formatting
  const formattedTitle = title || 'Untitled';
  const formattedExcerpt = excerpt || 'No description available';
  const formattedAuthor = author || 'Anonymous';
  const formattedDate = date || 'No date';
  const formattedCategory = category || 'General';
  
  // Ensure image has fallback
  const imageUrl = image || '/placeholder.svg';

  return (
    <Link to={`/blog/${id}`} className="block h-full">
      <article className="academic-card overflow-hidden group cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={formattedTitle}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
              {formattedCategory}
            </Badge>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Meta Information */}
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="truncate font-medium">{formattedAuthor}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="academic-heading text-xl mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2 font-semibold">
            {formattedTitle}
          </h3>

          {/* Excerpt */}
          <p className="academic-text text-sm mb-4 flex-grow line-clamp-3 text-muted-foreground">
            {formattedExcerpt}
          </p>

          {/* Read More Link */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            <span className="font-medium text-primary group-hover:text-primary/80 flex items-center space-x-2 transition-colors duration-200">
              <span>Read More</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;