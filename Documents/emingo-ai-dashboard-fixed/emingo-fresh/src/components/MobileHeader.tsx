import { motion } from 'framer-motion';
import { Bell, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useTranslation } from 'react-i18next';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showNotifications?: boolean;
  showSearch?: boolean;
  showProfile?: boolean;
}

const MobileHeader = ({ 
  title, 
  subtitle, 
  showNotifications = true, 
  showSearch = false,
  showProfile = true 
}: MobileHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/50"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Title Section */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label={t('common.search')}
            >
              <Search className="w-5 h-5" />
            </motion.button>
          )}

          {showNotifications && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-muted rounded-full transition-colors relative"
              aria-label={t('common.notifications')}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
          )}

          {showProfile && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/settings')}
              className="p-1 hover:bg-muted rounded-full transition-colors"
              aria-label={t('common.profile')}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default MobileHeader;
