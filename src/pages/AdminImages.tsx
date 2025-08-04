import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import DynamicImageManager from '@/components/DynamicImageManager';

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
              Manage dynamic images displayed on the homepage
            </p>
          </div>

          {/* Dynamic Image Manager */}
          <DynamicImageManager />
        </div>
      </div>
    </div>
  );
};

export default AdminImages; 