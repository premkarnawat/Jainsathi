'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Phone, CheckCircle2, ArrowRight, ArrowLeft, Mail, 
  Lock, Check, Info, Plus, Trash2, Edit2, Camera, FileText, Upload, 
  AlertCircle, Star, Sparkles, User, Users, Landmark, GraduationCap, 
  Briefcase, Heart, MapPin, Smile, Award
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { auth } from '@/lib/firebase/client';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

interface ProfileWizardProps {
  onComplete?: (profileData: any, selectedPlan: string) => void;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({ onComplete }) => {
  // Authentication states
  // Steps: 'welcome', 'otp', 'otp_verifying', 'otp_success', 'email', 'register_start', 1..10, 'photo_verification', 'review', 'plan'
  const [step, setStep] = useState<string | number>('welcome');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']); // Changed to 6 digits for Firebase
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpError, setOtpError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  // Email states (Optional)
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  // Profile management database states
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Cascading states/cities cache
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Fallback static location data if DB tables are empty
  const FALLBACK_STATES = [
    { id: 1, name: 'Maharashtra', code: 'MH' },
    { id: 2, name: 'Gujarat', code: 'GJ' },
    { id: 3, name: 'Rajasthan', code: 'RJ' },
    { id: 4, name: 'Delhi', code: 'DL' },
    { id: 5, name: 'Karnataka', code: 'KA' },
    { id: 6, name: 'Madhya Pradesh', code: 'MP' }
  ];

  const FALLBACK_CITIES: Record<number, string[]> = {
    1: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    2: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    3: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    4: ['New Delhi', 'Noida', 'Gurugram'],
    5: ['Bengaluru', 'Mysuru', 'Hubballi'],
    6: ['Indore', 'Bhopal', 'Gwalior']
  };

  // STEP 1 Form data: Profile For
  const [profileFor, setProfileFor] = useState('self');
  const [managedBy, setManagedBy] = useState('self');

  // STEP 2 Form data: Personal Details
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | string>('N/A');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [heightCm, setHeightCm] = useState(160);
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [maritalStatus, setMaritalStatus] = useState('never_married');
  const [motherTongue, setMotherTongue] = useState('Hindi');
  const [languagesKnown, setLanguagesKnown] = useState<string[]>([]);
  const [tempLang, setTempLang] = useState('');

  // STEP 3 Form data: Jain Identity
  const [sect, setSect] = useState('Shwetambar');
  const [community, setCommunity] = useState('Oswal');
  const [subCommunity, setSubCommunity] = useState('');
  const [selfSaka, setSelfSaka] = useState('');
  const [mamaSaka, setMamaSaka] = useState('');
  const [nativePlace, setNativePlace] = useState('');
  const [familyBackground, setFamilyBackground] = useState('');

  // STEP 4 Form data: Education
  const [educationRecords, setEducationRecords] = useState<any[]>([]);
  const [qualLevel, setQualLevel] = useState('Bachelors');
  const [degreeName, setDegreeName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [institution, setInstitution] = useState('');
  const [passoutYear, setPassoutYear] = useState(new Date().getFullYear());

  // STEP 5 Form data: Career
  const [workingStatus, setWorkingStatus] = useState('Employed');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [industry, setIndustry] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [annualIncome, setAnnualIncome] = useState(12);

  // STEP 6 Form data: Family
  const [fatherName, setFatherName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [familyType, setFamilyType] = useState('Joint');
  const [familyValues, setFamilyValues] = useState('Traditional');
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [famRelation, setFamRelation] = useState('Brother');
  const [famName, setFamName] = useState('');
  const [famOccupation, setFamOccupation] = useState('');
  const [famLocation, setFamLocation] = useState('');

  // STEP 7 Form data: Lifestyle
  const [diet, setDiet] = useState('strict_jain');
  const [smoking, setSmoking] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [tempHobby, setTempHobby] = useState('');
  const [tempInterest, setTempInterest] = useState('');

  // STEP 8 Form data: Location
  const [currentCountry, setCurrentCountry] = useState('India');
  const [currentState, setCurrentState] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [nativeState, setNativeState] = useState('');
  const [nativeCity, setNativeCity] = useState('');

  // STEP 9 Form data: Photo & Biodata Upload
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [biodataPdf, setBiodataPdf] = useState<any | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [photoPrivacy, setPhotoPrivacy] = useState('interested_members');

  // STEP 10 Form data: Partner Preferences
  const [prefMinAge, setPrefMinAge] = useState(21);
  const [prefMaxAge, setPrefMaxAge] = useState(30);
  const [prefMinHeight, setPrefMinHeight] = useState(150);
  const [prefMaxHeight, setPrefMaxHeight] = useState(190);
  const [prefSects, setPrefSects] = useState<string[]>([]);
  const [prefCommunities, setPrefCommunities] = useState<string[]>([]);
  const [prefDiet, setPrefDiet] = useState('strict_jain');
  const [prefMaritalStatus, setPrefMaritalStatus] = useState('never_married');

  // Photo Verification Step
  const [verificationPhoto, setVerificationPhoto] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'submitted' | 'approved' | 'rejected'>('none');

  // Plan Selection Step
  const [selectedPlan, setSelectedPlan] = useState('super_3m');

  // Session handler on mount to prevent the loop / recover steps
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          setUserId(session.user.id);
          
          let { data: dbUser } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
            
          if (dbUser) {
            const { data: profile } = await supabase
              .from('candidate_profiles')
              .select('*')
              .eq('user_id', dbUser.id)
              .single();
              
            if (profile) {
              setProfileId(profile.id);
              if (profile.completion_percentage >= 100) {
                window.location.href = '/dashboard';
              } else {
                setStep(1); // Continue registration
              }
            } else {
              setStep(1); // Start registration
            }
          } else {
            // Create user mapping
            const { data: newUser } = await supabase.from('users').insert({
              auth_id: session.user.id,
              phone: session.user.phone || '',
              full_name: 'Jain Member',
              role: 'user'
            }).select().single();
            if (newUser) setStep(1);
          }
        }
      } catch (err) {
        console.error("Error checking session:", err);
      }
    }
    checkSession();
  }, []);

  // Timer helper
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpTimer]);

  // Handle auto calculation of age
  useEffect(() => {
    if (!dob) {
      setAge('N/A');
      return;
    }
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const calculatedAge = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
    setAge(calculatedAge > 0 ? calculatedAge : 'N/A');
  }, [dob]);

  const handleCheckAndCreateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStep('welcome');
        return;
      }
      setUserId(user.id);

      // Get internal user record
      let { data: dbUser } = await supabase.from('users').select('*').eq('auth_id', user.id).single();
      if (!dbUser) {
        const { data: newUser, error: userError } = await supabase.from('users').insert({
          auth_id: user.id,
          phone: user.phone || '+91' + mobileNumber,
          full_name: firstName ? `${firstName} ${lastName}` : 'Jain Member',
          role: 'user'
        }).select().single();
        if (userError) throw userError;
        dbUser = newUser;
      }

      // Check if profile exists
      const { data: profile } = await supabase.from('candidate_profiles').select('*').eq('user_id', dbUser.id).single();
      if (profile) {
        setProfileId(profile.id);
        
        setFirstName(profile.first_name || '');
        setLastName(profile.last_name || '');
        setDob(profile.date_of_birth || '');
        setGender(profile.gender || 'female');
        setHeightCm(profile.height_cm || 160);
        setMaritalStatus(profile.marital_status || 'never_married');
        setProfileFor(profile.profile_created_for || 'self');
        setManagedBy(profile.managed_by || 'self');

        if (profile.completion_percentage >= 100) {
          window.location.href = '/dashboard';
          return;
        }

        if (!profile.first_name || profile.first_name === 'Jain') {
          setStep(2);
        } else {
          setStep(3);
        }
      } else {
        setStep(1);
      }
    } catch (err) {
      console.error(err);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch states
  useEffect(() => {
    async function loadStates() {
      try {
        setLoadingLocations(true);
        const { data, error } = await supabase.from('states').select('*').order('name');
        if (error) throw error;
        if (data && data.length > 0) {
          setStates(data);
          setCurrentState(data[0].name);
          setNativeState(data[0].name);
        } else {
          setStates(FALLBACK_STATES);
          setCurrentState(FALLBACK_STATES[0].name);
          setNativeState(FALLBACK_STATES[0].name);
        }
      } catch (err) {
        setStates(FALLBACK_STATES);
        setCurrentState(FALLBACK_STATES[0].name);
        setNativeState(FALLBACK_STATES[0].name);
      } finally {
        setLoadingLocations(false);
      }
    }
    loadStates();
  }, []);

  // Fetch cities when currentState changes
  useEffect(() => {
    async function loadCities() {
      if (!currentState) return;
      try {
        setLoadingLocations(true);
        const stateObj = states.find(s => s.name === currentState);
        if (!stateObj) return;

        const { data, error } = await supabase.from('cities').select('*').eq('state_id', stateObj.id).order('name');
        if (error) throw error;
        if (data && data.length > 0) {
          setCities(data);
          setCurrentCity(data[0].name);
        } else {
          const fallbackList = FALLBACK_CITIES[stateObj.id] || [];
          setCities(fallbackList.map((c, i) => ({ id: i, name: c })));
          if (fallbackList.length > 0) setCurrentCity(fallbackList[0]);
        }
      } catch (err) {
        const stateObj = states.find(s => s.name === currentState);
        if (stateObj) {
          const fallbackList = FALLBACK_CITIES[stateObj.id] || [];
          setCities(fallbackList.map((c, i) => ({ id: i, name: c })));
          if (fallbackList.length > 0) setCurrentCity(fallbackList[0]);
        }
      } finally {
        setLoadingLocations(false);
      }
    }
    loadCities();
  }, [currentState, states]);

  // Auth helper: Send Mobile OTP
  const handleSendMobileOtp = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setOtpError('Please enter a valid mobile number.');
      return;
    }
    try {
      setLoading(true);
      setOtpError('');
      
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }

      const formattedPhone = '+91' + mobileNumber;
      const confirmResult = await signInWithPhoneNumber(auth, formattedPhone, (window as any).recaptchaVerifier);
      setConfirmationResult(confirmResult);

      setOtpSent(true);
      setOtpTimer(30);
      setStep('otp');
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      setOtpError(err.message || 'Failed to send OTP. Please try again.');
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // Auth helper: Verify Mobile OTP with 5 seconds rotation matrix
  const handleVerifyMobileOtp = async () => {
    const code = otpDigits.join('');
    if (code.length < 6) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }
    try {
      setStep('otp_verifying');
      setOtpError('');

      if (!confirmationResult) {
        throw new Error('Session expired. Please request a new OTP.');
      }

      // Verify with Firebase
      await confirmationResult.confirm(code);

      // MOCK SUPABASE AUTHENTICATION
      // Since we don't have a real SMS provider attached to Supabase, we create a session using a mock email.
      const mockEmail = `${mobileNumber}@auth.jainsaathi.com`;
      const mockPassword = `JainSathiAuth$${mobileNumber}`;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: mockEmail,
        password: mockPassword,
      });

      if (authError && authError.message.includes('Invalid login credentials')) {
        // First time logging in with this number, sign them up
        const { error: signUpError } = await supabase.auth.signUp({
          email: mockEmail,
          password: mockPassword,
          options: {
            data: { phone: '+91' + mobileNumber }
          }
        });
        if (signUpError) throw signUpError;
      } else if (authError) {
        throw authError;
      }

      // Verify OTP Success - Let the rotation complete the 5 seconds interval
      setTimeout(() => {
        setStep('otp_success');
        // Auto-redirect success view to continue registration after 1.5 seconds
        setTimeout(() => {
          handleCheckAndCreateProfile();
        }, 1500);
      }, 5000);

    } catch (err: any) {
      setStep('otp');
      setOtpError(err.message || 'Incorrect OTP. Please check your code and try again.');
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        document.getElementById('otp-0')?.focus();
      }, 100);
    }
  };

  // Skip / Verify Email helper
  const handleVerifyEmail = async () => {
    if (!email) return;
    try {
      setLoading(true);
      setEmailVerified(true);
      setStep('register_start');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 1 Save: Profile For
  const saveStep1 = async () => {
    try {
      setLoading(true);
      setSaveError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let { data: dbUser } = await supabase.from('users').select('*').eq('auth_id', user.id).single();
      if (!dbUser) throw new Error('User record missing');

      const { data: newProfile, error: err } = await supabase.from('candidate_profiles').insert({
        user_id: dbUser.id,
        managed_by: managedBy,
        profile_created_for: profileFor,
        first_name: firstName || 'Jain',
        last_name: lastName || 'Member',
        gender: gender,
        date_of_birth: dob || new Date(2000, 0, 1).toISOString().split('T')[0],
        height_cm: heightCm,
        current_state: currentState || 'Maharashtra',
        current_city: currentCity || 'Mumbai',
        verification_status: 'pending',
        completion_percentage: 10
      }).select().single();

      if (err) throw err;
      setProfileId(newProfile.id);
      setStep(2);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Save: Personal Details
  const saveStep2 = async () => {
    if (!firstName || !lastName || !dob) {
      setSaveError('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      setSaveError(null);
      const { error } = await supabase.from('candidate_profiles').update({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        gender,
        date_of_birth: dob,
        height_cm: heightCm,
        marital_status: maritalStatus,
        birth_place: birthPlace,
        birth_time: birthTime || null,
        blood_group: bloodGroup,
        mother_tongue: motherTongue,
        languages_known: languagesKnown,
        completion_percentage: 30
      }).eq('id', profileId);

      if (error) throw error;
      setStep(3);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3 Save: Jain Identity
  const saveStep3 = async () => {
    try {
      setLoading(true);
      setSaveError(null);
      const { error } = await supabase.from('jain_identities').upsert({
        candidate_id: profileId,
        sect,
        community,
        sub_community: subCommunity,
        saka_gotra: selfSaka,
        self_saka: selfSaka,
        mamasa_saka: mamaSaka,
        native_place: nativePlace,
        family_background: familyBackground
      }, { onConflict: 'candidate_id' });

      if (error) throw error;
      await supabase.from('candidate_profiles').update({ completion_percentage: 40 }).eq('id', profileId);
      setStep(4);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 4 Save: Education Records
  const saveStep4 = async () => {
    try {
      setLoading(true);
      setSaveError(null);
      await supabase.from('candidate_profiles').update({ completion_percentage: 50 }).eq('id', profileId);
      setStep(5);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEducation = async () => {
    if (!degreeName) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('education_records').insert({
        candidate_id: profileId,
        qualification_level: qualLevel,
        degree_name: degreeName,
        specialization,
        institution,
        passout_year: passoutYear
      });
      if (error) throw error;
      setEducationRecords([...educationRecords, {
        qualification_level: qualLevel,
        degree_name: degreeName,
        specialization,
        institution,
        passout_year: passoutYear
      }]);
      setDegreeName('');
      setSpecialization('');
      setInstitution('');
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 5 Save: Career details
  const saveStep5 = async () => {
    try {
      setLoading(true);
      setSaveError(null);
      const { error } = await supabase.from('employment_records').insert({
        candidate_id: profileId,
        employment_type: workingStatus,
        company_name: companyName,
        designation,
        industry,
        work_city: workLocation,
        annual_income_lakhs: annualIncome
      });
      if (error) throw error;

      await supabase.from('candidate_profiles').update({ completion_percentage: 60 }).eq('id', profileId);
      setStep(6);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 6 Save: Family Details
  const saveStep6 = async () => {
    try {
      setLoading(true);
      setSaveError(null);
      await supabase.from('candidate_profiles').update({
        about_me: `${firstName}'s profile. Father: ${fatherName} (${fatherOccupation}), Mother: ${motherName} (${motherOccupation}).`
      }).eq('id', profileId);

      if (familyMembers.length > 0) {
        await supabase.from('family_members').insert(
          familyMembers.map(m => ({ candidate_id: profileId, ...m }))
        );
      }

      await supabase.from('candidate_profiles').update({ completion_percentage: 70 }).eq('id', profileId);
      setStep(7);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFamilyMember = () => {
    if (!famName) return;
    setFamilyMembers([...familyMembers, {
      relation_type: famRelation,
      name: famName,
      occupation: famOccupation,
      city: famLocation
    }]);
    setFamName('');
    setFamOccupation('');
    setFamLocation('');
  };

  // Step 7 Save: Lifestyle Options
  const saveStep7 = async () => {
    try {
      setLoading(true);
      setSaveError(null);
      const { error } = await supabase.from('lifestyle_profiles').upsert({
        candidate_id: profileId,
        diet,
        smoking,
        alcohol
      }, { onConflict: 'candidate_id' });

      if (error) throw error;

      await supabase.from('candidate_profiles').update({
        hobbies,
        languages_known: interests,
        completion_percentage: 80
      }).eq('id', profileId);

      setStep(8);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 8 Save: Location Details
  const saveStep8 = async () => {
    try {
      setLoading(true);
      setSaveError(null);
      const { error } = await supabase.from('candidate_profiles').update({
        current_country: currentCountry,
        current_state: currentState,
        current_city: currentCity,
        native_state: nativeState,
        native_city: nativeCity,
        completion_percentage: 90
      }).eq('id', profileId);

      if (error) throw error;
      setStep(9);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 9 Uploads & Save: Photos + Biodata
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profileId) return;
    try {
      setUploadingPhoto(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}-${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('profile-photos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(filePath);

      const { data: photoRecord, error: insertError } = await supabase.from('photos').insert({
        candidate_id: profileId,
        storage_path: filePath,
        url: publicUrl,
        is_primary: photos.length === 0,
        privacy: photoPrivacy
      }).select().single();

      if (insertError) throw insertError;
      setPhotos([...photos, photoRecord]);
    } catch (err: any) {
      alert(`Photo upload failed: ${err.message}`);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profileId) return;
    try {
      setUploadingPdf(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}-${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('biodata-pdfs').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('biodata-pdfs').getPublicUrl(filePath);

      const { data: biodataRecord, error: insertError } = await supabase.from('biodatas').insert({
        candidate_id: profileId,
        file_path: filePath,
        pdf_url: publicUrl,
        visibility: 'interest_accepted_only'
      }).select().single();

      if (insertError) throw insertError;
      setBiodataPdf(biodataRecord);
    } catch (err: any) {
      alert(`PDF upload failed: ${err.message}`);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSetPrimaryPhoto = async (photoId: string) => {
    try {
      await supabase.from('photos').update({ is_primary: false }).eq('candidate_id', profileId);
      await supabase.from('photos').update({ is_primary: true }).eq('id', photoId);
      setPhotos(photos.map(p => ({ ...p, is_primary: p.id === photoId })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePhoto = async (photo: any) => {
    try {
      await supabase.storage.from('profile-photos').remove([photo.storage_path]);
      await supabase.from('photos').delete().eq('id', photo.id);
      setPhotos(photos.filter(p => p.id !== photo.id));
    } catch (err) {
      console.error(err);
    }
  };

  const saveStep9 = async () => {
    if (photos.length === 0) {
      setSaveError('Please upload at least 1 photo.');
      return;
    }
    setStep(10);
  };

  // Step 10 Save: Partner Preferences
  const saveStep10 = async () => {
    try {
      setLoading(true);
      setSaveError(null);
      const { error } = await supabase.from('partner_preferences').upsert({
        candidate_id: profileId,
        min_age: prefMinAge,
        max_age: prefMaxAge,
        min_height_cm: prefMinHeight,
        max_height_cm: prefMaxHeight,
        preferred_sects: prefSects.length > 0 ? prefSects : [sect],
        preferred_communities: prefCommunities.length > 0 ? prefCommunities : [community],
      }, { onConflict: 'candidate_id' });

      if (error) throw error;
      await supabase.from('candidate_profiles').update({ completion_percentage: 100 }).eq('id', profileId);
      setStep('photo_verification');
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verification Screen Save
  const handleVerifySubmission = async () => {
    setLoading(true);
    setTimeout(() => {
      setVerificationStatus('approved');
      setLoading(false);
    }, 2000);
  };

  // Plan Selection Step
  const handlePlanSelection = async () => {
    try {
      setLoading(true);
      await supabase.from('subscriptions').insert({
        candidate_id: profileId,
        status: 'active',
        created_at: new Date().toISOString()
      });
      if (onComplete) {
        onComplete({ profileId, mobileNumber }, selectedPlan);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      window.location.href = '/dashboard';
    } finally {
      setLoading(false);
    }
  };

  // 4-digit input logic helpers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Paste 4-digit helper
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const chars = pastedData.split('');
      setOtpDigits(chars);
      document.getElementById('otp-3')?.focus();
    }
  };

  // Layout morphing helper variants for Framer Motion 2x2 grid rotation
  const rowVariants = {
    otp: {
      rotate: 0,
      scale: 1,
      opacity: 1
    },
    verifying: {
      rotate: 360,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 5,
        ease: 'linear'
      }
    },
    success: {
      scale: 0.65,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut'
      }
    }
  };

  const boxVariants = (index: number) => {
    const positions = [
      { x: -24, y: -16 }, // Top left
      { x: 0, y: -16 },   // Top middle
      { x: 24, y: -16 },  // Top right
      { x: -24, y: 16 },  // Bottom left
      { x: 0, y: 16 },    // Bottom middle
      { x: 24, y: 16 }    // Bottom right
    ];
    return {
      otp: {
        x: 0,
        y: 0,
        scale: 1
      },
      verifying: {
        x: positions[index].x,
        y: positions[index].y,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: 'easeInOut'
        }
      }
    };
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 md:p-8 relative"
      style={{ backgroundImage: "url('/wedding-bg.jpg')" }}
    >
      {/* Soft translucent luxury overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF9F3]/90 via-[#F8EFE8]/85 to-[#8F173D]/30 backdrop-blur-[3px]" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 select-none">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain rounded-xl shadow-md border border-[#EBD9DC]" />
          <h1 className="font-serif font-bold text-3xl text-[#8F0038] tracking-tight mt-3">JainSaathi</h1>
          <p className="text-xs font-bold tracking-widest text-[#D9A441] uppercase mt-1">Find Your Jain Saathi</p>
        </div>

        {/* Premium Glassmorphic Card Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-2xl rounded-[28px] overflow-hidden p-8 md:p-12">
          
          <AnimatePresence mode="wait">
            
            {/* 1. MOBILE LOGIN INPUT */}
            {step === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 max-w-md mx-auto"
              >
                <div className="text-center space-y-2">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#241A20]">Welcome to JainSaathi</h2>
                  <p className="text-sm font-semibold text-[#746A70]">Find meaningful connections within the Jain community.</p>
                </div>

                {otpError && (
                  <div className="p-3 bg-[#FFF1F1] text-[#8F0038] rounded-xl text-xs font-bold flex items-center gap-2 border border-[#8F0038]/20 animate-bounce">
                    <AlertCircle className="w-4 h-4" /> {otpError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#746A70] tracking-wider mb-1.5">Mobile Number</label>
                    <div className="flex rounded-xl border border-[#EBD9DC] overflow-hidden focus-within:border-[#8F173D] bg-white/50 backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 bg-[#F8EFE8] px-4 border-r border-[#EBD9DC] text-xs font-bold text-gray-700">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter mobile number"
                        className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSendMobileOtp}
                    disabled={mobileNumber.length < 10 || loading}
                    className="w-full bg-[#8F173D] hover:bg-[#6E1735] text-white py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                  <div id="recaptcha-container"></div>

                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-[#EBD9DC]"></div>
                    <span className="px-3 text-[10px] text-[#746A70] font-bold uppercase tracking-wider">OR</span>
                    <div className="flex-grow border-t border-[#EBD9DC]"></div>
                  </div>

                  <button 
                    onClick={() => setStep('email')}
                    className="w-full border border-[#EBD9DC] hover:bg-[#F8EFE8]/50 text-[#8F173D] py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" /> Continue with Email
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. OTP VERIFICATION & ROTATION MATRIX */}
            {(step === 'otp' || step === 'otp_verifying') && (
              <motion.div 
                key="otp-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 max-w-md mx-auto text-center"
              >
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl font-bold text-[#241A20]">Verify Your Mobile Number</h2>
                  <p className="text-sm text-[#746A70]">We've sent a 6-digit OTP code to <br /><span className="font-bold text-[#241A20]">+91 {mobileNumber}</span></p>
                </div>

                {otpError && (
                  <div className="p-3 bg-[#FFF1F1] text-[#8F0038] rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#8F0038]/20 animate-shake">
                    <AlertCircle className="w-4 h-4" /> {otpError}
                  </div>
                )}

                {/* Animated OTP Input Boxes Grid / 2x2 Matrix */}
                <div className="relative py-12 flex justify-center items-center h-44">
                  <motion.div
                    layout
                    variants={rowVariants}
                    animate={step === 'otp_verifying' ? 'verifying' : 'otp'}
                    className={
                      step === 'otp_verifying'
                        ? 'grid grid-cols-3 gap-3 w-[180px] h-[140px] justify-center items-center animate-spin-slow'
                        : 'flex flex-row gap-3 justify-center items-center'
                    }
                    style={{ animationDuration: step === 'otp_verifying' ? '5s' : '0s' }}
                  >
                    {otpDigits.map((digit, index) => (
                      <motion.div
                        layout
                        key={index}
                        variants={boxVariants(index)}
                        animate={step === 'otp_verifying' ? 'verifying' : 'otp'}
                        className="w-12 h-12 md:w-14 md:h-14 animate-spin-cancel"
                      >
                        <input
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          pattern="\d*"
                          inputMode="numeric"
                          value={digit}
                          disabled={step === 'otp_verifying'}
                          onPaste={handleOtpPaste}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-full h-full text-center bg-white/85 border border-[#8F173D]/18 rounded-[16px] font-bold text-xl md:text-2xl text-[#8F173D] focus:outline-none focus:border-[#8F173D] focus:ring-2 focus:ring-[#8F173D]/20 focus:shadow-[0_0_12px_rgba(217,164,65,0.3)] shadow-sm transition-all"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <div className="space-y-4">
                  {step === 'otp_verifying' ? (
                    <p className="text-sm font-semibold text-[#8F173D] animate-pulse">Verifying your number...</p>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-[#746A70]">
                        {otpTimer > 0 ? (
                          `Resend OTP in 00:${otpTimer < 10 ? '0' : ''}${otpTimer}`
                        ) : (
                          <button onClick={handleSendMobileOtp} className="text-[#8F173D] hover:underline">Resend OTP</button>
                        )}
                      </p>
                      
                      <button
                        onClick={handleVerifyMobileOtp}
                        className="w-full bg-[#8F173D] hover:bg-[#6E1735] text-white py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all"
                      >
                        Verify OTP
                      </button>

                      <button 
                        onClick={() => setStep('welcome')}
                        className="text-xs font-bold text-[#746A70] hover:text-[#8F173D] block mx-auto underline"
                      >
                        Change Number
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* 3. OTP SUCCESS */}
            {step === 'otp_success' && (
              <motion.div 
                key="otp_success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 max-w-md mx-auto text-center"
              >
                <div className="flex justify-center py-4">
                  <motion.div 
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-md shadow-emerald-500/10"
                  >
                    <Check className="w-10 h-10 stroke-[3]" />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-[#241A20]">OTP Verified Successfully!</h3>
                  <p className="text-sm font-semibold text-[#746A70]">
                    Your mobile number has been verified successfully.
                  </p>
                  <p className="text-xs font-bold text-[#D9A441] mt-1">Let's create your JainSaathi profile.</p>
                </div>

                <button
                  onClick={handleCheckAndCreateProfile}
                  className="w-full bg-[#8F173D] hover:bg-[#6E1735] text-white py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* 4. OPTIONAL EMAIL VERIFICATION */}
            {step === 'email' && (
              <motion.div 
                key="email"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-md mx-auto"
              >
                <div className="text-center space-y-2">
                  <h2 className="font-serif text-2xl font-bold text-[#241A20]">Add Your Email</h2>
                  <p className="text-xs text-[#746A70]">Add an email address to keep your account secure and receive important JainSaathi updates.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#746A70] tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-3 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F173D]"
                    />
                  </div>

                  <button
                    onClick={handleVerifyEmail}
                    disabled={!email || loading}
                    className="w-full bg-[#8F173D] hover:bg-[#6E1735] text-white py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all"
                  >
                    Verify Email
                  </button>

                  <button
                    onClick={() => setStep('register_start')}
                    className="w-full bg-transparent border border-[#EBD9DC] text-[#746A70] py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
                  >
                    Skip For Now
                  </button>
                  
                  <p className="text-center text-[10px] text-[#746A70]">You can add and verify your email later from Settings.</p>
                </div>
              </motion.div>
            )}

            {/* 5. MATRIMONIAL START INTRO */}
            {step === 'register_start' && (
              <motion.div 
                key="register_start"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 max-w-md mx-auto text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#8F173D]/10 text-[#8F173D] flex items-center justify-center mx-auto mb-4 text-2xl">
                  🪷
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-3xl font-bold text-[#241A20]">Welcome Candidate!</h2>
                  <p className="text-sm font-semibold text-[#746A70]">
                    Your account has been created. Let's build your premium digital Jain Matrimonial Biodata.
                  </p>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="w-full bg-[#8F173D] hover:bg-[#6E1735] text-white py-4 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Create My Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* PROFILE WIZARD STEPS 1-10 */}
            {typeof step === 'number' && (
              <motion.div 
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Stepper progress bar */}
                <div className="flex justify-between items-center max-w-xl mx-auto mb-6">
                  <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden mr-4">
                    <div className="bg-[#8F173D] h-full" style={{ width: `${(step / 10) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-[#8F173D] min-w-[70px] text-right">Step {step} of 10</span>
                </div>

                {saveError && (
                  <div className="p-3 bg-[#FFF1F1] text-[#8F0038] rounded-xl text-xs font-bold flex items-center gap-2 border border-[#8F0038]/20">
                    <AlertCircle className="w-4 h-4" /> {saveError}
                  </div>
                )}

                {/* STEP 1: WHO IS THIS PROFILE FOR */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Who is this profile for?</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Matrimonial matching options designed for Jain families.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { id: 'self', label: 'Myself', desc: 'Create profile for you', icon: <User className="w-6 h-6" /> },
                        { id: 'son', label: 'My Son', desc: 'Managed by parent', icon: <Users className="w-6 h-6" /> },
                        { id: 'daughter', label: 'My Daughter', desc: 'Managed by parent', icon: <Users className="w-6 h-6" /> },
                        { id: 'brother', label: 'My Brother', desc: 'Sibling managed', icon: <Users className="w-6 h-6" /> },
                        { id: 'sister', label: 'My Sister', desc: 'Sibling managed', icon: <Users className="w-6 h-6" /> },
                        { id: 'guardian', label: 'Relative / Guardian', desc: 'Family matchmaking', icon: <Users className="w-6 h-6" /> },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setProfileFor(item.id)}
                          className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
                            profileFor === item.id
                              ? 'border-[#8F173D] bg-[#F4DDE1]/40 text-[#8F173D] ring-2 ring-[#8F173D]/25 font-bold'
                              : 'border-[#EBD9DC] bg-white/40 text-gray-700 hover:border-[#D9A441]'
                          }`}
                        >
                          <div className={`p-2 rounded-xl w-fit ${profileFor === item.id ? 'bg-[#8F173D] text-white' : 'bg-[#F8EFE8] text-[#746A70]'}`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#241B20]">{item.label}</p>
                            <p className="text-[10px] text-[#746A70] mt-0.5">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-[#EBD9DC] pt-6">
                      <label className="block text-[10px] font-bold uppercase text-[#746A70] tracking-wider mb-2">Who will manage this profile?</label>
                      <div className="flex gap-4">
                        {['self', 'parent', 'guardian'].map(option => (
                          <label key={option} className={`flex-1 p-4 rounded-xl border flex items-center gap-3 cursor-pointer capitalize text-xs font-semibold ${managedBy === option ? 'border-[#8F173D] bg-[#F4DDE1]/20 text-[#8F173D]' : 'border-[#EBD9DC] hover:bg-gray-50'}`}>
                            <input type="radio" checked={managedBy === option} onChange={() => setManagedBy(option)} className="accent-[#8F173D]" />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={saveStep1} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: PERSONAL DETAILS */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Personal Details</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Complete details of the candidate.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">First Name *</label>
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="e.g. Rahul" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Middle Name</label>
                        <input type="text" value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="e.g. Kumar" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Last Name *</label>
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="e.g. Shah" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1.5">Gender</label>
                        <div className="flex gap-2">
                          <button onClick={() => setGender('female')} className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${gender === 'female' ? 'bg-[#8F173D] text-white border-[#8F173D]' : 'bg-white text-gray-700 border-[#EBD9DC]'}`}>
                            👰 Bride
                          </button>
                          <button onClick={() => setGender('male')} className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${gender === 'male' ? 'bg-[#8F173D] text-white border-[#8F173D]' : 'bg-white text-gray-700 border-[#EBD9DC]'}`}>
                            🤵 Groom
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Date of Birth *</label>
                        <input type="date" value={dob} onChange={e => setDob(e.target.value)} required className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Calculated Age</label>
                        <input type="text" value={age === 'N/A' ? 'N/A' : `${age} Years`} disabled className="w-full bg-gray-100 border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-bold text-gray-500 cursor-not-allowed" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Birth Time</label>
                        <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Birth Place</label>
                        <input type="text" value={birthPlace} onChange={e => setBirthPlace(e.target.value)} placeholder="e.g. Jodhpur, Rajasthan" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Height (cm)</label>
                        <input type="number" value={heightCm} onChange={e => setHeightCm(parseInt(e.target.value))} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Blood Group</label>
                        <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Marital Status</label>
                        <select value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                          <option value="never_married">Never Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                          <option value="separated">Separated</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Mother Tongue</label>
                        <input type="text" value={motherTongue} onChange={e => setMotherTongue(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1.5">Languages Known</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {languagesKnown.map(lang => (
                          <span key={lang} className="text-xs bg-[#F8EFE8] border border-[#EBD9DC] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold text-[#241B20]">
                            {lang}
                            <button onClick={() => setLanguagesKnown(languagesKnown.filter(l => l !== lang))} className="text-[#8F173D] font-bold">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 max-w-xs">
                        <input type="text" placeholder="Add Language" value={tempLang} onChange={e => setTempLang(e.target.value)} className="flex-1 bg-white border border-[#EBD9DC] rounded-xl px-3 py-2 text-xs font-semibold" />
                        <button onClick={() => {
                          if (tempLang && !languagesKnown.includes(tempLang)) {
                            setLanguagesKnown([...languagesKnown, tempLang]);
                            setTempLang('');
                          }
                        }} className="px-4 bg-[#8F173D] text-white rounded-xl text-xs font-bold"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                      <button onClick={saveStep2} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: JAIN IDENTITY */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Jain Identity</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Lineage & Gotra tracking for Jain community matrimonial matches.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Jain Sect *</label>
                        <select value={sect} onChange={e => setSect(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                          <option value="Shwetambar">Shwetambar</option>
                          <option value="Digambar">Digambar</option>
                          <option value="Sthanakvasi">Sthanakvasi</option>
                          <option value="Terapanthi">Terapanthi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Community *</label>
                        <select value={community} onChange={e => setCommunity(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                          <option value="Oswal">Oswal</option>
                          <option value="Porwal">Porwal</option>
                          <option value="Khandelwal">Khandelwal</option>
                          <option value="Agrawal Jain">Agrawal Jain</option>
                          <option value="Parwar">Parwar</option>
                          <option value="Humbad">Humbad</option>
                          <option value="Gujarati Jain">Gujarati Jain</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Sub-Community</label>
                        <input type="text" value={subCommunity} onChange={e => setSubCommunity(e.target.value)} placeholder="e.g. Dasa / Visa" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Self Saka / Gotra *</label>
                        <input type="text" value={selfSaka} onChange={e => setSelfSaka(e.target.value)} required placeholder="Father's Gotra" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Mama Saka / Gotra *</label>
                        <input type="text" value={mamaSaka} onChange={e => setMamaSaka(e.target.value)} required placeholder="Mother's Brother's Gotra" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Native Place (City / State)</label>
                      <input type="text" value={nativePlace} onChange={e => setNativePlace(e.target.value)} placeholder="e.g. Udaipur, Rajasthan" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Jain Family Background</label>
                      <textarea rows={3} value={familyBackground} onChange={e => setFamilyBackground(e.target.value)} placeholder="Describe religious values followed in your household..." className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                    </div>

                    <div className="flex justify-between gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                      <button onClick={saveStep3} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: EDUCATION */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Education & Qualifications</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Add academic milestones (Multiple allowed).</p>
                    </div>

                    {educationRecords.length > 0 && (
                      <div className="space-y-3">
                        <label className="block text-[10px] font-bold uppercase text-[#746A70]">Added Records</label>
                        {educationRecords.map((rec, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-[#F8EFE8]/50 border border-[#EBD9DC] rounded-xl">
                            <div>
                              <p className="text-xs font-bold text-[#241B20]">{rec.degree_name} ({rec.specialization})</p>
                              <p className="text-[10px] text-[#746A70] font-semibold">{rec.institution} • {rec.passout_year}</p>
                            </div>
                            <button onClick={() => setEducationRecords(educationRecords.filter((_, idx) => idx !== i))} className="p-1.5 hover:bg-white text-rose-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="p-5 border border-dashed border-[#EBD9DC] rounded-2xl bg-white/40 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Qualification Level</label>
                          <select value={qualLevel} onChange={e => setQualLevel(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                            {['Bachelors', 'Masters', 'Doctorate', 'Diploma', 'Other'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Degree Name</label>
                          <input type="text" value={degreeName} onChange={e => setDegreeName(e.target.value)} placeholder="e.g. B.Tech / MBA" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Specialization</label>
                          <input type="text" value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="e.g. Computer Science" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">College / University</label>
                          <input type="text" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="e.g. IIT Bombay" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Passout Year</label>
                          <input type="number" value={passoutYear} onChange={e => setPassoutYear(parseInt(e.target.value))} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                        </div>
                      </div>

                      <button onClick={handleAddEducation} className="py-2.5 px-4 bg-[#8F173D]/10 hover:bg-[#8F173D]/15 text-[#8F173D] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 w-full md:w-auto">
                        <Plus className="w-4 h-4" /> Add Qualification
                      </button>
                    </div>

                    <div className="flex justify-between gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={() => setStep(3)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                      <button onClick={saveStep4} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: CAREER */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Career & Professional Details</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Information about current workspace.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#746A70] tracking-wider mb-2">Working Status</label>
                      <div className="flex flex-wrap gap-2">
                        {['Employed', 'Business', 'Self Employed', 'Family Business', 'Student', 'Not Working'].map(status => (
                          <button key={status} onClick={() => setWorkingStatus(status)} className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${workingStatus === status ? 'bg-[#8F173D] text-white border-[#8F173D]' : 'bg-white text-gray-700 border-[#EBD9DC]'}`}>
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {['Employed', 'Business', 'Self Employed', 'Family Business'].includes(workingStatus) && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Company / Business Name</label>
                            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. MNC, Pvt Ltd" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Designation</label>
                            <input type="text" value={designation} onChange={e => setDesignation(e.target.value)} placeholder="e.g. Manager / Director" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Industry</label>
                            <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. IT, Finance" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Work Location (City)</label>
                            <input type="text" value={workLocation} onChange={e => setWorkLocation(e.target.value)} placeholder="e.g. Mumbai" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Annual Income (Lakhs INR)</label>
                            <input type="number" value={annualIncome} onChange={e => setAnnualIncome(parseInt(e.target.value))} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={() => setStep(4)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                      <button onClick={saveStep5} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: FAMILY DETAILS */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Family Details</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Information regarding family members.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Father's Full Name</label>
                        <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="Father's Name" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Father's Occupation</label>
                        <input type="text" value={fatherOccupation} onChange={e => setFatherOccupation(e.target.value)} placeholder="e.g. Businessman" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Mother's Full Name</label>
                        <input type="text" value={motherName} onChange={e => setMotherName(e.target.value)} placeholder="Mother's Name" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Mother's Occupation</label>
                        <input type="text" value={motherOccupation} onChange={e => setMotherOccupation(e.target.value)} placeholder="e.g. Homemaker" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Family Type</label>
                        <select value={familyType} onChange={e => setFamilyType(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                          <option value="Nuclear">Nuclear Family</option>
                          <option value="Joint">Joint Family</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Family Values</label>
                        <select value={familyValues} onChange={e => setFamilyValues(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                          <option value="Orthodox">Orthodox</option>
                          <option value="Traditional">Traditional</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Liberal">Liberal</option>
                        </select>
                      </div>
                    </div>

                    {familyMembers.length > 0 && (
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase text-[#746A70]">Other Family Members</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {familyMembers.map((m, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-[#F8EFE8]/50 border border-[#EBD9DC] rounded-xl">
                              <p className="text-xs font-bold text-[#241B20]">{m.relation_type}: <span className="text-[#8F173D]">{m.name}</span></p>
                              <button onClick={() => setFamilyMembers(familyMembers.filter((_, i) => i !== idx))} className="text-rose-600 text-xs font-bold">Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 border border-dashed border-[#EBD9DC] rounded-xl bg-white/40 space-y-3">
                      <p className="text-xs font-bold text-[#8F173D] mb-1">Add Family Members (Brother, Sister, Kakasa, Mamasa...)</p>
                      <div className="grid grid-cols-2 gap-3">
                        <select value={famRelation} onChange={e => setFamRelation(e.target.value)} className="bg-white border border-[#EBD9DC] rounded-lg p-2 text-xs font-semibold">
                          {['Brother', 'Sister', 'Kakasa', 'Kakisa', 'Mamasa', 'Nanasa', 'Dadasa'].map(rel => <option key={rel} value={rel}>{rel}</option>)}
                        </select>
                        <input type="text" placeholder="Name" value={famName} onChange={e => setFamName(e.target.value)} className="bg-white border border-[#EBD9DC] rounded-lg p-2 text-xs font-semibold" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Occupation" value={famOccupation} onChange={e => setFamOccupation(e.target.value)} className="bg-white border border-[#EBD9DC] rounded-lg p-2 text-xs font-semibold" />
                        <input type="text" placeholder="Location" value={famLocation} onChange={e => setFamLocation(e.target.value)} className="bg-white border border-[#EBD9DC] rounded-lg p-2 text-xs font-semibold" />
                      </div>
                      <button onClick={handleAddFamilyMember} className="py-2 px-4 bg-[#8F173D]/10 hover:bg-[#8F173D]/15 text-[#8F173D] rounded-xl text-xs font-bold flex items-center justify-center gap-1 w-full md:w-auto"><Plus className="w-3.5 h-3.5" /> Add Sibling/Relative</button>
                    </div>

                    <div className="flex justify-between gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={() => setStep(5)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                      <button onClick={saveStep6} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 7: LIFESTYLE */}
                {step === 7 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Lifestyle Details</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Dietary and habits profile.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#746A70] tracking-wider mb-2">Dietary Preference *</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'strict_jain', label: 'Strict Jain (No Root Veg)' },
                          { id: 'jain_vegetarian', label: 'Jain Vegetarian' },
                          { id: 'vegetarian', label: 'Vegetarian' },
                          { id: 'other', label: 'Other' }
                        ].map(d => (
                          <button key={d.id} onClick={() => setDiet(d.id)} className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${diet === d.id ? 'bg-[#8F173D] text-white border-[#8F173D]' : 'bg-white text-gray-700 border-[#EBD9DC]'}`}>
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#241B20] bg-white border border-[#EBD9DC] p-4 rounded-xl flex-1 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="checkbox" checked={smoking} onChange={e => setSmoking(e.target.checked)} className="accent-[#8F173D] scale-110" />
                        Smoking Habit (Yes)
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-[#241B20] bg-white border border-[#EBD9DC] p-4 rounded-xl flex-1 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="checkbox" checked={alcohol} onChange={e => setAlcohol(e.target.checked)} className="accent-[#8F173D] scale-110" />
                        Drinking Habit (Yes)
                      </label>
                    </div>

                    {/* Chips for hobbies */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1.5">Hobbies</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {hobbies.map(hob => (
                          <span key={hob} className="text-xs bg-[#F8EFE8] border border-[#EBD9DC] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold text-[#241B20]">
                            {hob}
                            <button onClick={() => setHobbies(hobbies.filter(h => h !== hob))} className="text-[#8F173D] font-bold">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 max-w-xs">
                        <input type="text" placeholder="Add Hobby" value={tempHobby} onChange={e => setTempHobby(e.target.value)} className="flex-1 bg-white border border-[#EBD9DC] rounded-xl px-3 py-2 text-xs font-semibold" />
                        <button onClick={() => {
                          if (tempHobby && !hobbies.includes(tempHobby)) {
                            setHobbies([...hobbies, tempHobby]);
                            setTempHobby('');
                          }
                        }} className="px-4 bg-[#8F173D] text-white rounded-xl text-xs font-bold"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>

                    {/* Chips for Interests */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1.5">Interests</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {interests.map(inte => (
                          <span key={inte} className="text-xs bg-[#F8EFE8] border border-[#EBD9DC] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold text-[#241B20]">
                            {inte}
                            <button onClick={() => setInterests(interests.filter(i => i !== inte))} className="text-[#8F173D] font-bold">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 max-w-xs">
                        <input type="text" placeholder="Add Interest" value={tempInterest} onChange={e => setTempInterest(e.target.value)} className="flex-1 bg-white border border-[#EBD9DC] rounded-xl px-3 py-2 text-xs font-semibold" />
                        <button onClick={() => {
                          if (tempInterest && !interests.includes(tempInterest)) {
                            setInterests([...interests, tempInterest]);
                            setTempInterest('');
                          }
                        }} className="px-4 bg-[#8F173D] text-white rounded-xl text-xs font-bold"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={() => setStep(6)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                      <button onClick={saveStep7} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 8: LOCATION */}
                {step === 8 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Location Details</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Current residency and native details.</p>
                    </div>

                    {loadingLocations && (
                      <div className="flex items-center gap-2 text-xs text-[#8F173D] font-bold py-2">
                        <span className="w-4 h-4 border-2 border-[#8F173D] border-t-transparent rounded-full animate-spin inline-block" />
                        Loading locations...
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">State *</label>
                        <select value={currentState} onChange={e => setCurrentState(e.target.value)} className="w-full bg-white border-[#EBD9DC] border rounded-xl px-4 py-2.5 text-xs font-semibold">
                          {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">City *</label>
                        <select value={currentCity} onChange={e => setCurrentCity(e.target.value)} className="w-full bg-white border-[#EBD9DC] border rounded-xl px-4 py-2.5 text-xs font-semibold">
                          {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Native State</label>
                        <select value={nativeState} onChange={e => setNativeState(e.target.value)} className="w-full bg-white border-[#EBD9DC] border rounded-xl px-4 py-2.5 text-xs font-semibold">
                          {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Native City</label>
                        <input type="text" value={nativeCity} onChange={e => setNativeCity(e.target.value)} placeholder="e.g. Udaipur" className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold" />
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={() => setStep(7)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                      <button onClick={saveStep8} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 9: PHOTO UPLOAD */}
                {step === 9 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Add Your Photos</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Upload up to 5 clear photos. Minimum 1 required.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {/* Slot 1: Primary Photo (large) */}
                      <div className="col-span-2 relative aspect-[3/4] border-2 border-dashed border-[#EBD9DC] rounded-2xl bg-white/40 flex items-center justify-center overflow-hidden">
                        {photos.find(p => p.is_primary) ? (
                          <div className="relative w-full h-full group">
                            <img src={photos.find(p => p.is_primary).url} alt="Primary" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button onClick={() => handleDeletePhoto(photos.find(p => p.is_primary))} className="p-2 bg-red-600 text-white rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <span className="absolute bottom-2 left-2 bg-[#D9A441] text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm"><Star className="w-3.5 h-3.5 fill-current" /> Primary</span>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center h-full w-full">
                            <Upload className="w-8 h-8 text-[#746A70] mb-2" />
                            <p className="text-xs font-bold text-[#241B20]">Add Primary Photo</p>
                            <p className="text-[10px] text-gray-400 mt-1">First photo is set as primary</p>
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                          </label>
                        )}
                      </div>

                      {/* Remaining 4 slots */}
                      {Array.from({ length: 4 }).map((_, idx) => {
                        const otherPhotos = photos.filter(p => !p.is_primary);
                        const photo = otherPhotos[idx];
                        return (
                          <div key={idx} className="relative aspect-[3/4] border-2 border-dashed border-[#EBD9DC] rounded-2xl bg-white/40 flex items-center justify-center overflow-hidden">
                            {photo ? (
                              <div className="relative w-full h-full group">
                                <img src={photo.url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button onClick={() => handleSetPrimaryPhoto(photo.id)} className="p-1.5 bg-white text-[#8F173D] rounded-lg text-xs"><Star className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeletePhoto(photo)} className="p-1.5 bg-red-600 text-white rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center cursor-pointer h-full w-full">
                                <Plus className="w-6 h-6 text-[#746A70]" />
                                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {uploadingPhoto && (
                      <div className="text-xs font-bold text-[#8F173D] flex items-center gap-2 justify-center">
                        <span className="w-4 h-4 border-2 border-[#8F173D] border-t-transparent rounded-full animate-spin" /> Uploading Photo...
                      </div>
                    )}

                    {/* BIODATA PDF SECTION */}
                    <div className="p-6 border border-[#EBD9DC] rounded-2xl bg-[#F8EFE8]/30">
                      <h4 className="font-serif text-lg font-bold text-[#241B20] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#D9A441]" /> Matrimonial Biodata (PDF)
                      </h4>
                      <p className="text-xs text-[#746A70] mt-1.5 mb-4">Attach your detailed printed biodata. Only mutually accepted connections can view this.</p>

                      {biodataPdf ? (
                        <div className="flex justify-between items-center p-4 bg-white border border-[#EBD9DC] rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#241B20]">Biodata_JainSaathi.pdf</p>
                              <p className="text-[10px] text-gray-400 font-semibold">Ready for verification</p>
                            </div>
                          </div>
                          <button onClick={async () => {
                            await supabase.storage.from('biodata-pdfs').remove([biodataPdf.file_path]);
                            await supabase.from('biodatas').delete().eq('id', biodataPdf.id);
                            setBiodataPdf(null);
                          }} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-[#EBD9DC] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/50 transition-colors">
                          <Upload className="w-8 h-8 text-[#746A70] mb-2" />
                          <span className="text-xs font-bold text-[#241B20]">Upload Matrimonial Biodata PDF</span>
                          <span className="text-[10px] text-gray-400 mt-1">Maximum file size: 5MB</span>
                          <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                        </label>
                      )}

                      {uploadingPdf && (
                        <div className="text-xs font-bold text-[#8F173D] flex items-center gap-2 justify-center mt-3">
                          <span className="w-4 h-4 border-2 border-[#8F173D] border-t-transparent rounded-full animate-spin" /> Uploading PDF...
                        </div>
                      )}
                    </div>

                    {/* Photo Privacy Box */}
                    <div className="p-5 border border-[#EBD9DC] bg-white rounded-2xl">
                      <label className="block text-[10px] font-bold uppercase text-[#746A70] tracking-wider mb-2">Photo Privacy Settings</label>
                      <select value={photoPrivacy} onChange={e => setPhotoPrivacy(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                        <option value="everyone">Visible to everyone</option>
                        <option value="interested_members">Visible to interested members</option>
                        <option value="mutually_accepted">Visible to mutually accepted connections</option>
                      </select>
                      <p className="text-[10px] text-gray-400 font-semibold mt-2 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#D9A441]" /> Your photos are protected according to your privacy settings.</p>
                    </div>

                    <div className="flex justify-between gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={() => setStep(8)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                      <button onClick={saveStep9} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 10: PARTNER PREFERENCES */}
                {step === 10 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-[#241A20]">Partner Preferences</h3>
                      <p className="text-xs font-semibold text-[#746A70]">Set preference matrices for matching.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Age Range</label>
                        <div className="flex gap-2 items-center">
                          <input type="number" value={prefMinAge} onChange={e => setPrefMinAge(parseInt(e.target.value))} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-3 py-2 text-xs font-semibold" />
                          <span>to</span>
                          <input type="number" value={prefMaxAge} onChange={e => setPrefMaxAge(parseInt(e.target.value))} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-3 py-2 text-xs font-semibold" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Height Range (cm)</label>
                        <div className="flex gap-2 items-center">
                          <input type="number" value={prefMinHeight} onChange={e => setPrefMinHeight(parseInt(e.target.value))} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-3 py-2 text-xs font-semibold" />
                          <span>to</span>
                          <input type="number" value={prefMaxHeight} onChange={e => setPrefMaxHeight(parseInt(e.target.value))} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-3 py-2 text-xs font-semibold" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Preferred Sects</label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Shwetambar', 'Digambar', 'Sthanakvasi', 'Terapanthi'].map(s => {
                            const selected = prefSects.includes(s);
                            return (
                              <button key={s} onClick={() => {
                                setPrefSects(selected ? prefSects.filter(x => x !== s) : [...prefSects, s]);
                              }} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${selected ? 'bg-[#8F173D] text-white border-[#8F173D]' : 'bg-white border-[#EBD9DC]'}`}>
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Preferred Communities</label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Oswal', 'Porwal', 'Khandelwal', 'Agrawal Jain', 'Humbad'].map(c => {
                            const selected = prefCommunities.includes(c);
                            return (
                              <button key={c} onClick={() => {
                                setPrefCommunities(selected ? prefCommunities.filter(x => x !== c) : [...prefCommunities, c]);
                              }} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${selected ? 'bg-[#8F173D] text-white border-[#8F173D]' : 'bg-white border-[#EBD9DC]'}`}>
                                {c}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Preferred Diet</label>
                        <select value={prefDiet} onChange={e => setPrefDiet(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                          <option value="strict_jain">Strict Jain</option>
                          <option value="jain_vegetarian">Jain Vegetarian</option>
                          <option value="vegetarian">Vegetarian</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#746A70] mb-1">Marital Status</label>
                        <select value={prefMaritalStatus} onChange={e => setPrefMaritalStatus(e.target.value)} className="w-full bg-white border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-xs font-semibold">
                          <option value="never_married">Never Married</option>
                          <option value="divorced">Divorced / Widowed</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 pt-6 border-t border-[#EBD9DC]">
                      <button onClick={() => setStep(9)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                      <button onClick={saveStep10} className="px-8 py-3 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* PHOTO VERIFICATION SCREEN */}
            {step === 'photo_verification' && (
              <motion.div 
                key="photo_verification"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 max-w-xl mx-auto"
              >
                <div className="text-center space-y-2">
                  <h2 className="font-serif text-2xl font-bold text-[#241A20]">Verify Your Profile</h2>
                  <p className="text-xs text-[#746A70]">Submit a clear photo so the JainSaathi team can verify your profile identity. This verification image remains 100% private and is only used to build trusted connections.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="border border-[#EBD9DC] rounded-2xl bg-white/40 aspect-square flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                    {verificationPhoto ? (
                      <div className="w-full h-full relative">
                        <img src={verificationPhoto} alt="Verification" className="w-full h-full object-cover rounded-xl" />
                        <button onClick={() => setVerificationPhoto(null)} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-12 h-12 text-[#D9A441] mb-3" />
                        <button onClick={() => setVerificationPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500')} className="px-6 py-2.5 bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs rounded-xl shadow-sm mb-3">Take Self Photo</button>
                        <label className="text-xs font-bold text-[#8F173D] hover:underline cursor-pointer">
                          Or Upload Photo
                          <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setVerificationPhoto(URL.createObjectURL(file));
                          }} className="hidden" />
                        </label>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold text-[#241B20]">Guidelines:</h4>
                    <ul className="space-y-2 text-xs text-[#746A70] font-semibold">
                      <li className="flex gap-2">
                        <span className="text-emerald-500">✓</span> Face should be clearly visible and centered
                      </li>
                      <li className="flex gap-2">
                        <span className="text-emerald-500">✓</span> Good lighting with no filters or sunglasses
                      </li>
                      <li className="flex gap-2">
                        <span className="text-emerald-500">✓</span> Must be a recent snapshot matching other photos
                      </li>
                    </ul>

                    {verificationStatus === 'submitted' && (
                      <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-800 font-bold flex gap-2 items-center">
                        <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        Under Review: Checking verification photo...
                      </div>
                    )}

                    {verificationStatus === 'approved' && (
                      <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex gap-2 items-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Verification Completed! Profile approved.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#EBD9DC]">
                  <button onClick={() => setStep(10)} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                  <button 
                    onClick={verificationStatus === 'approved' ? () => setStep('review') : handleVerifySubmission}
                    className="flex-1 bg-[#8F173D] hover:bg-[#6E1735] text-white py-3 rounded-xl text-xs font-bold shadow-md tracking-wider uppercase"
                  >
                    {verificationStatus === 'approved' ? 'Continue to Review' : 'Submit for Verification'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* PROFILE REVIEW SCREEN */}
            {step === 'review' && (
              <motion.div 
                key="review"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1.5">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#241A20]">Your JainSaathi Profile Is Ready</h2>
                  <p className="text-xs text-[#746A70]">100% profile completeness checks passed successfully.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Personal Details', stepNum: 2, value: `${firstName} ${lastName}` },
                    { title: 'Jain Identity', stepNum: 3, value: `${sect} - ${community}` },
                    { title: 'Education', stepNum: 4, value: `${educationRecords.length} milestones added` },
                    { title: 'Career Info', stepNum: 5, value: `${workingStatus} (${annualIncome} LPA)` },
                    { title: 'Family Tree', stepNum: 6, value: `${fatherName ? 'Father details added' : 'Standard family'}` },
                    { title: 'Lifestyle details', stepNum: 7, value: `${diet.replace('_', ' ')}` },
                    { title: 'Location residency', stepNum: 8, value: `${currentCity}, ${currentState}` },
                    { title: 'Photos & Biodata', stepNum: 9, value: `${photos.length} uploaded` },
                  ].map((sec) => (
                    <div key={sec.stepNum} className="flex justify-between items-center p-4 bg-[#F8EFE8]/30 border border-[#EBD9DC] rounded-xl shadow-sm">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-[#746A70]">{sec.title}</p>
                        <p className="text-xs font-bold text-[#241B20] mt-0.5">{sec.value}</p>
                      </div>
                      <button onClick={() => setStep(sec.stepNum)} className="p-1.5 hover:bg-white text-[#8F173D] rounded-lg">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#EBD9DC]">
                  <button onClick={() => setStep('photo_verification')} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                  <button onClick={() => setStep('plan')} className="flex-1 bg-[#8F173D] hover:bg-[#6E1735] text-white py-3.5 rounded-xl text-xs font-bold shadow-md tracking-wider uppercase">Submit Profile</button>
                </div>
              </motion.div>
            )}

            {/* PLAN SELECTION SCREEN */}
            {step === 'plan' && (
              <motion.div 
                key="plan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-1.5">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#241A20]">Choose Your Membership Plan</h2>
                  <p className="text-xs font-semibold text-[#746A70]">Upgrade to initiate direct connections with potential matches.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { id: 'free', name: 'Free', price: '₹0', duration: '365 Days', limit: '2 Biodatas download limit', color: 'border-gray-200' },
                    { id: 'pro_3m', name: 'Pro', price: '₹1,999', duration: '90 Days', limit: '10 Contact reveals', color: 'border-rose-200' },
                    { id: 'super_3m', name: 'Super', price: '₹3,499', duration: '90 Days', limit: '25 Contact reveals', highlight: 'Most Popular', color: 'border-[#D9A441] ring-2 ring-[#D9A441]/20' },
                    { id: 'deluxe_6m', name: 'Deluxe', price: '₹5,999', duration: '180 Days', limit: '60 Contact reveals', color: 'border-[#8F173D]' }
                  ].map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`relative p-5 rounded-2xl border bg-white/50 backdrop-blur-sm cursor-pointer transition-all flex flex-col justify-between h-64 ${
                        selectedPlan === p.id 
                          ? `${p.color} bg-white shadow-lg scale-105` 
                          : 'border-[#EBD9DC] hover:border-gray-400'
                      }`}
                    >
                      {p.highlight && (
                        <span className="absolute -top-2.5 right-4 bg-[#D9A441] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          {p.highlight}
                        </span>
                      )}
                      
                      <div>
                        <h4 className="font-serif font-bold text-lg text-gray-800">{p.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{p.duration}</p>
                      </div>

                      <div className="my-4">
                        <p className="font-serif font-bold text-3xl text-[#8F173D]">{p.price}</p>
                        <p className="text-[10px] text-[#746A70] font-semibold mt-1">{p.limit}</p>
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] text-[#746A70] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D9A441]" />
                        Secure Payment
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#EBD9DC]">
                  <button onClick={() => setStep('review')} className="px-6 py-2.5 border border-[#EBD9DC] hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl">Back</button>
                  <button 
                    onClick={handlePlanSelection}
                    className="flex-1 bg-[#8F173D] hover:bg-[#6E1735] text-white py-3.5 rounded-xl text-xs font-bold shadow-md tracking-wider uppercase"
                  >
                    {selectedPlan === 'free' ? 'Continue Free' : 'Pay & Activate Plan'}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
