export const ADMIN_EMAILS = ['sudeepsnwr8@gmail.com', 'saronsun88@gmail.com'];

export const PRIMARY_ADMIN_EMAIL = ADMIN_EMAILS[0];

export const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};
