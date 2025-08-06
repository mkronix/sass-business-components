import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Keyboard, 
  Search, 
  Filter, 
  Eye, 
  RotateCcw,
  Grid3X3,
  List,
  Group,
  CheckSquare
} from 'lucide-react';
import React from 'react';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({
  isOpen,
  onClose
}) => {
  
  const shortcuts = [
    {
      category: 'Navigation',
      icon: Grid3X3,
      items: [
        { key: '1', description: 'Switch to Grid view' },
        { key: '2', description: 'Switch to Compact view' },
        { key: '3', description: 'Small card size' },
        { key: '4', description: 'Large card size' },
        { key: 'Esc', description: 'Clear selection & close modals' }
      ]
    },
    {
      category: 'Search & Filter',
      icon: Search,
      items: [
        { key: 'Ctrl+F', description: 'Focus search input', mac: 'Cmd+F' },
        { key: 'F', description: 'Toggle filters panel' },
        { key: 'G', description: 'Toggle grouping by department' }
      ]
    },
    {
      category: 'Selection',
      icon: CheckSquare,
      items: [
        { key: 'Ctrl+A', description: 'Select all items', mac: 'Cmd+A' },
        { key: 'Space', description: 'Toggle item selection' },
        { key: 'Shift+Click', description: 'Select range of items' }
      ]
    },
    {
      category: 'Actions',
      icon: RotateCcw,
      items: [
        { key: 'Ctrl+Z', description: 'Undo last action', mac: 'Cmd+Z' },
        { key: 'Enter', description: 'Open preview modal' },
        { key: 'Delete', description: 'Delete selected items' }
      ]
    },
    {
      category: 'Help',
      icon: Keyboard,
      items: [
        { key: '?', description: 'Show keyboard shortcuts' },
        { key: 'Ctrl+/', description: 'Toggle help', mac: 'Cmd+/' }
      ]
    }
  ];

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const formatKey = (key: string, macKey?: string) => {
    return isMac && macKey ? macKey : key;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0A0A0A] border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Use these keyboard shortcuts to navigate and interact with the data grid efficiently
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={category.category}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="h-4 w-4 text-white/60" />
                  <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                </div>
                
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-[#171717] rounded-lg border border-white/10">
                      <span className="text-white/80">{item.description}</span>
                      <div className="flex items-center gap-1">
                        {formatKey(item.key, item.mac).split('+').map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            {keyIndex > 0 && <span className="text-white/40 mx-1">+</span>}
                            <Badge 
                              variant="outline" 
                              className="bg-[#0A0A0A] border-white/30 text-white font-mono text-xs px-2 py-1"
                            >
                              {key}
                            </Badge>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {index < shortcuts.length - 1 && <Separator className="bg-white/10 mt-6" />}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-[#171717] rounded-lg border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
            <div>
              <h4 className="text-white font-medium mb-1">Pro Tip</h4>
              <p className="text-sm text-white/60">
                You can combine multiple shortcuts for faster navigation. For example, press "1" followed by "G" 
                to switch to grid view and group by department.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-white/10">
          <Button onClick={onClose}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardHelpModal;