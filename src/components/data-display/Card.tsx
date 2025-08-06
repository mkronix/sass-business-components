
import React from 'react';
import { Card as UICard } from '@/components/ui/card';

interface CardProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  selected = false,
  onClick,
  onContextMenu,
  className = ''
}) => {
  return (
    <UICard
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        selected ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${className}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="p-4">
        {children}
      </div>
    </UICard>
  );
};
