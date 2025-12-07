import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface MobileCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  className?: string;
}

const MobileCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  trend,
  onClick,
  className = ''
}: MobileCardProps) => {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <Card className={`p-4 hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1 truncate">{title}</p>
            <h3 className="text-2xl font-bold mb-1 truncate">{value}</h3>
            {trend && (
              <div className={`text-xs font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          <div className={`${iconBg} p-3 rounded-xl`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MobileCard;
