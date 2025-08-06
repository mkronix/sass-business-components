import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    Heart,
    Mail,
    Phone,
    Pin,
    User
} from 'lucide-react';
import React from 'react';

interface ItemCardProps<T = any> {
    item: T;
    index: number;
    rowId: string | number;
    viewMode: 'grid' | 'compact' | 'cards';
    gridSize: 'small' | 'medium' | 'large';
    isSelected: boolean;
    isPinned: boolean;
    isFavorite: boolean;
    isHighlighted: boolean;
    enableRowSelection: boolean;
    searchQuery: string;
    onSelectionChange: (rowId: string | number, selected: boolean) => void;
    onToggleFavorite: (rowId: string | number) => void;
    onPinItem: (rowId: string | number) => void;
    onPreview: (item: T) => void;
    onClick?: (e: React.MouseEvent) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
    onContextMenu?: (e: React.MouseEvent) => void;
    onHover: (rowId: string | number | null) => void;
}

const ItemCard = <T extends Record<string, any>>({
    item,
    index,
    rowId,
    viewMode,
    gridSize,
    isSelected,
    isPinned,
    isFavorite,
    isHighlighted,
    enableRowSelection,
    searchQuery,
    onSelectionChange,
    onToggleFavorite,
    onPinItem,
    onPreview,
    onClick,
    onDoubleClick,
    onContextMenu,
    onHover
}: ItemCardProps<T>) => {

    // Highlight matching text
    const highlightText = (text: string, query: string) => {
        if (!query || !text) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, `<mark class="bg-yellow-400/30 text-yellow-200">$1</mark>`);
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'text-green-400 bg-green-400/10';
            case 'inactive': return 'text-red-400 bg-red-400/10';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10';
            case 'on leave': return 'text-blue-400 bg-blue-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    if (viewMode === 'compact') {
        return (
            <div
                className={cn(
                    "group relative bg-[#0A0A0A] border rounded-lg p-4 transition-all duration-200 cursor-pointer",
                    "hover:bg-[#111111] hover:border-white/20 hover:shadow-lg hover:shadow-white/5",
                    isSelected && "border-white/40 bg-[#111111] shadow-md shadow-white/10",
                    isPinned && "border-yellow-400/30 bg-yellow-400/5",
                    isHighlighted && "border-blue-400/40 bg-blue-400/5",
                    "border-white/10"
                )}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onContextMenu={onContextMenu}
                onMouseEnter={() => onHover(rowId)}
                onMouseLeave={() => onHover(null)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {enableRowSelection && (
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => onSelectionChange(rowId, checked as boolean)}
                                className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}

                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10">
                            <User className="h-5 w-5 text-white/70" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3
                                    className="font-medium text-white truncate"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightText(item.name || 'Unnamed', searchQuery)
                                    }}
                                />
                                {isPinned && <Pin className="h-3 w-3 text-yellow-400 fill-current" />}
                                {isFavorite && <Heart className="h-3 w-3 text-red-400 fill-current" />}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white/60 mt-1">
                                <span className="truncate">{item.department || 'Unknown'}</span>
                                <span>•</span>
                                <span className="truncate">{item.role || 'No Role'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", getStatusColor(item.status))}>
                            {item.status === 'Active' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {item.status === 'On Leave' && <Clock className="h-3 w-3 mr-1" />}
                            {item.status}
                        </Badge>

                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPreview(item);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "group relative bg-[#0A0A0A] border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer",
                "hover:bg-[#111111] hover:border-white/20 hover:shadow-xl hover:shadow-white/5 hover:-translate-y-1",
                isSelected && "border-white/40 bg-[#111111] shadow-lg shadow-white/10 scale-[1.02]",
                isPinned && "border-yellow-400/30 bg-yellow-400/5 shadow-md shadow-yellow-400/5",
                isHighlighted && "border-blue-400/40 bg-blue-400/5 shadow-md shadow-blue-400/5",
                "border-white/10",
                gridSize === 'small' && "h-48",
                gridSize === 'medium' && "h-56",
                gridSize === 'large' && "h-64"
            )}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onContextMenu={onContextMenu}
            onMouseEnter={() => onHover(rowId)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Header with actions */}
            <div className="absolute top-3 right-3 z-10 flex gap-1">
                {enableRowSelection && (
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelectionChange(rowId, checked as boolean)}
                        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white bg-black/50 backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
            </div>

            {/* Avatar and status */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
                            <User className="h-8 w-8 text-white/70" />
                        </div>
                        <div className={cn(
                            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0A0A0A]",
                            item.status === 'Active' ? 'bg-green-400' : 'bg-gray-500'
                        )} />
                    </div>

                    <Badge className={cn("text-xs", getStatusColor(item.status))}>
                        {item.status === 'Active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {item.status === 'On Leave' && <Clock className="h-3 w-3 mr-1" />}
                        {item.status}
                    </Badge>
                </div>

                {/* Name and title */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <h3
                            className="font-semibold text-white text-lg leading-tight"
                            dangerouslySetInnerHTML={{
                                __html: highlightText(item.name || 'Unnamed', searchQuery)
                            }}
                        />
                        {isPinned && <Pin className="h-4 w-4 text-yellow-400 fill-current" />}
                        {isFavorite && <Heart className="h-4 w-4 text-red-400 fill-current" />}
                    </div>
                    <p className="text-white/60 text-sm">{item.role || 'No Role Assigned'}</p>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/60">
                        <Building className="h-4 w-4" />
                        <span className="truncate">{item.department || 'Unknown Department'}</span>
                    </div>

                    {item.email && (
                        <div className="flex items-center gap-2 text-white/60">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{item.email}</span>
                        </div>
                    )}

                    {item.phone && (
                        <div className="flex items-center gap-2 text-white/60">
                            <Phone className="h-4 w-4" />
                            <span className="truncate">{item.phone}</span>
                        </div>
                    )}

                    {item.hireDate && (
                        <div className="flex items-center gap-2 text-white/60">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.hireDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag: string, idx: number) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {item.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                                    +{item.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemCard;