import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <article className={`academic-card overflow-hidden group ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
      <div className={`${featured ? 'md:flex' : ''}`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'md:w-1/2' : ''}`}>
          <img
            src={image}
            alt={title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              featured ? 'h-64 md:h-full' : 'h-48'
            }`}
          />
          {category && (
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-6 ${featured ? 'md:w-1/2 md:flex md:flex-col md:justify-center' : ''}`}>
          {/* Meta */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className={`academic-heading mb-3 group-hover:text-primary transition-colors duration-200 ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}>
            <Link to={`/blog/${id}`} className="hover:underline">
              {title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className={`academic-text mb-4 ${featured ? 'text-base' : 'text-sm'}`}>
            {excerpt}
          </p>

          {/* Read More */}
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
              <Link to={`/blog/${id}`} className="flex items-center space-x-1">
                <span>Read More</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;