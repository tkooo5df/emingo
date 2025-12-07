import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, TrendingUp, TrendingDown, Target, Briefcase, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

interface QuickAction {
  icon: React.ElementType;
  label: string;
  color: string;
  action: () => void;
}

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  if (!isMobile) return null;

  const quickActions: QuickAction[] = [
    {
      icon: TrendingUp,
      label: t('common.addIncome'),
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        navigate('/income');
        setIsOpen(false);
      }
    },
    {
      icon: TrendingDown,
      label: t('common.addExpense'),
      color: 'bg-red-500 hover:bg-red-600',
      action: () => {
        navigate('/expenses');
        setIsOpen(false);
      }
    },
    {
      icon: Target,
      label: t('common.addGoal'),
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        navigate('/goals');
        setIsOpen(false);
      }
    },
    {
      icon: Briefcase,
      label: t('common.addProject'),
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        navigate('/projects');
        setIsOpen(false);
      }
    },
    {
      icon: Wallet,
      label: t('common.addDebt'),
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => {
        navigate('/debts');
        setIsOpen(false);
      }
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-32 right-6 z-50 flex flex-col-reverse gap-3"
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={action.action}
                  className={`${action.color} text-white rounded-full p-4 shadow-lg flex items-center gap-3 min-w-[140px] active:scale-95 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </>
  );
};

export default FloatingActionButton;
