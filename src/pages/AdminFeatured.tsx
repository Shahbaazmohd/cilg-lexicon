import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowUp, ArrowDown, X, Calendar, User } from 'lucide-react';

const AdminFeatured = () => {
  const featuredPosts = [
    {
      id: 1,
      title: 'The Evolution of International Criminal Law in the 21st Century',
      author: 'Dr. Sarah Johnson',
      publishDate: '2024-01-15',
      category: 'International Criminal Law',
      views: 2400,
      order: 1,
      status: 'active'
    },
    {
      id: 2,
      title: 'Climate Change Governance: Legal Frameworks for Global Action',
      author: 'Prof. Michael Chen',
      publishDate: '2024-01-12',
      category: 'Environmental Law',
      views: 1800,
      order: 2,
      status: 'active'
    },
    {
      id: 3,
      title: 'Human Rights in the Digital Age: Privacy and Surveillance',
      author: 'Dr. Emma Rodriguez',
      publishDate: '2024-01-10',
      category: 'Human Rights',
      views: 2100,
      order: 3,
      status: 'active'
    }
  ];

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
                  Drag to reorder or use the arrow buttons to change the display order
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-4">
            {featuredPosts.map((post, index) => (
              <Card key={post.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center space-y-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium text-muted-foreground">
                          #{post.order}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          disabled={index === featuredPosts.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {post.author}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {post.publishDate}
                          </span>
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-muted-foreground">{post.views} views</span>
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
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
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
                <Button variant="outline" className="w-full">
                  Browse Published Articles
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeatured;