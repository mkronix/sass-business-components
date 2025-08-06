import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  Grid3X3, 
  List, 
  Settings, 
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  viewMode: 'grid' | 'compact' | 'cards';
  gridSize: 'small' | 'medium' | 'large';
  onViewModeChange: (mode: 'grid' | 'compact' | 'cards') => void;
  onGridSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  viewMode,
  gridSize,
  onViewModeChange,
  onGridSizeChange,
  onClose
}) => {
  
  const viewModes = [
    {
      id: 'grid',
      label: 'Grid View',
      description: 'Cards in a responsive grid layout',
      icon: Grid3X3
    },
    {
      id: 'compact',
      label: 'Compact View', 
      description: 'Dense list with essential information',
      icon: List
    }
  ];

  const gridSizes = [
    {
      id: 'small',
      label: 'Small Cards',
      description: 'More items per row, compact layout',
      columns: '6 columns on desktop',
      icon: Smartphone
    },
    {
      id: 'medium',
      label: 'Medium Cards',
      description: 'Balanced layout with good detail',
      columns: '4 columns on desktop',
      icon: Tablet
    },
    {
      id: 'large',
      label: 'Large Cards',
      description: 'Fewer items per row, more detail',
      columns: '3 columns on desktop',
      icon: Monitor
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#0A0A0A] border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Display Settings
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Customize how your data is displayed and organized
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="display" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#171717] border border-white/10">
            <TabsTrigger value="display" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Display
            </TabsTrigger>
            <TabsTrigger value="layout" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Layout
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Preferences
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="display" className="space-y-6 mt-0">
              {/* View Mode Selection */}
              <div>
                <Label className="text-sm font-medium mb-4 block">View Mode</Label>
                <RadioGroup 
                  value={viewMode} 
                  onValueChange={(value) => onViewModeChange(value as any)}
                  className="space-y-3"
                >
                  {viewModes.map(mode => {
                    const Icon = mode.icon;
                    return (
                      <div key={mode.id} className="flex items-center space-x-3">
                        <RadioGroupItem 
                          value={mode.id} 
                          id={mode.id}
                          className="border-white/30 text-white"
                        />
                        <div className="flex items-center gap-3 flex-1 p-4 bg-[#171717] rounded-lg border border-white/10 cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                          <Icon className="h-5 w-5 text-white/60" />
                          <div>
                            <Label htmlFor={mode.id} className="text-white font-medium cursor-pointer">
                              {mode.label}
                            </Label>
                            <p className="text-sm text-white/60 mt-1">{mode.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <Separator className="bg-white/10" />

              {/* Grid Size Selection (only show when grid mode is selected) */}
              {viewMode === 'grid' && (
                <div>
                  <Label className="text-sm font-medium mb-4 block">Card Size</Label>
                  <RadioGroup 
                    value={gridSize} 
                    onValueChange={(value) => onGridSizeChange(value as any)}
                    className="space-y-3"
                  >
                    {gridSizes.map(size => {
                      const Icon = size.icon;
                      return (
                        <div key={size.id} className="flex items-center space-x-3">
                          <RadioGroupItem 
                            value={size.id} 
                            id={size.id}
                            className="border-white/30 text-white"
                          />
                          <div className="flex items-center gap-3 flex-1 p-4 bg-[#171717] rounded-lg border border-white/10 cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                            <Icon className="h-5 w-5 text-white/60" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={size.id} className="text-white font-medium cursor-pointer">
                                  {size.label}
                                </Label>
                                <span className="text-xs text-white/40">{size.columns}</span>
                              </div>
                              <p className="text-sm text-white/60 mt-1">{size.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}
            </TabsContent>

            <TabsContent value="layout" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Show Card Animations</Label>
                    <p className="text-sm text-white/60 mt-1">Enable hover effects and transitions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Highlight Search Results</Label>
                    <p className="text-sm text-white/60 mt-1">Highlight matching text in search results</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Show Selection Indicators</Label>
                    <p className="text-sm text-white/60 mt-1">Visual indicators for selected items</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Auto-refresh Data</Label>
                    <p className="text-sm text-white/60 mt-1">Automatically refresh data every 30 seconds</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Remember View Settings</Label>
                    <p className="text-sm text-white/60 mt-1">Save your display preferences</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Show Keyboard Shortcuts</Label>
                    <p className="text-sm text-white/60 mt-1">Display keyboard shortcut hints</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Confirm Delete Actions</Label>
                    <p className="text-sm text-white/60 mt-1">Show confirmation dialog before deleting</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator className="bg-white/10" />

                <div className="p-4 bg-[#171717] rounded-lg border border-white/10">
                  <h3 className="text-white font-medium mb-2">Reset Settings</h3>
                  <p className="text-sm text-white/60 mb-3">
                    Reset all display settings to their default values
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 pt-6 border-t border-white/10">
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
            Cancel
          </Button>
          <Button onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;