import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  ChevronFirst, 
  ChevronLast, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#0A0A0A]">
      {/* Items info */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/60">
          Showing {startItem}-{endItem} of {totalItems} items
        </span>
        
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Show:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(parseInt(value))}>
            <SelectTrigger className="w-20 h-8 bg-[#171717] border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#171717] border-white/20">
              {[25, 50, 100, 200].map(size => (
                <SelectItem key={size} value={size.toString()} className="text-white">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronFirst className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-white/40 text-sm">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    currentPage === page
                      ? 'bg-white text-black'
                      : 'border-white/20 text-white hover:bg-white/10'
                  )}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronLast className="h-4 w-4" />
        </Button>
      </div>

      {/* Page info */}
      <div className="text-sm text-white/60">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;