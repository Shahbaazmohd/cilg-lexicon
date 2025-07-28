import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="academic-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png" 
                alt="CILG Logo" 
                className="w-10 h-10"
              />
              <span className="font-serif font-bold text-lg">Centre for International Law & Governance</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Advancing academic research 
              and discourse in international law, policy, and governance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Submit Blog', href: '/submit-blog' },
                { name: 'Events', href: '/events' },
                { name: 'Resources', href: '/resources' },
                { name: 'Admin Login', href: '/admin/login' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Publications */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg">Publications</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/bulletin"
                  className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors duration-200"
                >
                  Cosmopolitan Bulletin
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>Research Papers</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors duration-200"
                >
                  Meet the Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary-foreground/60" />
                <div>
                  <p className="text-primary-foreground/80 text-sm">
                    usllscilg@gmail.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-foreground/60" />
                <div>
                  <p className="text-primary-foreground/80 text-sm">
                    USLLS, GGSIPU<br />
                    Dwarka, Delhi- 110078
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Centre for International Law and Governance. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-primary-foreground text-sm">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;