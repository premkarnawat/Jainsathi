// ========================================================
// JAINSAATHI SHARED DOMAIN TYPES & INTERFACES
// ========================================================

export type ManagedBy = 'self' | 'parent' | 'guardian' | 'sibling' | 'relative';
export type Gender = 'male' | 'female';
export type MaritalStatus = 'never_married' | 'divorced' | 'widowed' | 'separated';
export type DietPreference = 'strict_jain' | 'jain_vegetarian' | 'vegetarian' | 'other';
export type IncomeVisibility = 'visible' | 'verified_only' | 'matches_only' | 'hidden';
export type PrivacyLevel = 'public' | 'verified_users' | 'matches_only' | 'interest_accepted_only' | 'private';
export type VerificationStatus = 'not_verified' | 'pending' | 'verified' | 'rejected';
export type InterestStatus = 'pending' | 'accepted' | 'declined';
export type PlanCode = 'free' | 'pro_3m' | 'super_3m' | 'deluxe_6m';

export interface UserAccount {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface JainIdentity {
  id?: string;
  candidateId?: string;
  sect: string; // Shwetambar, Digambar, Sthanakvasi, Terapanthi
  community: string; // Oswal, Porwal, Khandelwal, Parwar, etc.
  subCommunity?: string; // Visa Oswal, Dasa Oswal, etc.
  sakaGotra?: string;
  selfSaka?: string;
  mamasaSaka?: string;
  dadisaSaka?: string;
  nanisaSaka?: string;
  familyKulGotra?: string;
  lineageNotes?: string;
}

export interface LifestyleProfile {
  diet: DietPreference;
  foodNotes?: string;
  smoking: boolean;
  alcohol: boolean;
  tobacco: boolean;
  fitnessRoutine?: string;
  manglikStatus?: string;
  rashi?: string;
  nakshatra?: string;
}

export interface EducationRecord {
  id?: string;
  qualificationLevel: string; // Bachelors, Masters, Doctorate
  degreeName: string; // B.Tech, MBA, CA, MD
  specialization?: string;
  institution?: string;
  university?: string;
  passoutYear?: number;
  isHighest?: boolean;
}

export interface EmploymentRecord {
  id?: string;
  employmentType: string; // Corporate, Business, Self-Employed, Family Business
  companyName?: string;
  designation?: string;
  industry?: string;
  workCity?: string;
  workState?: string;
  workCountry?: string;
  annualIncomeLakhs?: number;
  incomeVisibility?: IncomeVisibility;
}

export interface FamilyMember {
  id?: string;
  relationType: string; // Father, Mother, Brother, Sister, Kakasa, Mamasa, Jiju
  name: string;
  occupation?: string;
  businessDetails?: string;
  city?: string;
  state?: string;
  maritalStatus?: string;
  notes?: string;
}

export interface PartnerPreference {
  minAge: number;
  maxAge: number;
  minHeightCm: number;
  maxHeightCm: number;
  allowedMaritalStatuses: MaritalStatus[];
  preferredStates: string[];
  preferredCities: string[];
  preferredSects: string[];
  preferredCommunities: string[];
  preferredEducations: string[];
  minIncomeLakhs?: number;
  preferredDiet: DietPreference;
  dietIsMandatory: boolean;
  sectIsMandatory: boolean;
  aboutPreferredPartner?: string;
}

export interface ProfilePrivacy {
  photoPrivacy: PrivacyLevel;
  biodataPrivacy: PrivacyLevel;
  contactPrivacy: PrivacyLevel;
  incomePrivacy: IncomeVisibility;
  familyPrivacy: PrivacyLevel;
  discoverability: PrivacyLevel;
}

export interface CandidatePhoto {
  id: string;
  storagePath: string;
  url: string;
  isPrimary: boolean;
  isApproved: boolean;
  privacy: PrivacyLevel;
}

export interface BiodataRecord {
  id: string;
  filePath?: string;
  pdfUrl?: string;
  generatedData?: Record<string, any>;
  visibility: PrivacyLevel;
  updatedAt: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  managedBy: ManagedBy;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string; // YYYY-MM-DD
  age: number;
  heightCm: number;
  weightKg?: number;
  maritalStatus: MaritalStatus;
  birthPlace?: string;
  birthTime?: string;
  currentCountry: string;
  currentState: string;
  currentCity: string;
  nativeState?: string;
  nativeCity?: string;
  languagesKnown: string[];
  aboutMe?: string;
  hobbies: string[];
  completionPercentage: number;
  isActive: boolean;
  isDiscoverable: boolean;
  verificationStatus: VerificationStatus;
  
  jainIdentity?: JainIdentity;
  lifestyle?: LifestyleProfile;
  education?: EducationRecord[];
  employment?: EmploymentRecord[];
  family?: FamilyMember[];
  preferences?: PartnerPreference;
  privacy?: ProfilePrivacy;
  photos?: CandidatePhoto[];
  biodata?: BiodataRecord;
  
  isFeatured?: boolean;
  compatibilityScore?: number;
  compatibilityReasons?: string[];
  createdAt: string;
}

export interface CompatibilityExplanation {
  scorePercentage: number;
  reasons: {
    title: string;
    matched: boolean;
    description: string;
  }[];
}

export interface InterestRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: InterestStatus;
  message?: string;
  createdAt: string;
  senderProfile?: CandidateProfile;
  receiverProfile?: CandidateProfile;
}

export interface ConnectionRecord {
  id: string;
  candidateA: string;
  candidateB: string;
  createdAt: string;
  partnerProfile?: CandidateProfile;
}

export interface SubscriptionPlan {
  id: number;
  code: PlanCode;
  name: string;
  priceInr: number;
  durationDays: number;
  contactRevealLimit: number;
  biodataDownloadLimit: number;
  isFeaturedAllowed: boolean;
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: number;
  plan?: SubscriptionPlan;
  status: 'active' | 'expired' | 'cancelled';
  contactRevealsRemaining: number;
  biodataDownloadsRemaining: number;
  startsAt: string;
  expiresAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}
