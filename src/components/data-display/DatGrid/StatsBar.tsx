import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, 
  Heart, 
  Pin, 
  Search, 
  Users,
  Eye
} from 'lucide-react';
import React from 'react';

interface StatsBarProps {
  totalItems: number;
  pinnedCount: number;
  favoritesCount: number;
  selectedCount: number;
  highlightedCount: number;
  onSelectAll?: () => void;
  allSelected?: boolean;
}

const StatsBar: React.FC<StatsBarProps> = ({
  totalItems,
  pinnedCount,
  favoritesCount,
  selectedCount,
  highlightedCount,
  onSelectAll,
  allSelected = false
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-1 mb-6">
      <div className="flex items-center gap-4">
        {/* Total Items */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-white/60" />
          <span className="text-sm text-white/80">
            <span className="font-medium text-white">{totalItems}</span> items
          </span>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-2">
          {pinnedCount > 0 && (
            <Badge variant="outline" className="bg-yellow-400/10 border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/20">
              <Pin className="h-3 w-3 mr-1" />
              {pinnedCount} pinned
            </Badge>
          )}

          {favoritesCount > 0 && (
            <Badge variant="outline" className="bg-red-400/10 border-red-400/30 text-red-300 hover:bg-red-400/20">
              <Heart className="h-3 w-3 mr-1" />
              {favoritesCount} favorites
            </Badge>
          )}

          {selectedCount > 0 && (
            <Badge variant="outline" className="bg-blue-400/10 border-blue-400/30 text-blue-300 hover:bg-blue-400/20">
              <CheckSquare className="h-3 w-3 mr-1" />
              {selectedCount} selected
            </Badge>
          )}

          {highlightedCount > 0 && (
            <Badge variant="outline" className="bg-green-400/10 border-green-400/30 text-green-300 hover:bg-green-400/20">
              <Search className="h-3 w-3 mr-1" />
              {highlightedCount} matching
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onSelectAll && totalItems > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={onSelectAll}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StatsBar;