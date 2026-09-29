const STORAGE_KEYS = {
  adminProfile: 'sikhai_admin_profile',
  favorites: 'sikhai_favorites',
  token: 'sikhai_token',
};

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

const windows1252Decoder = new TextDecoder('windows-1252');
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
const windows1252Bytes = new Map();
for (let byte = 0; byte < 256; byte += 1) {
  windows1252Bytes.set(windows1252Decoder.decode(Uint8Array.of(byte)), byte);
}

function repairMojibake(value) {
  if (typeof value === 'string') {
    if (!/[àÃâð]/.test(value)) return value;
    const bytes = [];
    for (const character of value) {
      const byte = windows1252Bytes.get(character);
      if (byte === undefined) return value;
      bytes.push(byte);
    }
    try {
      return utf8Decoder.decode(Uint8Array.from(bytes));
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return value.map(repairMojibake);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, repairMojibake(item)]),
    );
  }
  return value;
}

export const getAdminProfile = () =>
  repairMojibake(readJson(STORAGE_KEYS.adminProfile, {}));
export const saveAdminProfile = (profile) =>
  localStorage.setItem(STORAGE_KEYS.adminProfile, JSON.stringify(profile));
export const getStudentFavorites = (email) =>
  readJson(STORAGE_KEYS.favorites, {})[email?.toLowerCase()] || [];
export const saveStudentFavorites = (email, courseIds) => {
  const favorites = readJson(STORAGE_KEYS.favorites, {});
  favorites[email.toLowerCase()] = courseIds;
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
};
export const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.token);
export const saveAuthToken = (token) => localStorage.setItem(STORAGE_KEYS.token, token);
export const clearUser = () => {
  localStorage.removeItem(STORAGE_KEYS.token);
};
