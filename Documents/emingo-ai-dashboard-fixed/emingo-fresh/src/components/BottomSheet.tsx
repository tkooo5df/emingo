import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PieChart,
  Briefcase,
  Target,
  Bot,
  Wallet,
  Settings,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomSheet = ({ isOpen, onClose }: BottomSheetProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const allPages = [
    { path: '/', icon: LayoutDashboard, label: t('common.dashboard'), color: 'text-blue-500' },
    { path: '/income', icon: TrendingUp, label: t('common.income'), color: 'text-green-500' },
    { path: '/expenses', icon: TrendingDown, label: t('common.expenses'), color: 'text-red-500' },
    { path: '/debts', icon: Wallet, label: t('common.debts'), color: 'text-orange-500' },
    { path: '/budget', icon: PieChart, label: t('common.budget'), color: 'text-purple-500' },
    { path: '/projects', icon: Briefcase, label: t('common.projects'), color: 'text-indigo-500' },
    { path: '/goals', icon: Target, label: t('common.goals'), color: 'text-cyan-500' },
    { path: '/ai-assistant', icon: Bot, label: t('common.aiAssistant'), color: 'text-pink-500' },
    { path: '/settings', icon: Settings, label: t('common.settings'), color: 'text-gray-500' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-card rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border">
              <h3 className="text-lg font-semibold">{t('common.navigation')}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Grid */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-3 gap-3">
                {allPages.map((page) => {
                  const Icon = page.icon;
                  const isActive = location.pathname === page.path;

                  return (
                    <motion.button
                      key={page.path}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigate(page.path)}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-2xl transition-all
                        ${isActive 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'bg-muted/50 hover:bg-muted'
                        }
                      `}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? '' : page.color}`} />
                      <span className="text-xs font-medium text-center leading-tight">
                        {page.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
