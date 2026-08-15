'use client';

import React, { useState } from 'react';
import { Camera, X, Trash2, Star, Upload, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export const PhotoManagementModal = ({ isOpen, onClose, profileId, photos, onSaved }: { isOpen: boolean, onClose: () => void, profileId: string, photos: any[], onSaved: () => void }) => {
  const [uploading, setUploading] = useState(false);
  
  if (!isOpen) return null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;
      if (photos.length >= 5) {
        alert("Maximum 5 photos allowed. Please delete one first.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('photos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(filePath);

      await supabase.from('photos').insert({
        candidate_id: profileId,
        storage_path: filePath,
        url: publicUrl,
        is_primary: photos.length === 0 // Make primary if it's the first photo
      });

      onSaved();
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleMakePrimary = async (photoId: string) => {
    try {
      // Unset current primary
      await supabase.from('photos').update({ is_primary: false }).eq('candidate_id', profileId);
      // Set new primary
      await supabase.from('photos').update({ is_primary: true }).eq('id', photoId);
      onSaved();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (photoId: string, storagePath: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await supabase.storage.from('photos').remove([storagePath]);
      await supabase.from('photos').delete().eq('id', photoId);
      onSaved();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241B20]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFDFB] rounded-[24px] shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#EBD9DC] flex items-center justify-between bg-[#FDF9F4]">
          <h2 className="font-serif text-xl font-bold text-[#8F0038] flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#C99A3D]" /> Manage Photos
          </h2>
          <button onClick={onClose} className="p-1.5 text-[#75666D] hover:bg-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <p className="text-sm font-semibold text-[#75666D] mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#8F0038]" /> Add up to 5 clear photos. You currently have {photos.length}/5.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Existing Photos */}
            {photos.map((photo) => (
              <div key={photo.id} className={`relative group rounded-2xl overflow-hidden border-4 ${photo.is_primary ? 'border-[#C99A3D]' : 'border-transparent'}`}>
                <div className="aspect-[3/4] bg-gray-100">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                </div>
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                  {!photo.is_primary && (
                    <button onClick={() => handleMakePrimary(photo.id)} className="w-full py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg text-xs backdrop-blur-sm transition-colors">
                      Set as Primary
                    </button>
                  )}
                  <button onClick={() => handleDelete(photo.id, photo.storage_path)} className="w-full py-2 bg-red-500/80 hover:bg-red-600 text-white font-bold rounded-lg text-xs backdrop-blur-sm transition-colors flex items-center justify-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                {photo.is_primary && (
                  <div className="absolute top-2 left-2 bg-[#C99A3D] text-white p-1 rounded-full shadow-sm">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                )}
              </div>
            ))}

            {/* Upload Slot */}
            {photos.length < 5 && (
              <label className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-[#EBD9DC] bg-[#FDF9F4] hover:bg-[#F7E5EA]/30 transition-colors cursor-pointer flex flex-col items-center justify-center group">
                <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                {uploading ? (
                  <div className="w-8 h-8 border-4 border-[#8F0038] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-[#8F0038]" />
                    </div>
                    <span className="text-xs font-bold text-[#8F0038]">Add Photo</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
