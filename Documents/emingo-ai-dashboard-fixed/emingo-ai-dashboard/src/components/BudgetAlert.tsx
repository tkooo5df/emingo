import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BudgetAlertProps {
  spent: number;
  budget: number;
  category?: string;
}

const BudgetAlert = ({ spent, budget, category }: BudgetAlertProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();
  
  const percentage = (spent / budget) * 100;
  const isWarning = percentage >= 80 && percentage < 100;
  const isDanger = percentage >= 100;

  useEffect(() => {
    if (isWarning || isDanger) {
      setShowAlert(true);
    }
  }, [isWarning, isDanger]);

  if (!showAlert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative p-4 rounded-lg border-2 mb-4 ${
          isDanger 
            ? 'bg-red-50 border-red-500 dark:bg-red-950/20' 
            : 'bg-yellow-50 border-yellow-500 dark:bg-yellow-950/20'
        }`}
      >
        <button
          onClick={() => setShowAlert(false)}
          className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${
            isDanger ? 'text-red-600' : 'text-yellow-600'
          }`} />
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${
              isDanger ? 'text-red-900 dark:text-red-100' : 'text-yellow-900 dark:text-yellow-100'
            }`}>
              {isDanger ? t('budget.exceeded') : t('budget.warning')}
            </h4>
            <p className={`text-sm ${
              isDanger ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'
            }`}>
              {category 
                ? t('budget.categoryAlert', { category, percentage: percentage.toFixed(0) })
                : t('budget.generalAlert', { percentage: percentage.toFixed(0) })
              }
            </p>
            <div className="mt-2 w-full bg-white/50 dark:bg-black/20 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${
                  isDanger ? 'bg-red-600' : 'bg-yellow-600'
                }`}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BudgetAlert;
