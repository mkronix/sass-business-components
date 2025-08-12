import { useState, useEffect, useMemo } from 'react';

interface SuggestionEntry {
  value: string;
  count: number;
  lastUsed: number;
  context?: string;
}

interface SmartSuggestionsOptions {
  fieldId: string;
  maxSuggestions?: number;
  minCharacters?: number;
  contextFields?: string[];
  enabled?: boolean;
}

export function useSmartSuggestions({
  fieldId,
  maxSuggestions = 5,
  minCharacters = 1,
  contextFields = [],
  enabled = true
}: SmartSuggestionsOptions) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const storageKey = `suggestions-${fieldId}`;

  const getSavedSuggestions = (): SuggestionEntry[] => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const saveSuggestion = (value: string, context?: Record<string, any>) => {
    if (!value || value.trim().length === 0) return;

    const saved = getSavedSuggestions();
    const contextKey = context ? JSON.stringify(context) : undefined;
    
    const existingIndex = saved.findIndex(
      entry => entry.value === value && entry.context === contextKey
    );

    if (existingIndex >= 0) {
      saved[existingIndex].count++;
      saved[existingIndex].lastUsed = Date.now();
    } else {
      saved.push({
        value: value.trim(),
        count: 1,
        lastUsed: Date.now(),
        context: contextKey
      });
    }

    // Keep only top 100 suggestions
    saved.sort((a, b) => b.count * 0.7 + (b.lastUsed / 1000000) - (a.count * 0.7 + (a.lastUsed / 1000000)));
    const trimmed = saved.slice(0, 100);

    localStorage.setItem(storageKey, JSON.stringify(trimmed));
  };

  const getSuggestions = (input: string, context?: Record<string, any>): string[] => {
    if (!enabled || input.length < minCharacters) return [];

    const saved = getSavedSuggestions();
    const contextKey = context ? JSON.stringify(context) : undefined;
    
    const filtered = saved
      .filter(entry => {
        const matchesInput = entry.value.toLowerCase().includes(input.toLowerCase());
        const matchesContext = !contextKey || entry.context === contextKey;
        return matchesInput && matchesContext;
      })
      .sort((a, b) => {
        // Score based on frequency and recency
        const scoreA = a.count * 0.7 + (a.lastUsed / 1000000) * 0.3;
        const scoreB = b.count * 0.7 + (b.lastUsed / 1000000) * 0.3;
        return scoreB - scoreA;
      })
      .slice(0, maxSuggestions)
      .map(entry => entry.value);

    return filtered;
  };

  const updateSuggestions = (input: string, context?: Record<string, any>) => {
    setIsLoading(true);
    
    // Simulate async operation for consistency
    setTimeout(() => {
      const newSuggestions = getSuggestions(input, context);
      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 50);
  };

  const clearSuggestions = () => {
    localStorage.removeItem(storageKey);
    setSuggestions([]);
  };

  return {
    suggestions,
    isLoading,
    updateSuggestions,
    saveSuggestion,
    clearSuggestions
  };
}
