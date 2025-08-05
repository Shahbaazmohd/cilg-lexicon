import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const SubmissionGuidelines = () => {
  return (
    <div className="academic-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Submission Guidelines</h1>
        <div className="prose prose-lg max-w-none space-y-6">
          
          <section>
            <p className="text-muted-foreground leading-relaxed">
              We, at USLLS CILG Blog, believe that sustained academic deliberation is required to ensure that the field of International Law and International Relations grows continuously, and becomes the mainstream solution to disputes. Our aim is to provide a conducive platform that fosters discussions and deliberations pertaining to the field of International Law and International Relations by academicians, researchers, law students and legal practitioners. We hope to promote the culture of international affairs and acquire the viewpoints of the various stakeholders in the field. Hence with the above objectives in mind, we welcome all relevant submissions subject to the following guidelines:
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">General Guidelines</h2>
            <ul className="list-disc list-inside space-y-3 text-muted-foreground">
              <li>Co-authorship is allowed up to two authors. The author(s) should refrain from mentioning the name, institutional affiliation, or any other details in the document to facilitate the double-blind review process.</li>
              <li>Submissions should be original and unpublished work of the author(s). Any form of plagiarism will result in an automatic rejection. Moreover, if the Turnitin similarity index reports over 20% similarity (after making the relevant exclusions such as bibliography, quotes, small matches etc.), then the submission shall be rejected. The use of Artificial Intelligence (AI) tools like ChatGPT etc. is strictly prohibited.</li>
              <li>Submissions should be concise. They should range between 1000-2000 words. Longer posts may be published in parts subject to the editorial board's discretion. The word limit is exclusive of the endnotes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">General Formatting Guidelines</h2>
            
            <h3 className="text-xl font-serif font-semibold mb-3">1. Formatting Typescript</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
              <li>Font Type: Times New Roman</li>
              <li>Font Size: 12</li>
              <li>Line Spacing: 1.5</li>
              <li>Text Alignment: Justified</li>
            </ul>

            <h3 className="text-xl font-serif font-semibold mb-3">2. Citation Style</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Method of Citation: Endnotes</li>
              <li>Format of Citation: BlueBook 21st Edition</li>
              <li>Font Type: Times New Roman</li>
              <li>Font Size: 10</li>
              <li>Line Spacing: 1.0</li>
              <li>Text Alignment: Justified</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Review Process</h2>
            <p className="text-muted-foreground leading-relaxed">
              All submissions will undergo a rigorous double-blind review process where the manuscript will be evaluated by two editors on different parameters. The review process ideally concludes within a period of 14 days from the date of receipt of the acknowledgment of the submission. Once the review is complete, the decision of acceptance (conditional or unconditional) or rejection will be communicated to the author. The authors will be provided a period of 10 days to make the necessary changes that may be suggested by the editorial board. It is expected that the authors will make all the changes in good faith.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Copyright and Exclusivity</h2>
            <ul className="list-disc list-inside space-y-3 text-muted-foreground">
              <li>Upon acceptance of the manuscript for publication by the editorial board, the copyright over the manuscript is vested in the Blog. However, the moral rights over the manuscript shall vest in the author(s).</li>
              <li>The Blog only accepts original and exclusive submissions. Once a manuscript is accepted, the same cannot be sent elsewhere for publication.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Submission Procedure</h2>
            <p className="text-muted-foreground leading-relaxed">
              We accept rolling submissions. All submissions must be made through the website only. No manuscript will be accepted for publishing through any other medium. An abstract of not more than 100 words must accompany the submission. The abstract is exclusive of the word limit for the article. The author(s) are also required to submit a short biography detailing their current designation and institutional affiliations.
            </p>
          </section>

          <div className="mt-12 text-center">
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