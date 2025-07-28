import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  url?: string;
}

const NewsTicker = () => {
  const [news] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'New International Law Conference 2024 - Registration Open',
    },
    {
      id: '2',
      title: 'CILG Research Paper on Climate Change Governance Published',
    },
    {
      id: '3',
      title: 'Guest Lecture Series on Human Rights Law - March 2024',
    },
    {
      id: '4',
      title: 'Cosmopolitan Bulletin Vol. 15 Now Available',
    },
    {
      id: '5',
      title: 'PhD Fellowship Applications Open - Deadline April 30, 2024',
    },
  ]);

  return (
    <div className="bg-academic text-academic-foreground py-3 overflow-hidden">
      <div className="academic-container">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-6">
            <span className="font-serif font-semibold text-sm">LATEST NEWS:</span>
          </div>
          <div className="news-ticker flex-1">
            <div className="news-ticker-content">
              {news.map((item, index) => (
                <span key={item.id} className="mr-12 text-sm font-medium">
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
                    <span className="mx-4 text-academic-foreground/60">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;