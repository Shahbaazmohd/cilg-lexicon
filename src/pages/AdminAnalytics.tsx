import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, FileText, MessageSquare } from 'lucide-react';

const AdminAnalytics = () => {
  const stats = [
    {
      title: 'Total Page Views',
      value: '24,592',
      change: '+12.5%',
      trend: 'up',
      icon: Eye
    },
    {
      title: 'Unique Visitors',
      value: '8,431',
      change: '+8.2%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Published Articles',
      value: '47',
      change: '+3',
      trend: 'up',
      icon: FileText
    },
    {
      title: 'Engagement Rate',
      value: '68%',
      change: '+5.1%',
      trend: 'up',
      icon: MessageSquare
    }
  ];

  const topArticles = [
    { title: 'International Criminal Law Evolution', views: 3420, engagement: '72%' },
    { title: 'Climate Change Governance', views: 2890, engagement: '68%' },
    { title: 'Digital Rights Framework', views: 2650, engagement: '65%' },
    { title: 'Trade Law Analysis', views: 2340, engagement: '61%' },
    { title: 'Human Rights in Tech', views: 2180, engagement: '69%' }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Track website performance and content engagement
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Articles</CardTitle>
                <CardDescription>
                  Most viewed articles this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topArticles.map((article, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {article.views} views • {article.engagement} engagement
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">#{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Where your visitors are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: 'Direct', percentage: 42, visits: 10248 },
                    { source: 'Search Engines', percentage: 28, visits: 6826 },
                    { source: 'Social Media', percentage: 18, visits: 4387 },
                    { source: 'Referrals', percentage: 12, visits: 2926 }
                  ].map((source) => (
                    <div key={source.source} className="flex items-center">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{source.source}</span>
                          <span className="text-sm text-muted-foreground">
                            {source.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;