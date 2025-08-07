import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ExternalLink, Eye, Star, CheckCircle, XCircle } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Notice, NoticeService } from '@/lib/noticeService';
import { sessionService } from '@/lib/sessionService';

const AdminNotices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Notice>>({
    title: '',
    description: '',
    link_url: '',
    link_text: '',
    category: 'general',
    priority: 0,
    is_active: true,
    featured: false
  });

  useEffect(() => {
    // Check if user is logged in using session service
    if (!sessionService.isLoggedIn()) {
      navigate('/admin/login');
    } else {
      loadNotices();
    }
  }, [navigate]);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const noticesData = await NoticeService.getAllNotices();
      setNotices(noticesData);
    } catch (error) {
      console.error('Error loading notices:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notices. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionService.clearSession();
    // Dispatch custom event to notify navbar
    window.dispatchEvent(new CustomEvent('sessionChange'));
    navigate('/admin/login');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link_url: '',
      link_text: '',
      category: 'general',
      priority: 0,
      is_active: true,
      featured: false
    });
    setEditingNotice(null);
    setShowForm(false);
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      ...notice
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.link_url || !formData.link_text) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      let result;
      if (editingNotice) {
        // Update existing notice
        result = await NoticeService.updateNotice(editingNotice.id, formData);
      } else {
        // Create new notice
        result = await NoticeService.createNotice(formData as Omit<Notice, 'id' | 'created_at' | 'updated_at'>);
      }

      if (result) {
        toast({
          title: 'Success',
          description: `Notice ${editingNotice ? 'updated' : 'created'} successfully`,
        });
        resetForm();
        loadNotices();
      } else {
        throw new Error('Failed to save notice');
      }
    } catch (error: any) {
      console.error('Error saving notice:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingNotice ? 'update' : 'create'} notice: ${error.message || 'Please try again.'}`,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const success = await NoticeService.deleteNotice(noticeId);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Notice deleted successfully',
        });
        loadNotices();
      } else {
        throw new Error('Failed to delete notice');
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notice. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const toggleActiveStatus = async (noticeId: string, currentStatus: boolean) => {
    try {
      const success = await NoticeService.toggleNoticeStatus(noticeId, !currentStatus);
      
      if (success) {
        toast({
          title: 'Status Updated',
          description: `Notice ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        });
        loadNotices();
      } else {
        throw new Error('Failed to update notice status');
      }
    } catch (error: any) {
      console.error('Error updating notice status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update notice status',
        variant: 'destructive'
      });
    }
  };

  const toggleFeaturedStatus = async (noticeId: string, currentFeatured: boolean) => {
    try {
      const success = await NoticeService.toggleNoticeFeatured(noticeId, !currentFeatured);
      
      if (success) {
        toast({
          title: 'Featured Status Updated',
          description: `Notice ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
        });
        loadNotices();
      } else {
        throw new Error('Failed to update notice featured status');
      }
    } catch (error: any) {
      console.error('Error updating notice featured status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update notice featured status',
        variant: 'destructive'
      });
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

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Notice Management</h1>
              <p className="text-muted-foreground mt-2">
                Create and manage link-based notices for the website
              </p>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add New Notice'}
            </Button>
          </div>

          {/* Notice Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingNotice ? 'Edit Notice' : 'Add New Notice'}</CardTitle>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Notice Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Enter notice title"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData({...formData, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter notice description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="link_url">Link URL</Label>
                        <Input
                          id="link_url"
                          value={formData.link_url}
                          onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                          placeholder="https://example.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="link_text">Link Text</Label>
                        <Input
                          id="link_text"
                          value={formData.link_text}
                          onChange={(e) => setFormData({...formData, link_text: e.target.value})}
                          placeholder="Click Here"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priority">Priority (0-10)</Label>
                        <Input
                          id="priority"
                          type="number"
                          min="0"
                          max="10"
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value) || 0})}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                          />
                          <Label htmlFor="is_active">Active</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                          />
                          <Label htmlFor="featured">Featured</Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingNotice ? 'Update Notice' : 'Create Notice'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </CardHeader>
            </Card>
          )}

          {/* Notices List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">All Notices</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading notices...</p>
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <ExternalLink className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No notices found</h3>
                <p className="text-muted-foreground mb-6">Get started by creating your first notice</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Notice
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {notices.map((notice) => (
                  <Card key={notice.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold">{notice.title}</h3>
                            <Badge className={getCategoryColor(notice.category)}>
                              {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                            </Badge>
                            <Badge variant="outline">Priority: {notice.priority}</Badge>
                          </div>
                          
                          {notice.description && (
                            <p className="text-muted-foreground mb-3">{notice.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              {notice.link_text}
                            </span>
                            <span className="flex items-center">
                              {notice.is_active ? (
                                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1 text-red-600" />
                              )}
                              {notice.is_active ? 'Active' : 'Inactive'}
                            </span>
                            {notice.featured && (
                              <span className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-600" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleActiveStatus(notice.id, notice.is_active)}
                          >
                            {notice.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleFeaturedStatus(notice.id, notice.featured)}
                          >
                            {notice.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditNotice(notice)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteNotice(notice.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotices;
