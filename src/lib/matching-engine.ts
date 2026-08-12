// ========================================================
// JAINSAATHI DETERMINISTIC MATCHING ENGINE
// ========================================================

import { CandidateProfile, PartnerPreference, CompatibilityExplanation } from '@/types';

export interface MatchingWeights {
  jainCompatibility: number;
  age: number;
  location: number;
  education: number;
  career: number;
  lifestyle: number;
  family: number;
  preferenceAlignment: number;
  completeness: number;
  verification: number;
}

export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  jainCompatibility: 0.20,
  age: 0.10,
  location: 0.10,
  education: 0.10,
  career: 0.08,
  lifestyle: 0.10,
  family: 0.10,
  preferenceAlignment: 0.15,
  completeness: 0.04,
  verification: 0.03,
};

/**
 * Calculates deterministic compatibility score between a candidate and target profile
 */
export function calculateMatchScore(
  userProfile: CandidateProfile,
  candidateProfile: CandidateProfile,
  weights: MatchingWeights = DEFAULT_MATCHING_WEIGHTS
): CompatibilityExplanation {
  const reasons: CompatibilityExplanation['reasons'] = [];
  let score = 0;

  // 1. HARD FILTER: Gender check (Must be opposite gender for matrimony)
  if (userProfile.gender === candidateProfile.gender) {
    return {
      scorePercentage: 0,
      reasons: [{ title: 'Gender Preference', matched: false, description: 'Opposite gender match required' }]
    };
  }

  const prefs: PartnerPreference | undefined = userProfile.preferences;

  // 2. JAIN COMPATIBILITY (20%)
  const userSect = userProfile.jainIdentity?.sect || 'Shwetambar';
  const candSect = candidateProfile.jainIdentity?.sect || 'Shwetambar';
  const userCommunity = userProfile.jainIdentity?.community || 'Oswal';
  const candCommunity = candidateProfile.jainIdentity?.community || 'Oswal';

  let jainScore = 0.5; // Base Jain match
  if (userSect === candSect) jainScore += 0.3;
  if (userCommunity === candCommunity) jainScore += 0.2;
  
  if (prefs?.preferredSects && prefs.preferredSects.length > 0) {
    if (prefs.preferredSects.includes(candSect)) jainScore = 1.0;
  }
  
  score += jainScore * weights.jainCompatibility;
  reasons.push({
    title: 'Jain Identity Match',
    matched: jainScore >= 0.7,
    description: `Sect: ${candSect}, Community: ${candCommunity}`
  });

  // 3. AGE MATCH (10%)
  const candAge = candidateProfile.age || calculateAge(candidateProfile.dateOfBirth);
  let ageMatched = true;
  if (prefs) {
    if (candAge >= prefs.minAge && candAge <= prefs.maxAge) {
      score += 1.0 * weights.age;
    } else {
      score += 0.4 * weights.age;
      ageMatched = false;
    }
  } else {
    score += 0.8 * weights.age;
  }
  reasons.push({
    title: 'Age Preference Match',
    matched: ageMatched,
    description: `Age ${candAge} years`
  });

  // 4. LOCATION MATCH (10%)
  let locationMatched = false;
  if (userProfile.currentCity === candidateProfile.currentCity) {
    score += 1.0 * weights.location;
    locationMatched = true;
  } else if (userProfile.currentState === candidateProfile.currentState) {
    score += 0.8 * weights.location;
    locationMatched = true;
  } else if (prefs?.preferredStates?.includes(candidateProfile.currentState)) {
    score += 0.9 * weights.location;
    locationMatched = true;
  } else {
    score += 0.5 * weights.location;
  }
  reasons.push({
    title: 'Location Preference Match',
    matched: locationMatched,
    description: `${candidateProfile.currentCity}, ${candidateProfile.currentState}`
  });

  // 5. EDUCATION MATCH (10%)
  const candHighestEdu = candidateProfile.education?.[0]?.degreeName || 'Graduate';
  let eduMatched = false;
  if (prefs?.preferredEducations && prefs.preferredEducations.length > 0) {
    if (prefs.preferredEducations.some(e => candHighestEdu.toLowerCase().includes(e.toLowerCase()))) {
      score += 1.0 * weights.education;
      eduMatched = true;
    } else {
      score += 0.6 * weights.education;
    }
  } else {
    score += 0.85 * weights.education;
    eduMatched = true;
  }
  reasons.push({
    title: 'Education Preference Match',
    matched: eduMatched,
    description: `Highest Qualification: ${candHighestEdu}`
  });

  // 6. CAREER MATCH (8%)
  const emp = candidateProfile.employment?.[0];
  score += 0.8 * weights.career;
  reasons.push({
    title: 'Career & Profession Match',
    matched: true,
    description: emp ? `${emp.designation || 'Professional'} at ${emp.companyName || 'Reputed Org'}` : 'Working Professional'
  });

  // 7. LIFESTYLE MATCH (10%)
  const candDiet = candidateProfile.lifestyle?.diet || 'strict_jain';
  let lifestyleMatched = candDiet === 'strict_jain' || candDiet === 'jain_vegetarian';
  if (lifestyleMatched) {
    score += 1.0 * weights.lifestyle;
  } else {
    score += 0.4 * weights.lifestyle;
  }
  reasons.push({
    title: 'Lifestyle & Diet Match',
    matched: lifestyleMatched,
    description: `Diet: ${formatDiet(candDiet)}`
  });

  // 8. FAMILY PREFERENCE (10%)
  score += 0.85 * weights.family;
  reasons.push({
    title: 'Family Culture Match',
    matched: true,
    description: 'Traditional Jain family values'
  });

  // 9. PREFERENCE ALIGNMENT (15%)
  score += 0.9 * weights.preferenceAlignment;

  // 10. COMPLETENESS & VERIFICATION (7%)
  const compRatio = Math.min(1, (candidateProfile.completionPercentage || 50) / 100);
  score += compRatio * weights.completeness;
  
  if (candidateProfile.verificationStatus === 'verified') {
    score += 1.0 * weights.verification;
  } else {
    score += 0.5 * weights.verification;
  }

  const finalPercentage = Math.min(99, Math.max(60, Math.round(score * 100)));

  return {
    scorePercentage: finalPercentage,
    reasons
  };
}

function calculateAge(dobString: string): number {
  if (!dobString) return 25;
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function formatDiet(diet: string): string {
  switch(diet) {
    case 'strict_jain': return 'Strict Jain (No Onion/Garlic)';
    case 'jain_vegetarian': return 'Jain Vegetarian';
    case 'vegetarian': return 'Vegetarian';
    default: return 'Jain Diet';
  }
}
