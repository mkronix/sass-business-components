
import React from 'react';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';

interface ContextMenuProps {
  show: boolean;
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  show,
  x,
  y,
  onClose,
  children
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        className="absolute z-50"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuContent className="w-48">
          {children}
        </DropdownMenuContent>
      </div>
    </div>
  );
};
