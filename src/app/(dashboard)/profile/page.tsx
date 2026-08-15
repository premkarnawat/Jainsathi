'use client';

import React, { useState } from 'react';
import { User, CheckCircle, MapPin, Camera } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useRouter } from 'next/navigation';
import { 
  PersonalDetails, 
  JainIdentity, 
  EducationSection, 
  CareerSection, 
  FamilySection, 
  LocationSection, 
  LifestyleSection, 
  ContactSection, 
  BiodataSection, 
  PrivacySection 
} from '@/components/profile/ProfileSections';
import { 
  AddEducationModal, 
  AddCareerModal, 
  AddFamilyModal 
} from '@/components/profile/ProfileEditModals';
import { PhotoManagementModal } from '@/components/profile/PhotoManagementModal';
import { supabase } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const { profile: loggedInUser, loading, error, refetch } = useCandidateProfile();
  
  // Modal states
  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);
  const [isAddCareerOpen, setIsAddCareerOpen] = useState(false);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-red-500 font-bold mb-2">Error Loading Profile</h2>
        <p className="text-sm text-gray-500 bg-red-50 p-4 rounded-lg">{error}</p>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-gray-500 font-bold mb-2">Profile Not Found</h2>
        <p className="text-sm text-gray-400">Please complete registration.</p>
      </div>
    );
  }

  const navigateToEdit = (tab: string) => {
    // In a real app we could pass query params to open a specific tab
    router.push('/profile/edit');
  };

  const handleRemoveEducation = async (id: string) => {
    if (!confirm('Are you sure you want to remove this education record?')) return;
    await supabase.from('education_records').delete().eq('id', id);
    refetch();
  };

  const handleRemoveCareer = async (id: string) => {
    if (!confirm('Are you sure you want to remove this career record?')) return;
    await supabase.from('employment_records').delete().eq('id', id);
    refetch();
  };

  const handleRemoveFamily = async (id: string) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;
    await supabase.from('family_members').delete().eq('id', id);
    refetch();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Premium Header Profile Card */}
      <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[32px] overflow-hidden shadow-sm relative mb-8">
        <div className="h-48 bg-gradient-to-r from-[#F7E5EA] via-[#FFF8F7] to-[#FDF9F4] relative">
          <div className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
            <p className="text-[10px] font-bold text-[#8F0038] uppercase tracking-wider">Profile ID: {loggedInUser.id.substring(0,8).toUpperCase()}</p>
          </div>
        </div>
        
        <div className="px-6 md:px-10 pb-10 relative">
          <div className="absolute -top-24 left-6 md:left-10">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[32px] border-4 border-[#FFFDFB] bg-[#F7E5EA] shadow-xl overflow-hidden relative group">
              {loggedInUser.photos?.[0]?.url ? (
                <img src={loggedInUser.photos[0].url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 md:w-20 md:h-20 text-[#75666D] opacity-40" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => setIsPhotoManagerOpen(true)} className="flex flex-col items-center text-white w-full h-full justify-center">
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold">Manage Photos</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-24 md:pt-28 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="font-serif font-bold text-3xl md:text-4xl text-[#241B20] flex items-center gap-2">
                {loggedInUser.first_name} {loggedInUser.last_name}
                {loggedInUser.isVerified && (
                  <CheckCircle className="w-7 h-7 text-[#C99A3D] fill-current shrink-0" />
                )}
              </h1>
              <p className="text-sm md:text-base font-semibold text-[#75666D] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#8F0038]" />
                {loggedInUser.current_city || 'City not set'}, {loggedInUser.current_state || 'State not set'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {loggedInUser.date_of_birth && (
                  <span className="text-xs font-bold text-[#8F0038] bg-[#F7E5EA]/60 px-3 py-1.5 rounded-lg border border-[#EBD9DC]/50">
                    {Math.abs(new Date(Date.now() - new Date(loggedInUser.date_of_birth).getTime()).getUTCFullYear() - 1970)} Years
                  </span>
                )}
                {loggedInUser.membershipTier && (
                  <span className="text-xs font-bold text-[#C99A3D] bg-[#FDF9F4] px-3 py-1.5 rounded-lg border border-[#C99A3D]/20 uppercase tracking-wide">
                    {loggedInUser.membershipTier}
                  </span>
                )}
                {loggedInUser.jainIdentity?.sect && (
                  <span className="text-xs font-bold text-[#75666D] bg-[#FFFDFB] px-3 py-1.5 rounded-lg border border-[#EBD9DC] uppercase tracking-wide">
                    {loggedInUser.jainIdentity.sect}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="bg-[#FDF9F4] p-4 rounded-2xl border border-[#EBD9DC] shadow-sm">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-[#75666D] uppercase tracking-wider">Completion</span>
                  <span className="text-xl font-bold text-[#8F0038]">{loggedInUser.completionPercentage}%</span>
                </div>
                <div className="w-full bg-[#EBD9DC] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#8F0038] h-1.5 rounded-full" style={{ width: `${loggedInUser.completionPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Core Info */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalDetails profile={loggedInUser} onEdit={() => navigateToEdit('basic')} />
          <JainIdentity identity={loggedInUser.jainIdentity} onEdit={() => navigateToEdit('jain')} />
          <EducationSection 
            educationRecords={loggedInUser.education || []} 
            onAdd={() => setIsAddEducationOpen(true)}
            onEdit={() => navigateToEdit('education')}
            onRemove={handleRemoveEducation}
          />
          <CareerSection 
            employmentRecords={loggedInUser.employment || []} 
            onAdd={() => setIsAddCareerOpen(true)}
            onEdit={() => navigateToEdit('education')}
            onRemove={handleRemoveCareer}
          />
          <FamilySection 
            familyMembers={loggedInUser.family || []} 
            onAdd={() => setIsAddFamilyOpen(true)}
            onEdit={() => navigateToEdit('family')}
            onRemove={handleRemoveFamily}
          />
          <LifestyleSection lifestyle={loggedInUser.lifestyle} onEdit={() => navigateToEdit('lifestyle')} />
        </div>

        {/* Right Column - Privacy & Metadata */}
        <div className="space-y-6">
          <BiodataSection 
            biodata={loggedInUser.biodata} 
            onUpload={() => alert('PDF Upload Modal placeholder')} 
            onGenerate={() => alert('Generate Biodata placeholder')} 
          />
          <ContactSection 
            email={loggedInUser.email} 
            phone={loggedInUser.phone} 
            onEdit={() => navigateToEdit('basic')} 
          />
          <LocationSection profile={loggedInUser} onEdit={() => navigateToEdit('location')} />
          <PrivacySection privacy={loggedInUser.privacy} onEdit={() => navigateToEdit('basic')} />
        </div>

      </div>

      {/* Modals */}
      <AddEducationModal isOpen={isAddEducationOpen} onClose={() => setIsAddEducationOpen(false)} profileId={loggedInUser.id} onSaved={refetch} />
      <AddCareerModal isOpen={isAddCareerOpen} onClose={() => setIsAddCareerOpen(false)} profileId={loggedInUser.id} onSaved={refetch} />
      <AddFamilyModal isOpen={isAddFamilyOpen} onClose={() => setIsAddFamilyOpen(false)} profileId={loggedInUser.id} onSaved={refetch} />
      <PhotoManagementModal isOpen={isPhotoManagerOpen} onClose={() => setIsPhotoManagerOpen(false)} profileId={loggedInUser.id} photos={loggedInUser.photos || []} onSaved={refetch} />
      
    </div>
  );
}
