const SubmissionGuidelines = () => {
  return (
    <div className="academic-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Submission Guidelines</h1>
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Manuscript Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Articles should be 3,000-8,000 words in length</li>
              <li>Include proper citations and bibliography</li>
              <li>Use academic formatting standards</li>
              <li>Original research and analysis required</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Review Process</h2>
            <p className="text-muted-foreground">All submissions undergo peer review by our editorial board.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SubmissionGuidelines;