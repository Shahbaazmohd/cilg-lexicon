import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const SubmissionGuidelines = () => {
  return (
    <div className="academic-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Submission Categories and Requirements</h1>
        <div className="prose prose-lg max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Theme for Contribution</h2>
            <p className="academic-text text-lg leading-relaxed mb-4">
              We welcome original contributions that engage with contemporary issues across the broad spectrum of international law and policy. Submissions may explore themes within Public International Law, Private International Law, Human Rights Law, International Trade Law, International Commercial Laws, International Criminal Law, and International Investment Laws. Please note that this is merely an indicative list of themes that CILG seeks to engage with.
            </p>
            <p className="academic-text text-lg leading-relaxed">
              Interdisciplinary work that connects international law with politics, economics, technology, or environmental policy is particularly welcome.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Guidelines for Contributing</h2>
            <ul className="list-disc list-inside space-y-3 academic-text text-lg">
              <li>Contributions must be between 1,000 and 2,000 words and may include articles, book reviews, case comments, analyses of recent judgments or legislative developments, and critical responses to previously published works. Contributors are requested to include a brief (one- to two-line) biography in the email accompanying their submission.</li>
              <li>Co-authorship of a maximum of two authors is permitted; the details of which must be shared with the editors.</li>
              <li>The title of the manuscript should be formatted to Times New Roman, Bold, Font Size 14, and a centred alignment.</li>
              <li>The main body of the manuscript should be formatted to Times New Roman, Font Size 12 with 1.5 line spacing, and a justified alignment.</li>
              <li>All sources must be hyperlinked within the text wherever possible; if not feasible, endnotes should be used instead, following a uniform citation style.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Submission Deadline</h2>
            <p className="academic-text text-lg leading-relaxed">
              Submissions are accepted on a rolling basis throughout the year.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Review Procedure</h2>
            <ul className="list-disc list-inside space-y-3 academic-text text-lg">
              <li>All submissions undergo plagiarism and AI checks, followed by a multi-stage editorial review process to ensure quality, originality, and relevance.</li>
              <li>We aim to respond to blog submissions within two to three weeks of receiving them.</li>
              <li>Contributors may request an expedited review if the piece addresses a time-sensitive development, such as a recent case, treaty, or geopolitical event.</li>
              <li>If revisions are requested, authors are expected to respond within seven days, unless an extension is granted upon request.</li>
              <li>The editors reserve the right to make minor changes to grammar, formatting, and titles, and to reject submissions without providing substantive feedback.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">How to Submit?</h2>
            <p className="academic-text text-lg leading-relaxed">
              Contributors are required to submit their pieces in .doc or .docx format via email to <a href="mailto:cilgsubmission@gmail.com" className="text-academic hover:underline">cilgsubmission@gmail.com</a>, with the subject line clearly stating "Blog Submission – [Title of the Blog] – [Author's Name]" or they may submit their manuscript through the "submit manuscript" on the website.
            </p>
          </section>

          <div className="mt-12 text-center space-y-4">
            <Button asChild size="lg" className="bg-academic hover:bg-academic/90 text-academic-foreground">
              <Link to="/submit-blog" className="flex items-center space-x-2">
                <span>Submit Your Blog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionGuidelines;