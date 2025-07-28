import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2, Upload, Calendar, User } from 'lucide-react';

const AdminDrafts = () => {
  const drafts = [
    {
      id: 1,
      title: 'Human Rights in Digital Surveillance',
      author: 'Dr. Amanda Rodriguez',
      lastModified: '2024-01-22',
      status: 'draft',
      wordCount: 2400,
      category: 'Human Rights'
    },
    {
      id: 2,
      title: 'International Maritime Law Updates',
      author: 'Prof. James Wilson',
      lastModified: '2024-01-20',
      status: 'review',
      wordCount: 1800,
      category: 'Maritime Law'
    },
    {
      id: 3,
      title: 'AI Governance and Legal Frameworks',
      author: 'Dr. Sarah Kim',
      lastModified: '2024-01-18',
      status: 'draft',
      wordCount: 3200,
      category: 'Technology Law'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground">Draft Blogs</h1>
            <p className="text-muted-foreground mt-2">
              Manage draft articles and prepare them for publication
            </p>
          </div>

          <div className="space-y-4">
            {drafts.map((draft) => (
              <Card key={draft.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{draft.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {draft.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Modified: {draft.lastModified}
                        </span>
                        <Badge variant="outline">{draft.category}</Badge>
                        <span className="text-muted-foreground">{draft.wordCount} words</span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(draft.status)}>
                      {draft.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {draft.status === 'review' && (
                        <Button size="sm" variant="default">
                          <Upload className="h-4 w-4 mr-1" />
                          Publish
                        </Button>
                      )}
                      {draft.status === 'draft' && (
                        <Button size="sm" variant="outline">
                          Send for Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDrafts;