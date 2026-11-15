import { Home, Sprout, Calendar, FileText, User, Info } from 'lucide-react';

const iconMap = {
  Home,
  Sprout,
  Calendar,
  FileText,
  User,
  Info,
};

export const Icon = ({ name, size = 18, className = '', ...props }) => {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} {...props} />;
};
