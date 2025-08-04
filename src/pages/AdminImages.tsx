import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import HeroImageManager from '@/components/HeroImageManager';
import AcademicBuildingManager from '@/components/AcademicBuildingManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Settings } from 'lucide-react';

const AdminImages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground">Image Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage website images and visual content
            </p>
          </div>

          {/* Image Management Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hero Image Manager */}
            <div>
              <HeroImageManager />
            </div>

            {/* Academic Building Manager */}
            <div>
              <AcademicBuildingManager />
            </div>
          </div>

          {/* Information Card */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Image Management Guidelines
                </CardTitle>
                <CardDescription>
                  Best practices for managing website images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Hero Image</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Main landing page background image</li>
                      <li>• Recommended: 1920x1080 or larger</li>
                      <li>• Should be high quality and professional</li>
                      <li>• Text overlay should remain readable</li>
                      <li>• Changes affect all website visitors immediately</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Academic Building Image</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Used in "About Preview" section</li>
                      <li>• Also appears in Research Areas cards</li>
                      <li>• Recommended: 800x600 or larger</li>
                      <li>• Should represent academic/professional setting</li>
                      <li>• Changes are applied instantly</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">General Tips</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Use high-quality images with good lighting</li>
                    <li>• Optimize file sizes for faster loading</li>
                    <li>• Test images on different screen sizes</li>
                    <li>• Keep backups of original images</li>
                    <li>• All changes are immediately visible to visitors</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminImages; 