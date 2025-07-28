import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Image } from 'lucide-react';

const AdminBulletin = () => {
  const [bulletins, setBulletins] = useState([
    {
      id: 1,
      title: 'International Criminal Court Update',
      content: 'Latest developments in ICC proceedings...',
      image: '/api/placeholder/300/200',
      publishDate: '2024-01-20',
      socialEmbeds: ['twitter', 'linkedin']
    },
    {
      id: 2,
      title: 'Climate Law Conference Highlights',
      content: 'Key takeaways from the Global Climate Law Summit...',
      image: '/api/placeholder/300/200',
      publishDate: '2024-01-18',
      socialEmbeds: ['instagram', 'twitter']
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    socialEmbeds: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBulletin = {
      id: Date.now(),
      ...formData,
      publishDate: new Date().toISOString().split('T')[0]
    };
    setBulletins([newBulletin, ...bulletins]);
    setFormData({ title: '', content: '', image: '', socialEmbeds: [] });
    setShowForm(false);
  };

  const deleteBulletin = (id: number) => {
    setBulletins(bulletins.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Cosmopolitan Bulletin</h1>
              <p className="text-muted-foreground mt-2">
                Manage bulletin articles and social media content
              </p>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Bulletin Article</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Article title..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Content</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Article content..."
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Featured Image URL</label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Social Media Embeds</label>
                    <div className="flex space-x-2">
                      {['twitter', 'linkedin', 'instagram'].map(platform => (
                        <Button
                          key={platform}
                          type="button"
                          variant={formData.socialEmbeds.includes(platform) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const embeds = formData.socialEmbeds.includes(platform)
                              ? formData.socialEmbeds.filter(p => p !== platform)
                              : [...formData.socialEmbeds, platform];
                            setFormData({...formData, socialEmbeds: embeds});
                          }}
                        >
                          {platform}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Publish Article
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {bulletins.map((bulletin) => (
              <Card key={bulletin.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    {bulletin.image && (
                      <div className="w-32 h-24 bg-muted rounded-md flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-semibold mb-2">{bulletin.title}</h3>
                      <p className="text-muted-foreground mb-3 line-clamp-2">{bulletin.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {bulletin.publishDate}
                          </span>
                          <div className="flex space-x-1">
                            {bulletin.socialEmbeds.map(platform => (
                              <Badge key={platform} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteBulletin(bulletin.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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

export default AdminBulletin;