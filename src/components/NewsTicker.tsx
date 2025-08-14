import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  url?: string;
}

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Cosmopolitan Bulletin posts
  useEffect(() => {
    fetchBulletinPosts();
  }, []);

  const fetchBulletinPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('cosmopolitan_bulletins')
        .select('id, title')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(8); // Limit to 8 posts for the news ticker

      if (error) {
        console.error('Error fetching bulletin posts:', error);
        return;
      }

      // Transform the data to match NewsItem interface
      const bulletinNews = (data || []).map(post => ({
        id: post.id,
        title: post.title,
        url: `/bulletin` // Link to bulletin page
      }));

      setNews(bulletinNews);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-academic text-academic-foreground py-3 overflow-hidden">
      <div className="academic-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
          <div className="flex-shrink-0 sm:mr-6">
            <span className="font-serif font-semibold text-xs sm:text-sm">LATEST BULLETIN:</span>
          </div>
          <div className="news-ticker flex-1 min-w-0">
            <div className="news-ticker-content">
              {loading ? (
                <span className="text-xs sm:text-sm font-medium text-academic-foreground/80">
                  Loading latest bulletin posts...
                </span>
              ) : news.length === 0 ? (
                <span className="text-xs sm:text-sm font-medium text-academic-foreground/80">
                  No bulletin posts available at the moment
                </span>
              ) : (
                news.map((item, index) => (
                  <span key={item.id} className="mr-6 sm:mr-12 text-xs sm:text-sm font-medium">
                    {item.url ? (
                      <a 
                        href={item.url} 
                        className="hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                    {index < news.length - 1 && (
                      <span className="mx-2 sm:mx-4 text-academic-foreground/60">•</span>
                    )}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;