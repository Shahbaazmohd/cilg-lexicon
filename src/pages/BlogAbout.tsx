

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BlogAbout = () => {
  return (
    <div className="academic-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">About the Blog</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg academic-text leading-relaxed mb-6">
            The USLLS-CILG International Law and Governance Blog is a student-led initiative dedicated to fostering informed dialogue and critical engagement with global legal developments. Managed by the student community of USLLS, GGSIPU, the blog aims to publish insightful and original pieces that address contemporary issues in public and private international law, international organisations, humanitarian law, trade law, international dispute resolution, and allied disciplines. The blog seeks to encourage discourse by presenting itself as a medium for young scholars, practitioners, and policy enthusiasts to voice their perspectives, respond to emerging developments, and contribute to the evolving discourse of international law.
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            The CILG Blog serves as a premier platform for scholarly discourse on international law and governance issues.
          </p>
          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">Our Mission</h2>
          <p>To provide thoughtful analysis and commentary on contemporary issues in international law, governance, and policy.</p>
          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">Editorial Standards</h2>
          <p>All articles undergo rigorous peer review to ensure academic excellence and scholarly integrity.</p>

          <div className="mt-10 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-academic hover:bg-academic/90 text-academic-foreground">
                <Link to="/blog" className="flex items-center space-x-2">
                  <span>Blog Posts</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-academic text-academic hover:bg-academic hover:text-academic-foreground">
                <Link to="/submit-blog" className="flex items-center space-x-2">
                  <span>Submit Blog</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAbout;