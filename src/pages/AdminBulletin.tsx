import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Image, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BulletinImageUpload from '@/components/BulletinImageUpload';
import { isSupabaseStorageUrl, extractFilePathFromUrl } from '@/lib/imageUtils';

interface BulletinPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_email: string;
  image_url?: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminBulletin = () => {
  const { toast } = useToast();
  const [bulletins, setBulletins] = useState<BulletinPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BulletinPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    author_name: '',
    author_email: ''
  });

  useEffect(() => {
    fetchBulletins();
  }, []);

  const fetchBulletins = async () => {
    try {
      const { data, error } = await supabase
        .from('cosmopolitan_bulletins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bulletins:', error);
        toast({
          title: "Error",
          description: "Failed to load bulletin posts",
          variant: "destructive"
        });
        return;
      }

      setBulletins((data || []) as BulletinPost[]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load bulletin posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bulletinData = {
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url || null,
        author_name: formData.author_name,
        author_email: formData.author_email,
        status: 'approved', // Admin posts are automatically approved
        featured: false
      };

      let result;
      if (editingPost) {
        // Update existing post
        result = await supabase
          .from('cosmopolitan_bulletins')
          .update(bulletinData)
          .eq('id', editingPost.id);
      } else {
        // Create new post
        result = await supabase
          .from('cosmopolitan_bulletins')
          .insert(bulletinData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Success",
        description: editingPost ? "Bulletin post updated successfully" : "Bulletin post created successfully",
      });

      // Reset form and refresh data
      setFormData({ title: '', content: '', image_url: '', author_name: '', author_email: '' });
      setShowForm(false);
      setEditingPost(null);
      fetchBulletins();
    } catch (error: any) {
      console.error('Error saving bulletin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save bulletin post",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (post: BulletinPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image_url: post.image_url || '',
      author_name: post.author_name,
      author_email: post.author_email
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bulletin post?')) {
      return;
    }

    try {
      // First, get the post to check if it has an image
      const { data: post } = await supabase
        .from('cosmopolitan_bulletins')
        .select('image_url')
        .eq('id', id)
        .single();

      // Delete the post
      const { error } = await supabase
        .from('cosmopolitan_bulletins')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // If the post had an image uploaded to Supabase storage, delete it
      if (post?.image_url && isSupabaseStorageUrl(post.image_url)) {
        try {
          const filePath = extractFilePathFromUrl(post.image_url, 'bulletin-images');
          if (filePath) {
            await supabase.storage
              .from('bulletin-images')
              .remove([filePath]);
          }
        } catch (imageError) {
          console.error('Error deleting image:', imageError);
          // Don't fail the whole operation if image deletion fails
        }
      }

      toast({
        title: "Success",
        description: "Bulletin post deleted successfully",
      });

      fetchBulletins();
    } catch (error: any) {
      console.error('Error deleting bulletin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete bulletin post",
        variant: "destructive"
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    
    try {
      const { error } = await supabase
        .from('cosmopolitan_bulletins')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Status Updated",
        description: `Bulletin post ${newStatus} successfully`,
      });

      fetchBulletins();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('cosmopolitan_bulletins')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Featured Status Updated",
        description: `Bulletin post ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
      });

      fetchBulletins();
    } catch (error: any) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', image_url: '', author_name: '', author_email: '' });
    setShowForm(false);
    setEditingPost(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4">Loading bulletin posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {editingPost ? 'Edit Article' : 'Add Article'}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingPost ? 'Edit Bulletin Article' : 'Create New Bulletin Article'}</CardTitle>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Author Name</label>
                      <Input
                        value={formData.author_name}
                        onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                        placeholder="Author name..."
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Author Email</label>
                      <Input
                        value={formData.author_email}
                        onChange={(e) => setFormData({...formData, author_email: e.target.value})}
                        placeholder="author@example.com"
                        type="email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Featured Image</label>
                    <BulletinImageUpload
                      onImageSelected={(imageUrl) => setFormData({...formData, image_url: imageUrl})}
                      currentImage={formData.image_url}
                      onImageRemoved={() => setFormData({...formData, image_url: ''})}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingPost ? 'Update Article' : 'Publish Article'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {bulletins.map((bulletin) => {
              // Check if image_url is valid (not null, undefined, empty string, or whitespace)
              const hasValidImage = bulletin.image_url && 
                                   typeof bulletin.image_url === 'string' &&
                                   bulletin.image_url.trim() !== '' && 
                                   bulletin.image_url !== 'null' && 
                                   bulletin.image_url !== 'undefined';
              
              return (
              <Card key={bulletin.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    {hasValidImage ? (
                      <div className="w-32 h-24 bg-muted rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img 
                          src={bulletin.image_url} 
                          alt={bulletin.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Hide image if it fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-24 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                        <Image className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-serif font-semibold">{bulletin.title}</h3>
                        <div className="flex space-x-1">
                          <Badge variant={bulletin.status === 'approved' ? 'default' : 'secondary'}>
                            {bulletin.status}
                          </Badge>
                          {bulletin.featured && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3 line-clamp-2">{bulletin.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(bulletin.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            By {bulletin.author_name}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleStatus(bulletin.id, bulletin.status)}
                          >
                            {bulletin.status === 'approved' ? 'Unapprove' : 'Approve'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleFeatured(bulletin.id, bulletin.featured)}
                          >
                            {bulletin.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(bulletin)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(bulletin.id)}
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
            );
            })}

            {bulletins.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No bulletin posts found. Create your first one!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBulletin;