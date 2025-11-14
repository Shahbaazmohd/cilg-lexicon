import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import ImageManagementDashboard from '@/components/ImageManagementDashboard';
import { simpleAuthService } from '@/lib/simpleAuthService';

const AdminImages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!simpleAuthService.isAuthenticated() || !simpleAuthService.isAdmin()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    simpleAuthService.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground">Image Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage all images across the website including page images and team member photos
            </p>
          </div>

          {/* Image Management Dashboard */}
          <ImageManagementDashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminImages; 