import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import MobileCard from './MobileCard';
import { useTranslation } from 'react-i18next';

interface QuickStatsProps {
  income: number;
  expenses: number;
  balance: number;
  savings: number;
  currency: string;
}

const QuickStats = ({ income, expenses, balance, savings, currency }: QuickStatsProps) => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('common.income'),
      value: `${income.toLocaleString()} ${currency}`,
      icon: TrendingUp,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100 dark:bg-green-950',
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: t('common.expenses'),
      value: `${expenses.toLocaleString()} ${currency}`,
      icon: TrendingDown,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100 dark:bg-red-950',
      trend: { value: 8.3, isPositive: false }
    },
    {
      title: 'Balance',
      value: `${balance.toLocaleString()} ${currency}`,
      icon: Wallet,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Savings',
      value: `${savings.toLocaleString()} ${currency}`,
      icon: PiggyBank,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-950',
      trend: { value: 15.7, isPositive: true }
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MobileCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
            iconBg={stat.iconBg}
            trend={stat.trend}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
