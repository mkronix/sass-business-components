import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '../Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import { Filter, MoreHorizontal, Redo, Undo, Search, X, Star, Clock, Pin, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ContextMenu } from '../ContextMenu';
import { PreviewModal } from '../PreviewModal';
import { UndoNotification } from '../UndoNotification';
import { cn } from '@/lib/utils';

interface CardData {
  id: string;
  [key: string]: any;
}

interface DataGridProps {
  data: CardData[];
  columns: number;
  filters?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  onDelete?: (card: CardData) => void;
  onEdit?: (card: CardData) => void;
  cardPreview?: (card: CardData) => React.ReactNode;
  cardActions?: (card: CardData) => React.ReactNode;
  contextMenuItems?: (card: CardData) => {
    label: string;
    action: (card: CardData) => void;
  }[];
  keyboardShortcuts?: boolean;
  undoStackSize?: number;
  className?: string;
}

const DataGrid: React.FC<DataGridProps> = ({
  data,
  columns,
  filters,
  onDelete,
  onEdit,
  cardPreview,
  cardActions,
  contextMenuItems,
  keyboardShortcuts,
  undoStackSize = 5,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number; card: CardData | null }>({ show: false, x: 0, y: 0, card: null });
  const [previewCard, setPreviewCard] = useState<CardData | null>(null);
  const [undoStack, setUndoStack] = useState<(() => void)[]>([]);
  const [redoStack, setRedoStack] = useState<(() => void)[]>([]);
  const { toast } = useToast();

  const filteredData = data.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    return Object.keys(item).some(key => {
      if (typeof item[key] === 'string') {
        return item[key].toLowerCase().includes(searchTermLower);
      }
      return false;
    });
  }).filter(item => {
    return Object.keys(selectedFilters).every(filterKey => {
      if (!selectedFilters[filterKey]) return true;
      return item[filterKey] === selectedFilters[filterKey];
    });
  });

  const groupedData = filters ? filteredData.reduce((acc: { key: string; label: string; data: CardData[] }[], item) => {
    const filterKey = Object.keys(selectedFilters).find(key => selectedFilters[key] !== null && item[key] === selectedFilters[key]);

    if (filterKey) {
      const filter = filters.find(f => f.key === filterKey);
      if (filter) {
        const existingGroup = acc.find(group => group.key === selectedFilters[filterKey]);
        if (existingGroup) {
          existingGroup.data.push(item);
        } else {
          const selectedOption = filter.options.find(option => option.value === selectedFilters[filterKey]);
          acc.push({ key: selectedFilters[filterKey], label: selectedOption ? selectedOption.label : selectedFilters[filterKey], data: [item] });
        }
      }
    } else {
      const existingUngrouped = acc.find(group => group.key === 'ungrouped');
      if (existingUngrouped) {
        existingUngrouped.data.push(item);
      } else {
        acc.push({ key: 'ungrouped', label: 'Ungrouped', data: [item] });
      }
    }
    return acc;
  }, []) : [{ key: 'all', label: 'All', data: filteredData }];

  const filteredAndGroupedData = filters ? groupedData.filter(group => group.data.length > 0) : [{ key: 'all', label: 'All', data: filteredData }];

  const handleFilterChange = (filterKey: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const handleCardClick = useCallback((id: string, e: React.MouseEvent) => {
    if (e.shiftKey && keyboardShortcuts) {
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    } else {
      setSelectedCards(new Set([id]));
    }
  }, [keyboardShortcuts]);

  const handleContextMenuOpen = useCallback((e: React.MouseEvent, card: CardData) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, card });
    setSelectedCards(new Set([card.id]));
  }, []);

  const handleContextMenuClose = useCallback(() => {
    setContextMenu({ show: false, x: 0, y: 0, card: null });
  }, []);

  const handlePreviewOpen = useCallback((card: CardData) => {
    setPreviewCard(card);
  }, []);

  const handlePreviewClose = useCallback(() => {
    setPreviewCard(null);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const lastUndo = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, lastUndo]);
      lastUndo();
      toast({
        title: "Undo Successful",
        description: "The last action has been undone.",
      });
    } else {
      toast({
        title: "Nothing to Undo",
        description: "There are no more actions to undo.",
      });
    }
  }, [undoStack, toast]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const lastRedo = redoStack[redoStack.length - 1];
      setRedoStack(prev => prev.slice(0, -1));
      setUndoStack(prev => [...prev, lastRedo]);
      lastRedo();
      toast({
        title: "Redo Successful",
        description: "The last undone action has been redone.",
      });
    } else {
      toast({
        title: "Nothing to Redo",
        description: "There are no more actions to redo.",
      });
    }
  }, [redoStack, toast]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!keyboardShortcuts) return;

    const target = e.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
    
    if (isInputField) return;

    switch (e.key) {
      case '/':
        e.preventDefault();
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
        break;
      case 'Escape':
        setSelectedCards(new Set());
        setContextMenu({ show: false, x: 0, y: 0, card: null });
        break;
      case 'Delete':
        if (selectedCards.size > 0 && onDelete) {
          selectedCards.forEach(id => {
            const card = filteredAndGroupedData.find(item => item.data.some(card => card.id === id))?.data.find(card => card.id === id);
            if (card) onDelete(card);
          });
          setSelectedCards(new Set());
        }
        break;
      case 'z':
        if ((e.ctrlKey || e.metaKey) && undoStack.length > 0) {
          e.preventDefault();
          handleUndo();
        }
        break;
    }
  }, [keyboardShortcuts, selectedCards, onDelete, filteredAndGroupedData, undoStack, handleUndo]);

  useEffect(() => {
    if (keyboardShortcuts) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardShortcuts, handleKeyDown]);

  const createUndoAction = useCallback((action: () => void) => {
    setUndoStack(prev => {
      const newStack = [...prev, action];
      if (newStack.length > undoStackSize) {
        newStack.shift();
      }
      return newStack;
    });
    setRedoStack([]);
  }, [undoStackSize]);

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        {filters && filters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {filters.map(filter => (
                <div key={filter.key} className="px-4 py-2">
                  <p className="text-sm font-medium leading-none">{filter.label}</p>
                  {filter.options.map(option => (
                    <DropdownMenuItem key={option.value} onSelect={() => handleFilterChange(filter.key, option.value)}>
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onSelect={() => handleFilterChange(filter.key, '')}>
                    Clear
                  </DropdownMenuItem>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="flex items-center space-x-2">
          {keyboardShortcuts && (
            <>
              <Button variant="ghost" size="sm" onClick={handleUndo} disabled={undoStack.length === 0}>
                <Undo className="mr-2 h-4 w-4" />
                Undo
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
                <Redo className="mr-2 h-4 w-4" />
                Redo
              </Button>
            </>
          )}
          <Input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            data-search-input
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {filteredAndGroupedData.map((group, groupIndex) => (
          <React.Fragment key={group.key}>
            {group.key !== 'all' && (
              <div className="col-span-full">
                <h2 className="text-xl font-semibold">{group.label}</h2>
              </div>
            )}
            {group.data.map(card => (
              <Card
                key={card.id}
                selected={selectedCards.has(card.id)}
                onClick={(e) => handleCardClick(card.id, e)}
                onContextMenu={(e) => handleContextMenuOpen(e, card)}
              >
                <div className="space-y-2">
                  {Object.entries(card).map(([key, value]) => (
                    key !== 'id' && (
                      <div key={key} className="text-sm">
                        <strong>{key}:</strong> {value}
                      </div>
                    )
                  ))}
                  {cardPreview && cardPreview(card)}
                  {cardActions && cardActions(card)}
                </div>
              </Card>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Context Menu */}
      <ContextMenu
        show={contextMenu.show}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={handleContextMenuClose}
      >
        {contextMenuItems && contextMenuItems(contextMenu.card!).map((item, index) => (
          <DropdownMenuItem key={index} onSelect={() => {
            item.action(contextMenu.card!);
            handleContextMenuClose();
          }}>
            {item.label}
          </DropdownMenuItem>
        ))}
        {onEdit && (
          <DropdownMenuItem onSelect={() => {
            onEdit(contextMenu.card!);
            handleContextMenuClose();
          }}>
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onSelect={() => {
            const cardToDelete = contextMenu.card!;
            const undoAction = () => {
              // Implement the logic to re-add the card to the data
              // This depends on how your data is structured and updated.
              // Example: setData(prevData => [...prevData, cardToDelete]);
            };
            createUndoAction(undoAction);
            onDelete(contextMenu.card!);
            handleContextMenuClose();
          }}>
            Delete
          </DropdownMenuItem>
        )}
        {cardPreview && (
          <DropdownMenuItem onSelect={() => {
            handlePreviewOpen(contextMenu.card!);
            handleContextMenuClose();
          }}>
            Preview
          </DropdownMenuItem>
        )}
      </ContextMenu>

      {/* Preview Modal */}
      <PreviewModal card={previewCard} onClose={handlePreviewClose} cardPreview={cardPreview} />

      {/* Undo Notification */}
      <UndoNotification />
    </div>
  );
};

export default DataGrid;
