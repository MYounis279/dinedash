import { LayoutDashboard, Menu, Palette, QrCode, DollarSign, Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const mainNavItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard/'
    },
    {
      name: 'Menus',
      icon: <Menu className="h-5 w-5" />,
      path: '/dashboard/menus/'
    },
    {
      name: 'Templates',
      icon: <Palette className="h-5 w-5" />,
      path: '/dashboard/templates/'
    },
    {
      name: 'QR Codes',
      icon: <QrCode className="h-5 w-5" />,
      path: '/dashboard/qr-codes/'
    }
  ];

  const secondaryNavItems = [
    {
      name: 'Features',
      icon: <Settings className="h-5 w-5" />,
      path: '/features/'
    },
    {
      name: 'Pricing',
      icon: <DollarSign className="h-5 w-5" />,
      path: '/pricing/'
    }
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4 border-b border-gray-200">
          <QrCode className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">MenuQR</span>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 p-4">
          <div className="mb-8">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 mb-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Secondary Navigation */}
          <div className="mb-8">
            <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
              More
            </div>
            {secondaryNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-4 py-3 mb-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar; 