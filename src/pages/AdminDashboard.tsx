import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Newspaper, Edit3, Star, Users, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const stats = [
    {
      title: 'Total Posts',
      value: '47',
      description: 'Published blog posts',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Pending Submissions',
      value: '12',
      description: 'Awaiting review',
      icon: Edit3,
      color: 'text-orange-600'
    },
    {
      title: 'Featured Articles',
      value: '8',
      description: 'Currently featured',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Bulletin Articles',
      value: '23',
      description: 'Cosmopolitan Bulletin',
      icon: Newspaper,
      color: 'text-green-600'
    },
    {
      title: 'Team Members',
      value: '15',
      description: 'Active contributors',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Monthly Views',
      value: '2.4K',
      description: 'This month',
      icon: Eye,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to the CILG administration panel
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>
                  Latest blog submissions requiring review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Climate Justice and International Law', author: 'Dr. Sarah Smith', time: '2 hours ago' },
                    { title: 'Digital Rights in the Modern Era', author: 'Prof. Michael Johnson', time: '5 hours ago' },
                    { title: 'Trade Agreements and Sovereignty', author: 'Dr. Emily Chen', time: '1 day ago' }
                  ].map((submission, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{submission.title}</p>
                        <p className="text-xs text-muted-foreground">
                          by {submission.author} • {submission.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-md border border-border hover:bg-muted transition-colors">
                    <div className="font-medium text-sm">Review Submissions</div>
                    <div className="text-xs text-muted-foreground">12 pending reviews</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-md border border-border hover:bg-muted transition-colors">
                    <div className="font-medium text-sm">Update Featured Posts</div>
                    <div className="text-xs text-muted-foreground">Manage homepage content</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-md border border-border hover:bg-muted transition-colors">
                    <div className="font-medium text-sm">Add Bulletin Article</div>
                    <div className="text-xs text-muted-foreground">Cosmopolitan Bulletin</div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;