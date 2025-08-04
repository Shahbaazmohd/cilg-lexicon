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
    <Link to={`/blog/${id}`} className="block h-full">
      <article className={`academic-card overflow-hidden group cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full flex flex-col min-w-[300px] max-w-[350px] flex-shrink-0 ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
        <div className={`flex flex-col h-full ${featured ? 'md:flex-row' : ''}`}>
          {/* Image */}
          <div className={`relative overflow-hidden flex-shrink-0 ${featured ? 'md:w-1/2' : ''}`}>
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
          <div className={`p-6 flex flex-col flex-grow ${featured ? 'md:w-1/2' : ''}`}>
            {/* Meta */}
            <div className="flex flex-col space-y-1 text-sm text-muted-foreground mb-3">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span className="truncate">{author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{date}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className={`academic-heading mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2 ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}>
              {title}
            </h3>

            {/* Excerpt */}
            <p className={`academic-text mb-4 flex-grow line-clamp-3 ${featured ? 'text-base' : 'text-sm'}`}>
              {excerpt}
            </p>

            {/* Read More */}
            <div className="flex items-center justify-between mt-auto">
              <span className="font-medium text-primary group-hover:text-primary/80 flex items-center space-x-1">
                <span>Read More</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;