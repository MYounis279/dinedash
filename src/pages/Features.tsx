import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Smartphone, BarChart3, Share2, Edit3, Palette, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: <QrCode className="h-12 w-12 text-indigo-600" />,
      title: 'Instant QR Generation',
      description: 'Generate high-quality, customizable QR codes for your menu in seconds. Our QR codes are optimized for quick scanning and reliability.',
    },
    {
      icon: <Edit3 className="h-12 w-12 text-indigo-600" />,
      title: 'Easy Menu Management',
      description: 'Intuitive interface to create, edit, and organize your menu items. Add descriptions, prices, and dietary information with ease.',
    },
    {
      icon: <Palette className="h-12 w-12 text-indigo-600" />,
      title: 'Beautiful Templates',
      description: 'Choose from our collection of professionally designed templates. Customize colors, fonts, and layouts to match your brand.',
    },
    {
      icon: <Smartphone className="h-12 w-12 text-indigo-600" />,
      title: 'Mobile-First Design',
      description: 'Your menu looks perfect on every device. Our responsive design ensures a great experience for all your customers.',
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-indigo-600" />,
      title: 'Advanced Analytics',
      description: 'Track menu views, popular items, and customer engagement. Make data-driven decisions to optimize your menu.',
    },
    {
      icon: <Share2 className="h-12 w-12 text-indigo-600" />,
      title: 'Easy Sharing',
      description: 'Share your menu across all social platforms. Generate short URLs and download QR codes in multiple formats.',
    },
    {
      icon: <Clock className="h-12 w-12 text-indigo-600" />,
      title: 'Real-Time Updates',
      description: 'Update your menu instantly. Changes are reflected immediately across all platforms and devices.',
    },
    {
      icon: <Shield className="h-12 w-12 text-indigo-600" />,
      title: 'Secure & Reliable',
      description: 'Your menu is always available. We ensure 99.9% uptime and secure data storage.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Powerful Features for Your Digital Menu
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-indigo-100 max-w-3xl mx-auto"
          >
            Everything you need to create, manage, and share your digital menu with QR codes
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Transform Your Menu Experience?
          </h2>
          <Link to="/signup" className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Features;