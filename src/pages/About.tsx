import { Users, Target, BookOpen, Globe } from 'lucide-react';
import academicBuilding from '@/assets/academic-building.jpg';
import lawBooks from '@/assets/law-books.jpg';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="academic-heading text-4xl md:text-5xl mb-6">
            About CILG
          </h1>
          <p className="academic-text text-xl max-w-3xl mx-auto">
            The Centre for International Law and Governance stands as a beacon of excellence 
            in legal scholarship and policy research, fostering innovative discourse on 
            global governance challenges.
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
              To advance understanding and application of international law through rigorous 
              research, innovative scholarship, and collaborative engagement with global 
              academic and policy communities. We strive to bridge the gap between theoretical 
              knowledge and practical governance solutions.
            </p>
          </div>

          <div className="academic-card p-8">
            <div className="flex items-center mb-6">
              <Globe className="h-8 w-8 text-primary mr-3" />
              <h2 className="academic-heading text-2xl">Our Vision</h2>
            </div>
            <p className="academic-text text-lg leading-relaxed">
              To be a globally recognized center of excellence that shapes the future of 
              international law and governance through transformative research, education, 
              and policy engagement that addresses the most pressing challenges of our time.
            </p>
          </div>
        </div>

        {/* History Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="academic-heading text-3xl mb-6">Our Story</h2>
            <div className="space-y-6 academic-text text-lg">
              <p>
                Established in 2010, the Centre for International Law and Governance emerged 
                from a recognition that traditional approaches to international law needed 
                fresh perspectives and interdisciplinary insights.
              </p>
              <p>
                Founded by a coalition of distinguished scholars and practitioners, CILG has 
                grown to become a leading voice in international legal scholarship, hosting 
                conferences, publishing research, and fostering dialogue between academia 
                and practice.
              </p>
              <p>
                Over the years, we have contributed to major policy discussions on climate 
                governance, international criminal justice, human rights protection, and 
                digital governance, establishing ourselves as thought leaders in these 
                critical areas.
              </p>
            </div>
          </div>
          <div>
            <img
              src={academicBuilding}
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

        {/* Research Areas */}
        <div className="mb-20">
          <h2 className="academic-heading text-3xl text-center mb-12">Research Focus Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'International Criminal Justice',
                description: 'Examining accountability mechanisms and justice processes in international crimes.',
                image: lawBooks
              },
              {
                title: 'Climate Governance',
                description: 'Legal frameworks for addressing environmental challenges and climate change.',
                image: academicBuilding
              },
              {
                title: 'Human Rights Protection',
                description: 'Contemporary challenges in human rights law and implementation.',
                image: lawBooks
              },
              {
                title: 'Trade & Economic Law',
                description: 'International economic governance and trade regulation mechanisms.',
                image: academicBuilding
              },
              {
                title: 'Digital Governance',
                description: 'Legal challenges in cyberspace and digital rights protection.',
                image: lawBooks
              },
              {
                title: 'Conflict Resolution',
                description: 'International dispute resolution and peacebuilding through law.',
                image: academicBuilding
              }
            ].map((area, index) => (
              <div key={index} className="academic-card overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="academic-heading text-xl mb-3">{area.title}</h3>
                  <p className="academic-text">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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