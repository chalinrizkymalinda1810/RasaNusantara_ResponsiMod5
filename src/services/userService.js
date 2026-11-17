// ---------------------------------------------------------------------------
// userService.js — Identitas pengguna dan profil praktikan
// Persisten menggunakan localStorage
// ---------------------------------------------------------------------------

const USER_ID_KEY = 'rasa_nusantara_user_id'
const USER_PROFILE_KEY = 'rasa_nusantara_user_profile'

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const getUserIdentifier = () => {
  try {
    let id = localStorage.getItem(USER_ID_KEY)
    if (!id) {
      id = generateUUID()
      localStorage.setItem(USER_ID_KEY, id)
    }
    return id
  } catch {
    return generateUUID()
  }
}

export const DEFAULT_PROFILE = {
  name: 'Chalin Rizky Malinda',
  nim: '21120124120029',
  kelompok: '35',
  role: 'Praktikan / Pengembang PWA',
  program: 'Praktikum Pengembangan Perangkat Bergerak (PPB)',
  institution: 'Teknik Komputer - Fakultas Teknik Universitas Diponegoro',
  bio: 'Mahasiswa Teknik Komputer yang berfokus pada pengembangan aplikasi web modern, Progressive Web App (PWA), dan arsitektur Single Page Application yang andal dan responsif.',
  avatar: null,
  userId: getUserIdentifier(),
}

export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_PROFILE, ...parsed }
    }
  } catch {
    // fallback
  }
  return DEFAULT_PROFILE
}

export const saveUserProfile = (profile) => {
  try {
    const data = {
      ...profile,
      userId: getUserIdentifier(),
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data))
    return { success: true, data }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export const updateAvatar = (avatarBase64) => {
  const profile = getUserProfile()
  profile.avatar = avatarBase64
  return saveUserProfile(profile)
}

export const resetProfile = () => {
  try {
    localStorage.removeItem(USER_PROFILE_KEY)
    return DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export default {
  getUserIdentifier,
  getUserProfile,
  saveUserProfile,
  updateAvatar,
  resetProfile,
  DEFAULT_PROFILE,
}
