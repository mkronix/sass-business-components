
import { useState, useCallback, useRef } from 'react';

interface UndoRedoState<T> {
  history: T[];
  currentIndex: number;
}

interface UndoRedoOptions {
  maxHistorySize?: number;
  debounceMs?: number;
}

export function useUndoRedo<T>(
  initialState: T,
  options: UndoRedoOptions = {}
) {
  const { maxHistorySize = 50, debounceMs = 300 } = options;
  
  const [state, setState] = useState<UndoRedoState<T>>({
    history: [initialState],
    currentIndex: 0
  });
  
  const debounceRef = useRef<NodeJS.Timeout>();
  const lastStateRef = useRef<T>(initialState);

  const current = state.history[state.currentIndex];
  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;

  const addToHistory = useCallback((newState: T) => {
    setState(prevState => {
      // Remove any future history if we're not at the end
      const newHistory = prevState.history.slice(0, prevState.currentIndex + 1);
      
      // Add new state
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1
        };
      }
      
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1
      };
    });
  }, [maxHistorySize]);

  const updateState = useCallback((newState: T) => {
    lastStateRef.current = newState;
    
    // Debounce history updates
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      addToHistory(newState);
    }, debounceMs);
  }, [addToHistory, debounceMs]);

  const undo = useCallback(() => {
    if (canUndo) {
      setState(prevState => ({
        ...prevState,
        currentIndex: prevState.currentIndex - 1
      }));
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setState(prevState => ({
        ...prevState,
        currentIndex: prevState.currentIndex + 1
      }));
    }
  }, [canRedo]);

  const reset = useCallback(() => {
    setState({
      history: [initialState],
      currentIndex: 0
    });
  }, [initialState]);

  const getHistoryInfo = useCallback(() => ({
    totalSteps: state.history.length,
    currentStep: state.currentIndex + 1,
    canUndo,
    canRedo
  }), [state.history.length, state.currentIndex, canUndo, canRedo]);

  return {
    current,
    updateState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    getHistoryInfo
  };
}
