import AnimatedTooltipPreview from "@/components/ui/animated-tooltip-demo";

const BlogAbout = () => {
  return (
    <div className="academic-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">About the Blog</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            The CILG Blog serves as a premier platform for scholarly discourse on international law and governance issues.
          </p>
          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">Our Mission</h2>
          <p>To provide thoughtful analysis and commentary on contemporary issues in international law, governance, and policy.</p>
          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">Editorial Standards</h2>
          <p>All articles undergo rigorous peer review to ensure academic excellence and scholarly integrity.</p>
          
          <h2 className="text-2xl font-serif font-semibold mt-8 mb-6">Board of Editors</h2>
          <p className="text-muted-foreground mb-12">
            Our distinguished editorial board consists of leading scholars and practitioners in international law and governance. 
            Each member brings unique expertise and ensures the highest standards of academic rigor in our publications.
          </p>
          <div className="flex justify-center py-8">
            <AnimatedTooltipPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAbout;