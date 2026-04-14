export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'admin123';
export const ADMIN_EMAIL = 'admin@portfolio.local';

export const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
};
