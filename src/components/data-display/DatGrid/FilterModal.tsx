import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  CheckCircle, 
  Filter, 
  Hash, 
  SortAsc, 
  SortDesc, 
  X, 
  XCircle,
  Building,
  Shield,
  Tags as TagsIcon
} from 'lucide-react';
import React from 'react';
import { FilterConfig, GridColumn, SortConfig } from './types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTags: string[];
  allStatuses: string[];
  selectedTags: string[];
  selectedStatuses: string[];
  onTagsChange: (tags: string[]) => void;
  onStatusesChange: (statuses: string[]) => void;
  columns: GridColumn[];
  filters: Record<string, FilterConfig>;
  onFiltersChange: (filters: Record<string, FilterConfig>) => void;
  sorting: SortConfig[];
  onSortingChange: (sorting: SortConfig[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  allTags,
  allStatuses,
  selectedTags,
  selectedStatuses,
  onTagsChange,
  onStatusesChange,
  columns,
  filters,
  onFiltersChange,
  sorting,
  onSortingChange
}) => {
  
  const addFilter = (columnId: string) => {
    onFiltersChange({
      ...filters,
      [columnId]: { value: '', operator: 'contains' as const }
    });
  };

  const updateFilter = (columnId: string, field: keyof FilterConfig, value: any) => {
    onFiltersChange({
      ...filters,
      [columnId]: { ...filters[columnId], [field]: value }
    });
  };

  const removeFilter = (columnId: string) => {
    const newFilters = { ...filters };
    delete newFilters[columnId];
    onFiltersChange(newFilters);
  };

  const addSort = (columnId: string) => {
    const maxPriority = Math.max(0, ...sorting.map(s => s.priority));
    onSortingChange([
      ...sorting,
      { columnId, direction: 'asc', priority: maxPriority + 1 }
    ]);
  };

  const updateSort = (columnId: string, direction: 'asc' | 'desc') => {
    onSortingChange(
      sorting.map(s => 
        s.columnId === columnId ? { ...s, direction } : s
      )
    );
  };

  const removeSort = (columnId: string) => {
    onSortingChange(sorting.filter(s => s.columnId !== columnId));
  };

  const clearAll = () => {
    onTagsChange([]);
    onStatusesChange([]);
    onFiltersChange({});
    onSortingChange([]);
  };

  const filteredColumns = columns.filter(col => col.filterable !== false);
  const sortableColumns = columns.filter(col => col.sortable !== false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-[#0A0A0A] border-white/20 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters & Sorting
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Configure detailed filters and sorting options for your data
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="quick" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 bg-[#171717] border border-white/10">
            <TabsTrigger value="quick" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Quick Filters
            </TabsTrigger>
            <TabsTrigger value="columns" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Column Filters
            </TabsTrigger>
            <TabsTrigger value="sorting" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Sorting
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Advanced
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 flex-1 overflow-y-auto max-h-[50vh]">
            <TabsContent value="quick" className="space-y-6 mt-0">
              {/* Tags Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="h-4 w-4 text-white/60" />
                  <Label className="text-sm font-medium">Tags</Label>
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-white/70">
                    {selectedTags.length} selected
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      size="sm"
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className={cn(
                        "justify-start text-xs h-8",
                        selectedTags.includes(tag)
                          ? 'bg-white text-black'
                          : 'border-white/20 text-white hover:bg-white/10'
                      )}
                      onClick={() => {
                        onTagsChange(
                          selectedTags.includes(tag)
                            ? selectedTags.filter(t => t !== tag)
                            : [...selectedTags, tag]
                        );
                      }}
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-white/60" />
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-white/70">
                    {selectedStatuses.length} selected
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {allStatuses.map(status => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedStatuses.includes(status) ? 'default' : 'outline'}
                      className={cn(
                        "justify-start text-xs h-8",
                        selectedStatuses.includes(status)
                          ? 'bg-white text-black'
                          : 'border-white/20 text-white hover:bg-white/10'
                      )}
                      onClick={() => {
                        onStatusesChange(
                          selectedStatuses.includes(status)
                            ? selectedStatuses.filter(s => s !== status)
                            : [...selectedStatuses, status]
                        );
                      }}
                    >
                      {status === 'Active' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {status === 'Inactive' && <XCircle className="h-3 w-3 mr-1" />}
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="columns" className="space-y-4 mt-0">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Column Filters</Label>
                <Select onValueChange={addFilter}>
                  <SelectTrigger className="w-48 bg-[#171717] border-white/20 text-white">
                    <SelectValue placeholder="Add filter..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#171717] border-white/20">
                    {filteredColumns
                      .filter(col => !filters[col.id])
                      .map(col => (
                        <SelectItem key={col.id} value={col.id} className="text-white">
                          {col.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(filters).map(([columnId, filter]) => {
                  const column = columns.find(c => c.id === columnId);
                  if (!column) return null;

                  return (
                    <div key={columnId} className="p-4 bg-[#171717] rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="font-medium">{column.title}</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-white/60 hover:text-white"
                          onClick={() => removeFilter(columnId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-white/60 mb-1 block">Operator</Label>
                          <Select 
                            value={filter.operator} 
                            onValueChange={(value) => updateFilter(columnId, 'operator', value)}
                          >
                            <SelectTrigger className="bg-[#0A0A0A] border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#171717] border-white/20">
                              <SelectItem value="contains" className="text-white">Contains</SelectItem>
                              <SelectItem value="equals" className="text-white">Equals</SelectItem>
                              <SelectItem value="startsWith" className="text-white">Starts With</SelectItem>
                              <SelectItem value="endsWith" className="text-white">Ends With</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-white/60 mb-1 block">Value</Label>
                          <Input
                            value={filter.value}
                            onChange={(e) => updateFilter(columnId, 'value', e.target.value)}
                            placeholder="Enter filter value..."
                            className="bg-[#0A0A0A] border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="sorting" className="space-y-4 mt-0">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Sort Columns</Label>
                <Select onValueChange={addSort}>
                  <SelectTrigger className="w-48 bg-[#171717] border-white/20 text-white">
                    <SelectValue placeholder="Add sort..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#171717] border-white/20">
                    {sortableColumns
                      .filter(col => !sorting.find(s => s.columnId === col.id))
                      .map(col => (
                        <SelectItem key={col.id} value={col.id} className="text-white">
                          {col.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {sorting
                  .sort((a, b) => a.priority - b.priority)
                  .map((sort) => {
                    const column = columns.find(c => c.id === sort.columnId);
                    if (!column) return null;

                    return (
                      <div key={sort.columnId} className="p-4 bg-[#171717] rounded-lg border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-white/5 border-white/20 text-white/70">
                              {sort.priority}
                            </Badge>
                            <Label className="font-medium">{column.title}</Label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={sort.direction === 'asc' ? 'default' : 'outline'}
                              className={cn(
                                "h-8 px-3",
                                sort.direction === 'asc'
                                  ? 'bg-white text-black'
                                  : 'border-white/20 text-white hover:bg-white/10'
                              )}
                              onClick={() => updateSort(sort.columnId, 'asc')}
                            >
                              <SortAsc className="h-3 w-3 mr-1" />
                              Asc
                            </Button>
                            <Button
                              size="sm"
                              variant={sort.direction === 'desc' ? 'default' : 'outline'}
                              className={cn(
                                "h-8 px-3",
                                sort.direction === 'desc'
                                  ? 'bg-white text-black'
                                  : 'border-white/20 text-white hover:bg-white/10'
                              )}
                              onClick={() => updateSort(sort.columnId, 'desc')}
                            >
                              <SortDesc className="h-3 w-3 mr-1" />
                              Desc
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-white/60 hover:text-white"
                              onClick={() => removeSort(sort.columnId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 mt-0">
              <div className="text-center py-8 text-white/60">
                <Filter className="h-12 w-12 mx-auto mb-4 text-white/40" />
                <h3 className="text-lg font-medium mb-2">Advanced Features</h3>
                <p>Additional filtering and search options will be available here.</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <Button
            variant="outline"
            onClick={clearAll}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Clear All
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button onClick={onClose}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;