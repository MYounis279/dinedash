import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Edit, Plus, X, Upload, FileText } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useUser } from '../hooks/useUser';
import { menuService } from '../lib/menuService';
import { Menu, MenuData } from '../types/menu';

const Menus = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('templates');
  const [previewImage, setPreviewImage] = useState<{url: string, name: string} | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    url: string;
    name: string;
    type: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menus, setMenus] = useState<Menu[]>([]);

  const templates = [
    {
      id: 1,
      name: 'Modern Bistro',
      image: 'https://i.pinimg.com/736x/4b/75/2e/4b752e4e653430c8d8338cc4296fc8d3.jpg?auto=format&fit=crop&w=800&q=80',
      category: 'Restaurant'
    },
    {
      id: 2,
      name: 'Cafe Classic',
      image: 'https://i.pinimg.com/736x/97/ed/27/97ed275cb88d02e3503befe17989ae74.jpg?auto=format&fit=crop&w=800&q=80',
      category: 'Cafe'
    },
    {
      id: 3,
      name: 'Fine Dining',
      image: 'https://i.pinimg.com/736x/98/7e/d9/987ed92fea3a5b637e957468353feff7.jpg?auto=format&fit=crop&w=800&q=80',
      category: 'Restaurant'
    },
    {
      id: 4,
      name: 'Pizza & Pasta',
      image: 'https://i.pinimg.com/736x/ec/13/39/ec1339af7087678f6ddf653be3edd880.jpg?auto=format&fit=crop&w=800&q=80',
      category: 'Italian'
    },
    {
      id: 5,
      name: 'Sushi Bar',
      image: 'https://i.pinimg.com/736x/d1/e6/16/d1e616c65ec9c406ebe5242d918473a6.jpg?auto=format&fit=crop&w=800&q=80',
      category: 'Japanese'
    },
    {
      id: 6,
      name: 'Pub Menu',
      image: 'https://i.pinimg.com/736x/17/4f/7c/174f7cfbd529717fef637dd3052342ba.jpg?auto=format&fit=crop&w=800&q=80',
      category: 'Bar'
    },
  ];

  useEffect(() => {
    if (user) {
      loadUserMenus();
    }
  }, [user]);

  const loadUserMenus = async () => {
    const userMenus = await menuService.getUserMenus(user.id);
    setMenus(userMenus);
  };

  const handleTemplateSelection = async (template: typeof templates[0]) => {
    if (!user) return;

    const menuData: MenuData = {
      name: template.name,
      category: template.category,
      template_id: template.id
    };

    const newMenu = await menuService.createMenu(user.id, 'template', menuData);
    if (newMenu) {
      setMenus(prev => [newMenu, ...prev]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF, Word documents, or images (JPEG/PNG)');
      return;
    }

    const url = URL.createObjectURL(file);
    
    const menuData: MenuData = {
      name: file.name,
      source: {
        type: file.type,
        url: url,
        originalName: file.name
      }
    };

    const newMenu = await menuService.createMenu(user.id, 'imported', menuData);
    if (newMenu) {
      setMenus(prev => [newMenu, ...prev]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Menu</h1>
          <p className="mt-1 text-sm text-gray-500">
            Choose a template or start from scratch to create your perfect menu
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['templates', 'scratch', 'import'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab === 'import' ? 'Import a Menu' : `${tab === 'scratch' ? 'Create from Scratch' : 'Templates'}`}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Import Menu Tab */}
        {activeTab === 'import' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show uploaded files first */}
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative pt-[100%]">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="mx-auto h-16 w-16 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">{file.name}</p>
                      </div>
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
                  <p className="text-sm text-gray-500">
                    {file.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Import Menu Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="relative pt-[100%]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Import Your Menu</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload a PDF, Word document, or image
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Select File
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Templates Grid */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative pt-[100%]">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button 
                      onClick={() => setPreviewImage({ url: template.image, name: template.name })} 
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={() => setPreviewImage(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
                <div className="relative pt-[75%]">
                  <img
                    src={previewImage.url}
                    alt={previewImage.name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900">{previewImage.name}</h3>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create from Scratch */}
        {activeTab === 'scratch' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <div className="text-center">
              <Plus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Create New Menu</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start with a blank canvas and build your menu from scratch
              </p>
              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Menus; 