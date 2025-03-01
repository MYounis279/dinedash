import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Smartphone, BarChart3, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Transform Your Menu Into a Digital Experience
              </h1>
              <p className="text-lg mb-8 text-gray-100">
                Create beautiful, interactive QR code menus that enhance your customer's dining experience
                and streamline your business operations.
              </p>
              <Link to="/signup/" className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                Start Free Trial
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Restaurant QR Code Menu"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MenuQR?</h2>
            <p className="text-lg text-gray-600">
              Everything you need to digitize your menu and enhance customer experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <QrCode className="h-8 w-8 text-indigo-600" />,
                title: 'Easy QR Generation',
                description: 'Create custom QR codes for your menu in seconds',
              },
              {
                icon: <Smartphone className="h-8 w-8 text-indigo-600" />,
                title: 'Mobile Optimized',
                description: 'Perfect viewing experience on all devices',
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
                title: 'Analytics Dashboard',
                description: 'Track menu views and customer engagement',
              },
              {
                icon: <Share2 className="h-8 w-8 text-indigo-600" />,
                title: 'Easy Sharing',
                description: 'Share your menu across all social platforms',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Transform Your Menu Experience?
          </h2>
          <Link to="/signup/" className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;