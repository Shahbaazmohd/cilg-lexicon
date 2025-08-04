import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Star, Clock, User, Mail, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AdminSidebar from '@/components/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { emailService } from '@/lib/emailService';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_email: string;
  category: string;
  excerpt: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  created_at: string;
}

const AdminSubmissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<BlogPost | null>(null);
  const [adminComments, setAdminComments] = useState('');
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        return;
      }

      setSubmissions((data || []) as BlogPost[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    const submission = submissions.find(s => s.id === id);
    if (!submission) return;

    try {
      // Update status in database
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(submission => 
          submission.id === id 
            ? { ...submission, status: newStatus }
            : submission
        )
      );

      // Send email notification to author
      let emailSent = false;
      if (newStatus === 'approved') {
        emailSent = await emailService.sendApprovalNotification({
          title: submission.title,
          authorName: submission.author_name,
          authorEmail: submission.author_email,
          status: 'approved',
          adminComments: adminComments || undefined,
          publishUrl: `https://cilg.org/blog/${submission.id}` // Replace with actual URL structure
        });
      } else {
        emailSent = await emailService.sendRejectionNotification({
          title: submission.title,
          authorName: submission.author_name,
          authorEmail: submission.author_email,
          status: 'rejected',
          adminComments: adminComments || undefined
        });
      }

      // Show appropriate toast message
      if (emailSent) {
        toast({
          title: "Status Updated",
          description: `Blog post ${newStatus} successfully. Email notification sent to author.`,
        });
      } else {
        toast({
          title: "Status Updated",
          description: `Blog post ${newStatus} successfully. Email notification failed.`,
        });
      }

      // Reset dialog state
      setShowCommentsDialog(false);
      setSelectedSubmission(null);
      setAdminComments('');
      setPendingAction(null);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive"
      });
    }
  };

  const handleApproveReject = (submission: BlogPost, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission);
    setPendingAction(action);
    setShowCommentsDialog(true);
  };

  const toggleFeatured = async (id: string) => {
    const submission = submissions.find(s => s.id === id);
    if (!submission) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ featured: !submission.featured })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSubmissions(prev => 
        prev.map(submission => 
          submission.id === id 
            ? { ...submission, featured: !submission.featured }
            : submission
        )
      );

      toast({
        title: "Featured Status Updated",
        description: `Blog post ${!submission.featured ? 'featured' : 'unfeatured'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle featured status.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (submission: BlogPost) => {
    setSubmissionToDelete(submission);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!submissionToDelete) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', submissionToDelete.id);

      if (error) {
        throw error;
      }

      // Remove from local state
      setSubmissions(prev => 
        prev.filter(submission => submission.id !== submissionToDelete.id)
      );

      toast({
        title: "Blog Post Deleted",
        description: `"${submissionToDelete.title}" has been permanently deleted.`,
      });

      // Reset dialog state
      setShowDeleteDialog(false);
      setSubmissionToDelete(null);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">
            <p className="academic-text">Loading submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="academic-heading text-3xl mb-2">Blog Submissions</h1>
            <p className="academic-text">Review and manage blog post submissions.</p>
          </div>

          <div className="grid gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{submission.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {submission.author_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {submission.author_email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(submission.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </Badge>
                      {submission.featured && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline">{submission.category}</Badge>
                    </div>
                    <p className="academic-text text-sm">
                      {submission.excerpt || submission.content.substring(0, 200) + '...'}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{submission.title}</DialogTitle>
                            <DialogDescription>
                              By {submission.author_name} | {submission.category}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="prose max-w-none">
                              <p className="whitespace-pre-wrap">{submission.content}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant={submission.featured ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFeatured(submission.id)}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        {submission.featured ? 'Unfeature' : 'Feature'}
                      </Button>

                      {submission.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveReject(submission, 'approve')}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleApproveReject(submission, 'reject')}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(submission)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {submissions.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="academic-heading text-lg mb-2">No Submissions Yet</h3>
                  <p className="academic-text">
                    Blog submissions will appear here once users start submitting articles.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={showCommentsDialog} onOpenChange={setShowCommentsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === 'approve' ? 'Approve' : 'Reject'} Article
            </DialogTitle>
            <DialogDescription>
              {selectedSubmission && (
                <>
                  <strong>{selectedSubmission.title}</strong> by {selectedSubmission.author_name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminComments">
                Comments (Optional)
              </Label>
              <Textarea
                id="adminComments"
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                placeholder={
                  pendingAction === 'approve' 
                    ? "Add any comments for the author (optional)..."
                    : "Please provide feedback for the author (optional)..."
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentsDialog(false);
                  setSelectedSubmission(null);
                  setAdminComments('');
                  setPendingAction(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={pendingAction === 'approve' ? 'default' : 'destructive'}
                onClick={() => {
                  if (selectedSubmission && pendingAction) {
                    handleStatusChange(
                      selectedSubmission.id, 
                      pendingAction === 'approve' ? 'approved' : 'rejected'
                    );
                  }
                }}
              >
                {pendingAction === 'approve' ? 'Approve' : 'Reject'} Article
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {submissionToDelete && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{submissionToDelete.title}</h4>
                <p className="text-sm text-muted-foreground">
                  By {submissionToDelete.author_name} • {submissionToDelete.category}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Status: {submissionToDelete.status.charAt(0).toUpperCase() + submissionToDelete.status.slice(1)}
                  {submissionToDelete.featured && ' • Featured'}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSubmissionToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubmissions;