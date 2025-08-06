
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { GridColumn, DensityMode } from './types';
import { cn } from '@/lib/utils';

interface DataGridCardProps<T = any> {
    item: T;
    index: number;
    columns: GridColumn<T>[];
    isSelected: boolean;
    onSelect: () => void;
    onClick: () => void;
    onDoubleClick: () => void;
    onContextMenu: (e: React.MouseEvent, cardRef: HTMLElement) => void;
    enableSelection: boolean;
    enableContextMenu: boolean;
    density: DensityMode;
}

export const DataGridCard = <T extends Record<string, any>>({
    item,
    index,
    columns,
    isSelected,
    onSelect,
    onClick,
    onDoubleClick,
    onContextMenu,
    enableSelection,
    enableContextMenu,
    density
}: DataGridCardProps<T>) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.95,
            y: 20
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        hover: { 
            scale: 1.02,
            y: -4,
            transition: { 
                duration: 0.2,
                ease: "easeOut"
            }
        },
        selected: {
            scale: 1.01,
            boxShadow: "0 0 0 2px hsl(var(--primary))",
            transition: { duration: 0.2 }
        }
    };

    const densityClasses = {
        compact: 'p-3',
        standard: 'p-4',
        comfortable: 'p-6'
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        if (enableContextMenu && cardRef.current) {
            onContextMenu(e, cardRef.current);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (e.detail === 2) {
            onDoubleClick();
        } else {
            onClick();
        }
    };

    const renderFieldValue = (column: GridColumn<T>, value: any) => {
        if (column.cellRenderer) {
            return column.cellRenderer({
                value,
                row: item,
                column,
                rowIndex: index,
                columnIndex: 0,
                isEditing: false,
                startEdit: () => {},
                stopEdit: () => {},
                api: {} as any
            });
        }

        if (column.format) {
            return column.format(value);
        }

        switch (column.type) {
            case 'boolean':
                return (
                    <Badge variant={value ? 'default' : 'secondary'}>
                        {value ? 'Yes' : 'No'}
                    </Badge>
                );
            case 'date':
                return value instanceof Date ? value.toLocaleDateString() : value;
            case 'number':
                return typeof value === 'number' ? value.toLocaleString() : value;
            case 'select':
                const option = column.options?.find(opt => opt.value === value);
                return option ? (
                    <Badge variant="outline">{option.label}</Badge>
                ) : value;
            default:
                return value;
        }
    };

    const primaryField = columns.find(col => col.field === 'name' || col.field === 'title') || columns[0];
    const secondaryFields = columns.filter(col => 
        col.field !== primaryField.field && 
        !col.hidden && 
        col.field !== 'id'
    ).slice(0, density === 'compact' ? 2 : density === 'standard' ? 4 : 6);

    return (
        <motion.div
            ref={cardRef}
            variants={cardVariants}
            initial="hidden"
            animate={isSelected ? "selected" : "visible"}
            whileHover="hover"
            layout
        >
            <Card 
                className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
                    isSelected 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-border hover:border-primary/50",
                    "relative overflow-hidden group"
                )}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            >
                {enableSelection && (
                    <div className="absolute top-3 left-3 z-10">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={onSelect}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-background border-2"
                        />
                    </div>
                )}

                <CardContent className={cn(densityClasses[density], enableSelection && "pl-10")}>
                    <div className="space-y-3">
                        {/* Primary Field - Title */}
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                                {renderFieldValue(primaryField, item[primaryField.field])}
                            </h3>
                            {item.id && (
                                <p className="text-xs text-muted-foreground">
                                    ID: {item.id}
                                </p>
                            )}
                        </div>

                        {/* Secondary Fields */}
                        <div className="space-y-2">
                            {secondaryFields.map((column) => (
                                <div key={column.id} className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground font-medium">
                                        {column.title}:
                                    </span>
                                    <div className="text-sm text-foreground text-right">
                                        {renderFieldValue(column, item[column.field])}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hover Indicator */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        {/* Selection Indicator */}
                        {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
