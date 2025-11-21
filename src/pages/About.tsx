import { useState, useEffect } from 'react';
import { Users, Target, BookOpen, Globe } from 'lucide-react';
import { DynamicImageService } from '@/lib/dynamicImageService';
import academicBuilding from '@/assets/academic-building.jpg';
import lawBooks from '@/assets/law-books.jpg';

const About = () => {
  const [researchAreaImages, setResearchAreaImages] = useState({
    'research-area-1': lawBooks,
    'research-area-2': lawBooks,
    'research-area-3': academicBuilding,
  });
  const [storyImageUrl, setStoryImageUrl] = useState(academicBuilding);

  // Load dynamic images on component mount
  useEffect(() => {
    loadDynamicImages();
  }, []);

  const loadDynamicImages = async () => {
    try {
      // Load story image
      const storyUrl = await DynamicImageService.getImageUrlWithFallback('about-story');
      setStoryImageUrl(storyUrl);

      // Load research area images
      const researchArea1Url = await DynamicImageService.getImageUrlWithFallback('research-area-1');
      const researchArea2Url = await DynamicImageService.getImageUrlWithFallback('research-area-2');
      const researchArea3Url = await DynamicImageService.getImageUrlWithFallback('research-area-3');

      setResearchAreaImages({
        'research-area-1': researchArea1Url,
        'research-area-2': researchArea2Url,
        'research-area-3': researchArea3Url,
      });
    } catch (error) {
      console.error('Error loading dynamic images:', error);
      // Keep default images if loading fails
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="academic-heading text-4xl md:text-5xl mb-6">
            About CILG
          </h1>
          <p className="academic-text text-xl max-w-3xl mx-auto">
            The Cell for International Law and Governance (CILG) is an interdisciplinary platform 
            dedicated to advancing global legal scholarship. By integrating international law, 
            international relations, and international business, the Cell fosters informed dialogue 
            and practical engagement with contemporary governance challenges.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="academic-card p-8">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-primary mr-3" />
              <h2 className="academic-heading text-2xl">Our Mission</h2>
            </div>
            <p className="academic-text text-lg leading-relaxed">
              To promote rigorous research and holistic learning in international law while bridging 
              the gap between academic study and real-world governance.
            </p>
          </div>

          <div className="academic-card p-8">
            <div className="flex items-center mb-6">
              <Globe className="h-8 w-8 text-primary mr-3" />
              <h2 className="academic-heading text-2xl">Our Vision</h2>
            </div>
            <p className="academic-text text-lg leading-relaxed">
              To be a leading academic hub shaping global discourse on international law and governance 
              through impactful scholarship and meaningful student engagement.
            </p>
          </div>
        </div>

        {/* History Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="academic-heading text-3xl mb-6">Our Story</h2>
            <div className="space-y-6 academic-text text-lg">
              <p>
                The Cell for International Law and Governance was established in response to the 
                growing need for an integrated approach to understanding global issues. As international 
                legal, political, and economic systems became increasingly interconnected, the University 
                School of Law and Legal Studies recognised the importance of preparing students for this 
                evolving landscape.
              </p>
              <p>
                CILG was founded to unite these disciplines under one collaborative space, enabling 
                students to explore international governance through research, discussion, and practical 
                exposure. The Cell aims to build a strong foundation for cultivating globally aware 
                professionals equipped to navigate the complexities of international affairs.
              </p>
            </div>
          </div>
          <div>
            <img
              src={storyImageUrl}
              alt="CILG Building"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="academic-heading text-3xl text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Academic Excellence',
                description: 'Maintaining the highest standards in research and scholarship',
                icon: BookOpen
              },
              {
                title: 'Global Perspective',
                description: 'Embracing diverse viewpoints and international collaboration',
                icon: Globe
              },
              {
                title: 'Intellectual Integrity',
                description: 'Pursuing truth through rigorous and honest inquiry',
                icon: Target
              },
              {
                title: 'Social Impact',
                description: 'Contributing to positive change in law and governance',
                icon: Users
              }
            ].map((value, index) => (
              <div key={index} className="academic-card p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="academic-heading text-lg mb-3">{value.title}</h3>
                <p className="academic-text text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Research Areas - Same as Home page */}
        <section className="py-16">
          <div className="academic-container">
            <div className="text-center mb-12">
              <h2 className="academic-heading text-3xl md:text-4xl mb-4">Research Areas</h2>
              <p className="academic-text text-lg max-w-2xl mx-auto">
                Our research spans across multiple disciplines within international law and governance
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'International Criminal Law',
                  description: 'Exploring justice mechanisms and accountability in international crimes',
                  image: researchAreaImages['research-area-1'],
                },
                {
                  title: 'Human Rights Law',
                  description: 'Contemporary issues in human rights protection and implementation',
                  image: researchAreaImages['research-area-2'],
                },
                {
                  title: 'Conflict Resolution',
                  description: 'Legal approaches to international dispute resolution and peacebuilding',
                  image: researchAreaImages['research-area-3'],
                },
              ].map((area, index) => (
                <div key={index} className="academic-card p-6 group hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={area.image}
                      alt={area.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="academic-heading text-xl mb-3">{area.title}</h3>
                  <p className="academic-text">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brochure Section */}
        <section className="py-16 bg-muted/30">
          <div className="academic-container">
            <div className="text-center mb-12">
              <h2 className="academic-heading text-3xl md:text-4xl mb-4">Our Brochure</h2>
              <p className="academic-text text-lg max-w-2xl mx-auto">
                Download our comprehensive brochure to learn more about our programs, research initiatives, and academic excellence
              </p>
            </div>
            
                         <div className="max-w-4xl mx-auto">
               <div className="academic-card p-8 text-center">
                
                <div className="bg-background rounded-lg border border-border p-6 mb-6">
                  <iframe
                    src="https://drive.google.com/file/d/1Cuu0cqRsHZJLd6zqsCZN_QmCh626oioU/preview"
                    width="100%"
                    height="600"
                    className="rounded-lg shadow-lg"
                    title="CILG Brochure"
                    allow="autoplay"
                  ></iframe>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://drive.google.com/file/d/1Cuu0cqRsHZJLd6zqsCZN_QmCh626oioU/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View in Google Drive
                  </a>
                  <a
                    href="https://drive.google.com/uc?export=download&id=1Cuu0cqRsHZJLd6zqsCZN_QmCh626oioU"
                    className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-md hover:bg-muted/50 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center bg-muted/30 rounded-lg p-12">
          <h2 className="academic-heading text-3xl mb-4">Join Our Community</h2>
          <p className="academic-text text-lg mb-8 max-w-2xl mx-auto">
            Become part of our global network of scholars, practitioners, and students 
            working to advance international law and governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/submit-blog"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              Submit Research
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-base font-medium rounded-md text-foreground bg-background hover:bg-muted/50 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;