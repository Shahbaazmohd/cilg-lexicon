import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/ModernNavbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import SubmitBlog from "./pages/SubmitBlog";
import Bulletin from "./pages/Bulletin";
import Events from "./pages/Events";
import Team from "./pages/Team";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import BlogAbout from "./pages/BlogAbout";
import CILGBlog from "./pages/CILGBlog";
import SubmissionGuidelines from "./pages/SubmissionGuidelines";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSubmissions from "./pages/AdminSubmissions";
import AdminBulletin from "./pages/AdminBulletin";
import AdminDrafts from "./pages/AdminDrafts";
import AdminFeatured from "./pages/AdminFeatured";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminImages from "./pages/AdminImages";
import AdminTeam from "./pages/AdminTeam";
import AdminEvents from "./pages/AdminEvents";
import AdminNotices from "./pages/AdminNotices";
import AdminContactMessages from "./pages/AdminContactMessages";
import AdminResources from "./pages/AdminResources";
import SimpleSecureRoute from "./components/SimpleSecureRoute";

import { useScrollToTop } from "./hooks/useScrollToTop";

const queryClient = new QueryClient();

// Component to handle scroll-to-top functionality
const ScrollToTopWrapper = () => {
  useScrollToTop();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTopWrapper />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/submit-blog" element={<SubmitBlog />} />
              <Route path="/bulletin" element={<Bulletin />} />
              <Route path="/events" element={<Events />} />
              <Route path="/team" element={<Team />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog/about" element={<BlogAbout />} />
              <Route path="/sblog/blogposts" element={<CILGBlog />} />
              <Route path="/submissions/guidelines" element={<SubmissionGuidelines />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin/dashboard" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminDashboard />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/submissions" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminSubmissions />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/bulletin" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminBulletin />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/drafts" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminDrafts />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/featured" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminFeatured />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/team" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminTeam />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/images" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminImages />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/events" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminEvents />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/notices" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminNotices />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/analytics" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminAnalytics />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/contact-messages" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminContactMessages />
                </SimpleSecureRoute>
              } />
              <Route path="/admin/resources" element={
                <SimpleSecureRoute requireAdmin={true}>
                  <AdminResources />
                </SimpleSecureRoute>
              } />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;