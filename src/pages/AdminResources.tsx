import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { FileText, Plus, Edit, Trash2, Download, ExternalLink, Star, Eye, EyeOff } from 'lucide-react';
import { simpleAuthService } from '@/lib/simpleAuthService';
import { ResourceService, Resource, CreateResourceData } from '@/lib/resourceService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import ResourceFileUpload from '@/components/ResourceFileUpload';

const AdminResources = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<CreateResourceData>({
    title: '',
    description: '',
    type: 'document',
    category: '',
    author: '',
    tags: [],
    access_level: 'free',
    is_featured: false,
    is_active: true
  });

  const resourceTypes = [
    { value: 'document', label: 'Document' },
    { value: 'link', label: 'Link' },
    { value: 'database', label: 'Database' },
    { value: 'publication', label: 'Publication' },
    { value: 'report', label: 'Report' },
    { value: 'guide', label: 'Guide' },
    { value: 'dataset', label: 'Dataset' },
    { value: 'tool', label: 'Tool' }
  ];

  // Only include the research areas mentioned on the home page
  const categories = [
    'International Criminal Law',
    'International Relations',
    'International Investment and Trade Law'
  ];

  const accessLevels = [
    { value: 'free', label: 'Free' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'restricted', label: 'Restricted' }
  ];

  useEffect(() => {
    if (!simpleAuthService.isAuthenticated() || !simpleAuthService.isAdmin()) {
      navigate('/admin/login');
      return;
    }

    fetchResources();
  }, [navigate]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await ResourceService.getAllResources();
      setResources(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch resources.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateResourceData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelected = (fileUrl: string, fileName: string, fileSize: number, fileType: string) => {
    setFormData(prev => ({
      ...prev,
      file_url: fileUrl,
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType
    }));
  };

  const handleFileRemoved = () => {
    setFormData(prev => ({
      ...prev,
      file_url: '',
      file_name: '',
      file_size: 0,
      file_type: ''
    }));
  };

  const handleDownload = async (resource: Resource) => {
    try {
      if (!resource.file_url) {
        toast({
          title: "Download Error",
          description: "No file available for download.",
          variant: "destructive"
        });
        return;
      }

      console.log('🔧 Starting admin download for resource:', resource.id, resource.title);
      
      // Generate download URL first
      const downloadUrl = await ResourceService.generateDownloadUrl(
        resource.file_url, 
        resource.file_name || 'download'
      );
      
      console.log('🔧 Admin download URL generated:', downloadUrl);
      
      // Create a temporary link element for download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = resource.file_name || 'download';
      link.style.display = 'none';
      
      // Set additional attributes for better download behavior
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Append to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Increment download count after successful download initiation
      try {
        await ResourceService.incrementDownloadCount(resource.id);
        console.log('✅ Admin download count incremented successfully');
      } catch (incrementError) {
        console.warn('⚠️ Could not increment admin download count:', incrementError);
        // Don't fail the download if increment fails
      }

      toast({
        title: "Download Started",
        description: "Your download has begun.",
      });
      
      console.log('✅ Admin download initiated successfully');
    } catch (error) {
      console.error('❌ Admin download error:', error);
      toast({
        title: "Download Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateResource = async () => {
    try {
      await ResourceService.createResource(formData);
      toast({
        title: "Success",
        description: "Resource created successfully.",
      });
      setIsCreateDialogOpen(false);
      resetForm();
      fetchResources();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create resource.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateResource = async () => {
    if (!selectedResource) return;

    try {
      await ResourceService.updateResource({
        id: selectedResource.id,
        ...formData
      });
      toast({
        title: "Success",
        description: "Resource updated successfully.",
      });
      setIsEditDialogOpen(false);
      resetForm();
      fetchResources();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update resource.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      await ResourceService.deleteResource(resourceId);
      toast({
        title: "Success",
        description: "Resource deleted successfully.",
      });
      fetchResources();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resource.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      file_url: resource.file_url,
      external_url: resource.external_url,
      file_name: resource.file_name,
      file_size: resource.file_size,
      file_type: resource.file_type,
      author: resource.author,
      tags: resource.tags,
      access_level: resource.access_level,
      is_featured: resource.is_featured,
      is_active: resource.is_active
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'document',
      category: '',
      author: '',
      tags: [],
      access_level: 'free',
      is_featured: false,
      is_active: true
    });
    setSelectedResource(null);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      document: FileText,
      link: ExternalLink,
      database: FileText,
      publication: FileText,
      report: FileText,
      guide: FileText,
      dataset: FileText,
      tool: ExternalLink
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getAccessBadge = (access: string) => {
    const styles = {
      free: 'bg-green-100 text-green-800',
      subscription: 'bg-yellow-100 text-yellow-800',
      restricted: 'bg-red-100 text-red-800'
    };
    return styles[access as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar onLogout={() => {
          simpleAuthService.signOut();
          navigate('/admin/login');
        }} />
        <div className="flex-1 p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
            <div className="grid gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={() => {
        simpleAuthService.signOut();
        navigate('/admin/login');
      }} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Resources Management</h1>
            <p className="text-muted-foreground">Manage documents, links, and other resources</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Resource</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Create a new resource that users can access and download.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Resource title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="access_level">Access Level *</Label>
                    <Select value={formData.access_level} onValueChange={(value) => handleInputChange('access_level', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accessLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the resource..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Author name"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>File Upload</Label>
                  <ResourceFileUpload
                    onFileSelected={handleFileSelected}
                    currentFile={formData.file_url}
                    currentFileName={formData.file_name}
                    currentFileSize={formData.file_size}
                    onFileRemoved={handleFileRemoved}
                  />
                </div>

                {/* External URL */}
                <div className="space-y-2">
                  <Label htmlFor="external_url">External URL</Label>
                  <Input
                    id="external_url"
                    value={formData.external_url}
                    onChange={(e) => handleInputChange('external_url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags?.join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Featured Resource</Label>
                      <p className="text-sm text-muted-foreground">
                        Show this resource prominently
                      </p>
                    </div>
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Active</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this resource visible to users
                      </p>
                    </div>
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateResource}>
                  Create Resource
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {resources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <TypeIcon className="h-5 w-5 text-primary" />
                        <Badge variant="outline">{resource.type}</Badge>
                        <Badge className={getAccessBadge(resource.access_level)}>
                          {resource.access_level}
                        </Badge>
                        {resource.is_featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {!resource.is_active && (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                      <p className="text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Category: {resource.category}</span>
                        {resource.author && <span>By: {resource.author}</span>}
                        <span>Downloads: {resource.download_count}</span>
                        <span>Created: {new Date(resource.created_at).toLocaleDateString()}</span>
                      </div>

                      {resource.file_name && (
                        <div className="flex items-center space-x-2 mt-2 text-sm">
                          <FileText className="h-4 w-4" />
                          <span>{resource.file_name} ({formatFileSize(resource.file_size || 0)})</span>
                        </div>
                      )}

                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {expandedTags.has(resource.id) && resource.tags.slice(3).map((tag, index) => (
                            <Badge key={index + 3} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {resource.tags.length > 3 && !expandedTags.has(resource.id) && (
                            <Badge 
                              variant="outline" 
                              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => {
                                setExpandedTags(prev => new Set([...prev, resource.id]));
                              }}
                              title={`Click to see all tags: ${resource.tags.join(', ')}`}
                            >
                              +{resource.tags.length - 3}
                            </Badge>
                          )}
                          {expandedTags.has(resource.id) && resource.tags.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs cursor-pointer hover:bg-muted transition-colors"
                              onClick={() => {
                                setExpandedTags(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(resource.id);
                                  return newSet;
                                });
                              }}
                              title="Click to hide additional tags"
                            >
                              -{resource.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {resource.file_url && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(resource)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {resource.external_url && (
                        <Button asChild size="sm" variant="outline">
                          <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(resource)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteResource(resource.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first resource using the button above.
            </p>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
              <DialogDescription>
                Update the resource information and settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Same form fields as create dialog */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Resource title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-access_level">Access Level *</Label>
                  <Select value={formData.access_level} onValueChange={(value) => handleInputChange('access_level', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accessLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the resource..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Author name"
                />
              </div>

              {/* File Upload for Edit */}
              <div className="space-y-2">
                <Label>File Upload</Label>
                <ResourceFileUpload
                  onFileSelected={handleFileSelected}
                  currentFile={formData.file_url}
                  currentFileName={formData.file_name}
                  currentFileSize={formData.file_size}
                  onFileRemoved={handleFileRemoved}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-external_url">External URL</Label>
                <Input
                  id="edit-external_url"
                  value={formData.external_url}
                  onChange={(e) => handleInputChange('external_url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags?.join(', ')}
                  onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Featured Resource</Label>
                    <p className="text-sm text-muted-foreground">
                      Show this resource prominently
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this resource visible to users
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateResource}>
                Update Resource
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminResources;
