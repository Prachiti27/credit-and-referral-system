export const generateReferralCode = (name: string): string => {
  const base = name.trim().toUpperCase().replace(/\s+/g, '').slice(0, 4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
};
