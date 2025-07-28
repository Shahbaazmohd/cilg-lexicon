import { useState } from 'react';
import { Download, ExternalLink, BookOpen, FileText, Link as LinkIcon, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Resource {
  id: string;
  title: string;
  type: 'database' | 'publication' | 'report' | 'guide' | 'dataset' | 'tool';
  category: string;
  description: string;
  url?: string;
  downloadUrl?: string;
  author?: string;
  date: string;
  access: 'free' | 'subscription' | 'restricted';
  tags: string[];
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'International Court of Justice Database',
      type: 'database',
      category: 'International Courts',
      description: 'Comprehensive database of ICJ cases, judgments, and advisory opinions with full-text search capabilities.',
      url: 'https://www.icj-cij.org/en/decisions',
      access: 'free',
      date: '2024-01-15',
      tags: ['ICJ', 'Judgments', 'International Law', 'Court Decisions']
    },
    {
      id: '2',
      title: 'Climate Change and International Law: A Comprehensive Guide',
      type: 'publication',
      category: 'Environmental Law',
      description: 'CILG\'s latest publication examining the legal frameworks governing climate action and environmental protection.',
      downloadUrl: '#',
      author: 'Dr. Michael Chen, Prof. Sarah Johnson',
      access: 'free',
      date: '2023-12-10',
      tags: ['Climate Law', 'Environmental Protection', 'Paris Agreement', 'Research']
    },
    {
      id: '3',
      title: 'Global Human Rights Monitoring System',
      type: 'tool',
      category: 'Human Rights',
      description: 'Interactive tool for tracking human rights developments and violations across different jurisdictions.',
      url: 'https://example.com/human-rights-monitor',
      access: 'subscription',
      date: '2023-11-20',
      tags: ['Human Rights', 'Monitoring', 'Data Visualization', 'Global']
    },
    {
      id: '4',
      title: 'International Trade Agreements Database',
      type: 'database',
      category: 'Trade Law',
      description: 'Searchable collection of bilateral and multilateral trade agreements with analytical tools.',
      url: 'https://example.com/trade-agreements',
      access: 'free',
      date: '2023-10-15',
      tags: ['Trade Agreements', 'WTO', 'Investment', 'Economics']
    },
    {
      id: '5',
      title: 'Digital Rights Research Report 2023',
      type: 'report',
      category: 'Digital Rights',
      description: 'Annual report on the state of digital rights globally, including privacy, surveillance, and internet governance.',
      downloadUrl: '#',
      author: 'Dr. Emma Rodriguez',
      access: 'free',
      date: '2023-09-30',
      tags: ['Digital Rights', 'Privacy', 'Internet Governance', 'Technology']
    },
    {
      id: '6',
      title: 'International Criminal Law Case Law Analyzer',
      type: 'tool',
      category: 'International Criminal Law',
      description: 'AI-powered tool for analyzing patterns and trends in international criminal law jurisprudence.',
      url: 'https://example.com/icl-analyzer',
      access: 'restricted',
      date: '2023-08-15',
      tags: ['Criminal Law', 'AI Analysis', 'Jurisprudence', 'Research Tool']
    },
    {
      id: '7',
      title: 'Refugee Protection Legal Framework Guide',
      type: 'guide',
      category: 'Refugee Law',
      description: 'Practical guide for legal practitioners working with refugee protection and asylum cases.',
      downloadUrl: '#',
      author: 'Dr. Aisha Patel',
      access: 'free',
      date: '2023-07-20',
      tags: ['Refugee Law', 'Legal Practice', 'Asylum', 'Protection']
    },
    {
      id: '8',
      title: 'International Governance Indicators Dataset',
      type: 'dataset',
      category: 'Global Governance',
      description: 'Comprehensive dataset tracking governance indicators across international organizations and institutions.',
      downloadUrl: '#',
      access: 'subscription',
      date: '2023-06-10',
      tags: ['Governance', 'Data', 'International Organizations', 'Indicators']
    }
  ];

  const resourceTypes = ['all', 'database', 'publication', 'report', 'guide', 'dataset', 'tool'];
  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category)))];

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
      database: LinkIcon,
      publication: BookOpen,
      report: FileText,
      guide: BookOpen,
      dataset: FileText,
      tool: LinkIcon
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
                    <Badge className={getAccessBadge(resource.access)}>
                      {resource.access.charAt(0).toUpperCase() + resource.access.slice(1)}
                    </Badge>
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
                    Updated: {new Date(resource.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{resource.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {resource.downloadUrl && (
                      <Button asChild size="sm" className="flex-1">
                        <a href={resource.downloadUrl} className="flex items-center justify-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </a>
                      </Button>
                    )}
                    {resource.url && (
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <a 
                          href={resource.url} 
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

        {/* Contribute Section */}
        <div className="mt-16 text-center bg-primary text-primary-foreground rounded-lg p-12">
          <h2 className="font-serif font-bold text-3xl mb-4">Contribute Resources</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Help us expand our resource collection by suggesting new databases, 
            publications, or tools that would benefit our academic community.
          </p>
          <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            Suggest a Resource
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Resources;