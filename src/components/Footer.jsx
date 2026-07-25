import { Link } from 'react-router-dom';
import { ShieldAlert, Code2, Share2, Link2, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-6 h-6" style={{ color: '#3B82F6' }} />
              <span className="text-xl font-bold text-white">CrowdCivic Dindigul</span>
            </Link>
            <p className="max-w-sm mb-6" style={{ color: '#9ca3af' }}>
              Empowering citizens of Dindigul to report and track civic issues, fostering a cleaner and safer community through smart technology.
            </p>
            <div className="flex space-x-4">
              {[Code2, Share2, Link2, Mail].map((Icon, i) => (
                <a key={i} href="#" className="transition-colors" style={{ color: '#9ca3af' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[['Home','/'],['Citizen Dashboard','/dashboard'],['Admin Portal','/admin'],['About Project','/about']].map(([name, path]) => (
                <li key={name}>
                  <Link to={path} className="transition-colors" style={{ color: '#9ca3af' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#3B82F6'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                  >{name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2" style={{ color: '#9ca3af' }}>
              <li>MCA Final Year Project</li>
              <li>Dindigul College of Technology</li>
              <li>crowdcivic.dindigul@demo.edu</li>
              <li>திண்டுக்கல், Tamil Nadu</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            &copy; {new Date().getFullYear()} CrowdCivic Dindigul Project. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm" style={{ color: '#9ca3af' }}>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
