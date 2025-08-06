
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardData {
  id: string;
  [key: string]: any;
}

interface PreviewModalProps {
  card: CardData | null;
  onClose: () => void;
  cardPreview?: (card: CardData) => React.ReactNode;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  card,
  onClose,
  cardPreview
}) => {
  return (
    <Drawer open={!!card} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Card Preview</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-6 pb-6 overflow-y-auto">
          {card && (
            <div className="space-y-4">
              {cardPreview ? cardPreview(card) : (
                <div className="space-y-2">
                  {Object.entries(card).map(([key, value]) => (
                    key !== 'id' && (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
