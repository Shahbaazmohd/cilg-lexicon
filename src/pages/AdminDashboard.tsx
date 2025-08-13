import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Newspaper, Edit3, Star, Users, Eye, Calendar, Bell, Download, Shield } from 'lucide-react';
import { simpleAuthService } from '@/lib/simpleAuthService';
import { supabase } from '@/integrations/supabase/client';
import { EventService } from '@/lib/eventService';
import { TeamService } from '@/lib/teamService';
import { NoticeService } from '@/lib/noticeService';
import { Skeleton } from '@/components/ui/skeleton';
import { ContactService } from '@/lib/contactService';
import { ResourceService } from '@/lib/resourceService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalPosts: number;
  pendingSubmissions: number;
  featuredArticles: number;
  bulletinArticles: number;
  teamMembers: number;
  totalEvents: number;
  totalNotices: number;
  contactMessages: number;
  unreadMessages: number;
  totalResources: number;
  activeResources: number;
  featuredResources: number;
  totalDownloads: number;
}

interface RecentSubmission {
  id: string;
  title: string;
  author_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    pendingSubmissions: 0,
    featuredArticles: 0,
    bulletinArticles: 0,
    teamMembers: 0,
    totalEvents: 0,
    totalNotices: 0,
    contactMessages: 0,
    unreadMessages: 0,
    totalResources: 0,
    activeResources: 0,
    featuredResources: 0,
    totalDownloads: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    // Check if user is authenticated using simple auth service
    const checkAuth = () => {
      if (!simpleAuthService.isAuthenticated()) {
        navigate('/admin/login');
        return;
      }

      const isAdmin = simpleAuthService.isAdmin();
      if (!isAdmin) {
        navigate('/admin/login');
        return;
      }

      // Get admin user details
      const authState = simpleAuthService.getAuthState();
      if (authState.user) {
        setAdminInfo({
          name: authState.user.email.split('@')[0],
          role: authState.user.role
        });
      }

      fetchDashboardData();
    };

    checkAuth();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        blogPosts,
        cosmopolitanBulletins,
        teamMembersData,
        events,
        notices,
        contactMessages,
        unreadMessages,
        resourceStats
      ] = await Promise.all([
        // Blog posts
        supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // Cosmopolitan bulletins
        supabase
          .from('cosmopolitan_bulletins')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // Team members
        TeamService.getAllTeamMembers(),
        
        // Events
        EventService.getAllEvents(),
        
        // Notices
        NoticeService.getAllNotices(),
        
        // Contact messages
        ContactService.getAllContactMessages(),
        
        // Unread messages
        ContactService.getUnreadCount(),
        
        // Resource statistics
        ResourceService.getResourceStats()
      ]);

      // Process blog posts data
      const totalPosts = blogPosts.data?.length || 0;
      const pendingSubmissions = blogPosts.data?.filter(post => post.status === 'pending').length || 0;
      const featuredArticles = blogPosts.data?.filter(post => post.featured).length || 0;

      // Process cosmopolitan bulletins data
      const bulletinArticles = cosmopolitanBulletins.data?.length || 0;

      // Process team members data
      const teamMembers = teamMembersData.length;

      // Process events data
      const totalEvents = events.length;

      // Process notices data
      const totalNotices = notices.length;

      // Process contact messages data
      const contactMessagesCount = contactMessages.length;

      // Process resource statistics
      const {
        totalResources,
        activeResources,
        featuredResources,
        totalDownloads
      } = resourceStats;

      setStats({
        totalPosts,
        pendingSubmissions,
        featuredArticles,
        bulletinArticles,
        teamMembers,
        totalEvents,
        totalNotices,
        contactMessages: contactMessagesCount,
        unreadMessages: unreadMessages,
        totalResources,
        activeResources,
        featuredResources,
        totalDownloads
      });

      // Set recent submissions
      const recentSubs = blogPosts.data
        ?.filter(post => post.status === 'pending')
        .slice(0, 5)
        .map(post => ({
          id: post.id,
          title: post.title,
          author_name: post.author_name,
          status: post.status as 'pending' | 'approved' | 'rejected',
          created_at: post.created_at
        })) || [];

      setRecentSubmissions(recentSubs);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await authService.signOut();
      if (result.success) {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
          variant: "default"
        });
        navigate('/admin/login');
      } else {
        toast({
          title: "Logout Error",
          description: result.error || 'Failed to log out',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Logout Error",
        description: 'An unexpected error occurred',
        variant: "destructive"
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 p-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingSubmissions} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Articles</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredArticles}</div>
              <p className="text-xs text-muted-foreground">
                {stats.bulletinArticles} bulletin articles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamMembers}</div>
              <p className="text-xs text-muted-foreground">
                Active team members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Total events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notices</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNotices}</div>
              <p className="text-xs text-muted-foreground">
                Active notices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contactMessages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unreadMessages} unread
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResources}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeResources} active, {stats.totalDownloads} downloads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Resources</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredResources}</div>
              <p className="text-xs text-muted-foreground">
                Prominently displayed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('/admin/submissions')}
          >
            <Edit3 className="h-6 w-6" />
            <span>Review Submissions ({stats.pendingSubmissions})</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('/admin/contact-messages')}
          >
            <Eye className="h-6 w-6" />
            <span>View Messages ({stats.unreadMessages})</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('/admin/resources')}
          >
            <Download className="h-6 w-6" />
            <span>Manage Resources ({stats.totalResources})</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('/admin/events')}
          >
            <Calendar className="h-6 w-6" />
            <span>Manage Events ({stats.totalEvents})</span>
          </Button>
        </div>

        {/* Recent Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Latest blog post submissions awaiting review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {submission.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          by {submission.author_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(submission.created_at)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No pending submissions</p>
              )}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/admin/submissions')}
              >
                View All Submissions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>
                Overview of your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Blog Posts</span>
                  <span className="text-sm text-muted-foreground">{stats.totalPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bulletin Articles</span>
                  <span className="text-sm text-muted-foreground">{stats.bulletinArticles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Team Members</span>
                  <span className="text-sm text-muted-foreground">{stats.teamMembers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Events</span>
                  <span className="text-sm text-muted-foreground">{stats.totalEvents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notices</span>
                  <span className="text-sm text-muted-foreground">{stats.totalNotices}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Resources</span>
                  <span className="text-sm text-muted-foreground">{stats.totalResources}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Contact Messages</span>
                  <span className="text-sm text-muted-foreground">{stats.contactMessages}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;