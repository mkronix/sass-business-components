import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Copy, 
  Edit, 
  Eye, 
  Heart, 
  Pin, 
  Star, 
  Trash2,
  Download,
  Share
} from 'lucide-react';
import React from 'react';

interface ContextMenuProps<T = any> {
  contextMenu: { x: number; y: number; row?: T; cardRef?: HTMLElement } | null;
  contextMenuRef: React.RefObject<HTMLDivElement>;
  favorites: Set<string | number>;
  pinnedItems: Set<string | number>;
  enableInlineEditing: boolean;
  getRowId: (row: T) => string | number;
  onClose: () => void;
  onPreview: (item: T) => void;
  onCopyData: (item: T) => void;
  onToggleFavorite: (rowId: string | number) => void;
  onPinItem: (rowId: string | number) => void;
  onDeleteItem: (item: T) => void;
}

const ContextMenu = <T extends Record<string, any>>({
  contextMenu,
  contextMenuRef,
  favorites,
  pinnedItems,
  enableInlineEditing,
  getRowId,
  onClose,
  onPreview,
  onCopyData,
  onToggleFavorite,
  onPinItem,
  onDeleteItem
}: ContextMenuProps<T>) => {
  
  if (!contextMenu || !contextMenu.row) {
    return null;
  }

  const item = contextMenu.row;
  const rowId = getRowId(item);
  const isFavorite = favorites.has(rowId);
  const isPinned = pinnedItems.has(rowId);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      ref={contextMenuRef}
      className="fixed z-50 min-w-[200px] bg-[#0A0A0A] border border-white/20 rounded-lg shadow-xl shadow-black/50 backdrop-blur-sm"
      style={{
        left: contextMenu.x,
        top: contextMenu.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2 space-y-1">
        {/* Primary Actions */}
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10 h-8"
          onClick={() => handleAction(() => onPreview(item))}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>

        {enableInlineEditing && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 h-8"
            onClick={() => handleAction(() => console.log('Edit:', item))}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Item
          </Button>
        )}

        <Separator className="bg-white/10 my-2" />

        {/* Quick Actions */}
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start h-8 hover:bg-white/10",
            isFavorite ? "text-red-400" : "text-white"
          )}
          onClick={() => handleAction(() => onToggleFavorite(rowId))}
        >
          <Heart className={cn("h-4 w-4 mr-2", isFavorite && "fill-current")} />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start h-8 hover:bg-white/10",
            isPinned ? "text-yellow-400" : "text-white"
          )}
          onClick={() => handleAction(() => onPinItem(rowId))}
        >
          <Pin className={cn("h-4 w-4 mr-2", isPinned && "fill-current")} />
          {isPinned ? 'Unpin Item' : 'Pin to Top'}
        </Button>

        <Separator className="bg-white/10 my-2" />

        {/* Data Actions */}
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10 h-8"
          onClick={() => handleAction(() => onCopyData(item))}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Data
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10 h-8"
          onClick={() => handleAction(() => console.log('Export:', item))}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Item
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10 h-8"
          onClick={() => handleAction(() => console.log('Share:', item))}
        >
          <Share className="h-4 w-4 mr-2" />
          Share Item
        </Button>

        <Separator className="bg-white/10 my-2" />

        {/* Destructive Actions */}
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-red-400 hover:bg-red-400/10 h-8"
          onClick={() => handleAction(() => onDeleteItem(item))}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Item
        </Button>
      </div>
    </div>
  );
};

export default ContextMenu;