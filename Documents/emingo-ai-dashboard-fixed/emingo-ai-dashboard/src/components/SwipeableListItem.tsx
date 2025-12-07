import { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';

interface SwipeableListItemProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const SwipeableListItem = ({ children, onEdit, onDelete, disabled = false }: SwipeableListItemProps) => {
  const [dragX, setDragX] = useState(0);
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 80;
    
    if (info.offset.x < -threshold && onDelete) {
      // Swiped left - delete
      onDelete();
      setDragX(0);
    } else if (info.offset.x > threshold && onEdit) {
      // Swiped right - edit
      onEdit();
      setDragX(0);
    } else {
      // Return to original position
      setDragX(0);
    }
  };

  if (disabled) {
    return <div>{children}</div>;
  }

  return (
    <div className="relative overflow-hidden" ref={constraintsRef}>
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between">
        {/* Edit Action (Right side) */}
        {onEdit && (
          <div className="flex items-center justify-center w-20 h-full bg-blue-500">
            <Edit className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1" />
        {/* Delete Action (Left side) */}
        {onDelete && (
          <div className="flex items-center justify-center w-20 h-full bg-red-500">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Swipeable Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: onDelete ? -100 : 0, right: onEdit ? 100 : 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{ x: dragX }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative bg-card z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeableListItem;
