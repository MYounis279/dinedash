import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Edit, Plus, X, Upload, FileText, QrCode } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useUser } from '../hooks/useUser';
import { menuService } from '../lib/menuService';
import { Menu, MenuData } from '../types/menu';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Menus = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('templates');
  const [previewImage, setPreviewImage] = useState<{url: string, name: string} | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    url: string;
    name: string;
    type: string;
    menu_id?: string;
  }>>([]);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const navigate = useNavigate();

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
    const userMenus = await menuService.getUserMenus(user!.id);
    setMenus(userMenus);
    
    // Reconstruct uploadedFiles from menus
    const files = userMenus
      .filter(menu => menu.menu_type === 'imported')
      .map(menu => ({
        url: menu.menu_data.source?.url || '',
        name: menu.menu_data.name,
        type: menu.menu_data.source?.type || '',
        menu_id: menu.menu_id
      }));
    setUploadedFiles(files);
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
    if (!file || !user) return;

    try {
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      console.log('Uploading file:', fileName);

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-files')
        .getPublicUrl(fileName);

      console.log('File uploaded, public URL:', publicUrl);

      const menuData: MenuData = {
        name: file.name,
        source: {
          type: file.type,
          url: publicUrl,
          originalName: file.name
        }
      };

      const newMenu = await menuService.createMenu(user.id, 'imported', menuData);
      if (newMenu) {
        setUploadedFiles(prev => [...prev, {
          url: publicUrl,
          name: file.name,
          type: file.type,
          menu_id: newMenu.menu_id
        }]);
        setMenus(prev => [newMenu, ...prev]);
      }
    } catch (error) {
      console.error('Error in file upload process:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const MenuCard = ({ file, menu }: { file: any; menu: Menu }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleGenerateQR = async () => {
      try {
        setIsGenerating(true);
        
        if (!menu?.menu_id) {
          throw new Error('Invalid menu ID');
        }

        const menuUrl = `${window.location.origin}/menu/${menu.menu_id}`;
        const qrCodeUrl = await menuService.generateQRCode(menu.menu_id, menuUrl);
        
        if (!qrCodeUrl) {
          throw new Error('QR code generation returned null');
        }

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard/qr-codes/');
        }, 1500);
      } catch (error) {
        console.error('Detailed error in handleGenerateQR:', error);
        alert(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
      >
        {showSuccess && (
          <div className="absolute inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-green-500 mb-2">✓</div>
              <p>QR Code Generated!</p>
            </div>
          </div>
        )}
        
        <div className="relative pt-[100%]">
          {file.type.startsWith('image/') ? (
            <img
              src={file.url}
              alt={file.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
              <FileText className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
            <button
              onClick={() => window.open(file.url, '_blank')}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleGenerateQR}
              disabled={isGenerating}
              className={`bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
            >
              <QrCode className="h-4 w-4" />
              <span>{isGenerating ? 'Generating...' : 'Generate QR'}</span>
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
          <p className="text-sm text-gray-500">{file.type.split('/')[1].toUpperCase()}</p>
        </div>
      </motion.div>
    );
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
                  className={`