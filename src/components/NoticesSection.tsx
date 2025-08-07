import React, { useState, useEffect } from 'react';
import { ExternalLink, Bell, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Notice, NoticeService } from '@/lib/noticeService';

const NoticesSection = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const noticesData = await NoticeService.getActiveNotices();
      setNotices(noticesData);
    } catch (error) {
      console.error('Error loading notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      research: 'bg-green-100 text-green-800',
      student: 'bg-purple-100 text-purple-800',
      faculty: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
              <div className="h-8 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notices.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <Bell className="h-6 w-6 text-primary" />
        <h2 className="academic-heading text-2xl md:text-3xl">Important Notices</h2>
      </div>
      
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{notice.title}</h3>
                    <Badge className={getCategoryColor(notice.category)}>
                      {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                    </Badge>
                    {notice.featured && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  {notice.description && (
                    <p className="text-muted-foreground mb-3">{notice.description}</p>
                  )}
                  
                  <Button asChild size="sm">
                    <a 
                      href={notice.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <span>{notice.link_text}</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default NoticesSection;
