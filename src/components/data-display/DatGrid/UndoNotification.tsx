import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCcw, X } from 'lucide-react';
import React from 'react';

interface UndoAction {
  id: string;
  type: 'delete' | 'edit' | 'bulk-delete';
  timestamp: Date;
  data: any;
  description: string;
}

interface UndoNotificationProps {
  show: boolean;
  action: UndoAction | null;
  onUndo: () => void;
  onClose: () => void;
}

const UndoNotification: React.FC<UndoNotificationProps> = ({
  show,
  action,
  onUndo,
  onClose
}) => {
  
  if (!show || !action) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300",
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <div className="bg-[#0A0A0A] border border-white/20 rounded-lg shadow-xl shadow-black/50 backdrop-blur-sm p-4 min-w-[400px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <RotateCcw className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">{action.description}</p>
              <p className="text-white/60 text-sm">Action can be undone</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={onUndo}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Undo
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress bar for auto-hide */}
        <div className="mt-3 w-full bg-white/10 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-blue-400 transition-all duration-5000 ease-linear"
            style={{ 
              width: show ? '0%' : '100%',
              transitionDuration: show ? '5000ms' : '0ms'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UndoNotification;