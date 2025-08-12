
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveOptions {
  key: string;
  data: Record<string, any>;
  interval?: number;
  enabled?: boolean;
  onSave?: (data: Record<string, any>) => Promise<void>;
  onRestore?: (data: Record<string, any>) => void;
}

interface SavedData {
  data: Record<string, any>;
  timestamp: number;
  version: number;
}

export function useAutoSave({
  key,
  data,
  interval = 5000,
  enabled = true,
  onSave,
  onRestore
}: AutoSaveOptions) {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const saveToStorage = async (saveData: Record<string, any>) => {
    try {
      setIsAutoSaving(true);
      
      const savedData: SavedData = {
        data: saveData,
        timestamp: Date.now(),
        version: 1
      };

      localStorage.setItem(`autosave-${key}`, JSON.stringify(savedData));
      
      if (onSave) {
        await onSave(saveData);
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast({
        title: "Auto-save failed",
        description: "Your changes may not be saved automatically.",
        variant: "destructive",
      });
    } finally {
      setIsAutoSaving(false);
    }
  };

  const restoreFromStorage = (): SavedData | null => {
    try {
      const saved = localStorage.getItem(`autosave-${key}`);
      if (saved) {
        const parsedData: SavedData = JSON.parse(saved);
        if (onRestore) {
          onRestore(parsedData.data);
        }
        return parsedData;
      }
    } catch (error) {
      console.error('Failed to restore auto-saved data:', error);
    }
    return null;
  };

  const clearAutoSave = () => {
    localStorage.removeItem(`autosave-${key}`);
    setLastSaved(null);
  };

  const hasAutoSavedData = (): boolean => {
    return localStorage.getItem(`autosave-${key}`) !== null;
  };

  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      if (Object.keys(data).length > 0) {
        saveToStorage(data);
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, interval, enabled]);

  return {
    isAutoSaving,
    lastSaved,
    restoreFromStorage,
    clearAutoSave,
    hasAutoSavedData,
    saveNow: () => saveToStorage(data)
  };
}
