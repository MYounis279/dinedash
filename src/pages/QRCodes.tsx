import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, Download } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useUser } from '../hooks/useUser';
import { menuService } from '../lib/menuService';

const QRCodes = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [qrCodes, setQrCodes] = useState<Array<{
    menu_id: string;
    qr_code_url: string;
    menu_name: string;
    scan_count: number;
  }>>([]);

  useEffect(() => {
    if (user) loadQRCodes();
  }, [user]);

  const loadQRCodes = async () => {
    setLoading(true);
    try {
      const { data: qrData, error: qrError } = await supabase
        .from('qr_codes')
        .select(`
          menu_id,
          qr_code_url,
          scan_count,
          menus (
            menu_data
          )
        `)
        .order('created_at', { ascending: false });

      if (qrError) throw qrError;

      if (qrData) {
        setQrCodes(qrData.map(qr => ({
          menu_id: qr.menu_id,
          qr_code_url: qr.qr_code_url,
          menu_name: qr.menus?.menu_data?.name || 'Untitled Menu',
          scan_count: qr.scan_count || 0
        })));
      }
    } catch (error) {
      console.error('Error loading QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyQRCode = async (qrCodeUrl: string) => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('QR Code copied to clipboard!');
    } catch (error) {
      console.error('Error copying QR code:', error);
      alert('Failed to copy QR code');
    }
  };

  const shareQRCode = async (menuId: string, menuName: string) => {
    const shareUrl = `${window.location.origin}/menu/${menuId}`;
    try {
      await navigator.share({
        title: `Menu QR Code - ${menuName}`,
        url: shareUrl
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-gray-500">Loading QR codes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">QR Codes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <motion.div
              key={qr.menu_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <img
                  src={qr.qr_code_url}
                  alt={`QR Code for ${qr.menu_name}`}
                  className="w-full h-auto"
                />
                <h3 className="mt-4 text-lg font-medium text-gray-900">{qr.menu_name}</h3>
                <p className="text-sm text-gray-500">{qr.scan_count} scans</p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => copyQRCode(qr.qr_code_url)}
                    className="flex-1 flex items-center justify-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => shareQRCode(qr.menu_id, qr.menu_name)}
                    className="flex-1 flex items-center justify-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCodes; 