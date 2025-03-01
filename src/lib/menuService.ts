import { supabase } from './supabase';
import { Menu, MenuType, MenuData } from '../types/menu';
import QRCode from 'qrcode';

export const menuService = {
  async createMenu(userId: string, menuType: MenuType, menuData: MenuData): Promise<Menu | null> {
    const { data, error } = await supabase
      .from('menus')
      .insert([
        {
          user_id: userId,
          menu_type: menuType,
          menu_data: menuData,
          qr_code_generated: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating menu:', error);
      return null;
    }

    return data;
  },

  async getUserMenus(userId: string): Promise<Menu[]> {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching menus:', error);
      return [];
    }

    return data || [];
  },

  async generateQRCode(menuId: string, menuUrl: string): Promise<string | null> {
    try {
      console.log('Starting QR code generation for menu:', menuId);
      
      const qrDataUrl = await QRCode.toDataURL(menuUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      // Convert data URL to blob
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();

      // Upload QR code image to storage
      const fileName = `qr-codes/${menuId}-${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu-files')
        .upload(fileName, blob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-files')
        .getPublicUrl(fileName);

      // Save to database
      const { error: qrError } = await supabase
        .from('qr_codes')
        .insert([{
          menu_id: menuId,
          qr_code_url: publicUrl,
          scan_count: 0
        }])
        .select()
        .single();

      if (qrError && qrError.code !== '23505') { // Ignore unique violation errors
        throw new Error(`Database update failed: ${qrError.message}`);
      }

      // Update menu status
      const { error: menuError } = await supabase
        .from('menus')
        .update({ qr_code_generated: true })
        .eq('menu_id', menuId);

      if (menuError) {
        throw new Error(`Menu update failed: ${menuError.message}`);
      }

      return publicUrl;
    } catch (error) {
      console.error('Error in generateQRCode:', error);
      throw error;
    }
  },

  async getQRCode(menuId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('qr_code_url')
      .eq('menu_id', menuId)
      .single();

    if (error || !data) return null;
    return data.qr_code_url;
  }
}; 