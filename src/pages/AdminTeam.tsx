import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import TeamMemberManager from '@/components/TeamMemberManager';
import { simpleAuthService } from '@/lib/simpleAuthService';

const AdminTeam = () => {
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
            <h1 className="text-3xl font-serif font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage team members, their roles, and profile images
            </p>
          </div>

          {/* Team Member Manager */}
          <TeamMemberManager />
        </div>
      </div>
    </div>
  );
};

export default AdminTeam; 