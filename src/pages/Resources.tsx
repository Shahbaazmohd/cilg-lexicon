import { useState, useEffect } from 'react';
import { Download, ExternalLink, BookOpen, FileText, Link as LinkIcon, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResourceService, Resource } from '@/lib/resourceService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const resourceTypes = ['all', 'document', 'link', 'database', 'publication', 'report', 'guide', 'dataset', 'tool'];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await ResourceService.getAllActiveResources();
      setResources(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch resources. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

      console.log('🔧 Starting download for resource:', resource.id, resource.title);
      
      // Generate download URL first
      const downloadUrl = await ResourceService.generateDownloadUrl(
        resource.file_url, 
        resource.file_name || 'download'
      );
      
      console.log('🔧 Download URL generated:', downloadUrl);
      
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
        console.log('✅ Download count incremented successfully');
      } catch (incrementError) {
        console.warn('⚠️ Could not increment download count:', incrementError);
        // Don't fail the download if increment fails
      }

      toast({
        title: "Download Started",
        description: "Your download has begun.",
      });
      
      console.log('✅ Download initiated successfully');
    } catch (error) {
      console.error('❌ Download error:', error);
      toast({
        title: "Download Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Only include the research areas mentioned on the home page
  const categories = ['all', 'International Criminal Law', 'International Relations', 'International Investment and Trade Law'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      document: FileText,
      link: LinkIcon,
      database: FileText,
      publication: BookOpen,
      report: FileText,
      guide: BookOpen,
      dataset: FileText,
      tool: LinkIcon
    };
    return icons[type as keyof typeof icons] || FileText;
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
      <div className="min-h-screen py-12">
        <div className="academic-container">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="academic-heading text-4xl md:text-5xl mb-6">
            Resources & Tools
          </h1>
          <p className="academic-text text-lg max-w-2xl mx-auto">
            Access our curated collection of databases, publications, research tools, 
            and educational resources for international law and governance research.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-muted/30 rounded-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search resources, topics, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Resource Type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="h-5 w-5 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                  <CardDescription>{resource.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="academic-text text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {resource.author && (
                    <p className="text-sm text-muted-foreground mb-3">
                      By: {resource.author}
                    </p>
                  )}

                  <div className="text-sm text-muted-foreground mb-4">
                    Updated: {new Date(resource.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  {resource.file_name && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                      <FileText className="h-4 w-4" />
                      <span>{resource.file_name} ({formatFileSize(resource.file_size || 0)})</span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
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

                  {/* Actions */}
                  <div className="flex gap-2">
                    {resource.file_url && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload(resource)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    )}
                    {resource.external_url && (
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <a 
                          href={resource.external_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Access</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <h3 className="academic-heading text-xl mb-4">No resources found</h3>
            <p className="academic-text mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterCategory('all');
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Resource Categories Overview */}
        <div className="mt-16 bg-muted/30 rounded-lg p-8">
          <h2 className="academic-heading text-2xl mb-6 text-center">Resource Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(1).map((category) => {
              const categoryCount = resources.filter(r => r.category === category).length;
              return (
                <div key={category} className="text-center">
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {categoryCount} resources available
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFilterCategory(category)}
                  >
                    Explore
                  </Button>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </div>
  );
};

export default Resources;