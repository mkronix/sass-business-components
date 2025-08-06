
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataGridProps, SortConfig, FilterConfig, ColumnState } from './types';
import { DataGridToolbar } from './DataGridToolbar';
import { DataGridCard } from './DataGridCard';
import { FilterModal } from './FilterModal';
import { ContextMenu } from './ContextMenu';
import { useDataGridState } from './useDataGridState';
import { cn } from '@/lib/utils';

export const DataGrid = <T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    enableRowSelection = false,
    enableMultiSelect = false,
    enableInlineEditing = false,
    enableBulkOperations = false,
    enableExport = false,
    enableContextMenu = false,
    pagination = true,
    pageSize = 50,
    density = 'standard',
    className,
    onCellEdit,
    onSelectionChange,
    onRowClick,
    onRowDoubleClick,
    customFooter,
    ...props
}: DataGridProps<T>) => {
    const {
        filteredData,
        selectedRows,
        sortConfig,
        filters,
        searchTerm,
        currentPage,
        highlightedData,
        handleSort,
        handleFilter,
        handleSearch,
        handleSelectRow,
        handleSelectAll,
        clearSelection,
        setCurrentPage
    } = useDataGridState({
        data,
        columns,
        pageSize,
        enableMultiSelect,
        onSelectionChange
    });

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        item: T | null;
        cardRef?: HTMLElement;
    }>({
        visible: false,
        x: 0,
        y: 0,
        item: null
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = pagination 
        ? filteredData.slice(startIndex, startIndex + pageSize)
        : filteredData;

    const handleContextMenu = (e: React.MouseEvent, item: T, cardRef: HTMLElement) => {
        if (!enableContextMenu) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const cardRect = cardRef.getBoundingClientRect();
        const clickX = e.clientX - cardRect.left;
        const clickY = e.clientY - cardRect.top;
        
        setContextMenu({
            visible: true,
            x: clickX,
            y: clickY,
            item,
            cardRef
        });
    };

    const closeContextMenu = () => {
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenu.visible) {
                closeContextMenu();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [contextMenu.visible]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    if (loading) {
        return (
            <div className={cn("space-y-4", className)}>
                <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-gray-200 rounded-lg" />
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            <DataGridToolbar
                searchTerm={searchTerm}
                onSearch={handleSearch}
                filters={filters}
                onFilter={handleFilter}
                columns={columns}
                selectedCount={selectedRows.length}
                totalCount={data.length}
                onSelectAll={handleSelectAll}
                onClearSelection={clearSelection}
                onOpenFilterModal={() => setIsFilterModalOpen(true)}
                enableBulkOperations={enableBulkOperations}
                enableExport={enableExport}
                enableRowSelection={enableRowSelection}
            />

            <motion.div
                className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {paginatedData.map((item, index) => (
                        <DataGridCard
                            key={item.id || index}
                            item={item}
                            index={startIndex + index}
                            columns={columns}
                            isSelected={selectedRows.includes(item)}
                            onSelect={() => handleSelectRow(item)}
                            onClick={() => onRowClick?.(item, {} as React.MouseEvent)}
                            onDoubleClick={() => onRowDoubleClick?.(item, {} as React.MouseEvent)}
                            onContextMenu={(e, cardRef) => handleContextMenu(e, item, cardRef)}
                            enableSelection={enableRowSelection}
                            enableContextMenu={enableContextMenu}
                            density={density}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                columns={columns}
                filters={filters}
                onFilter={handleFilter}
            />

            {contextMenu.visible && contextMenu.item && contextMenu.cardRef && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    item={contextMenu.item}
                    onClose={closeContextMenu}
                    cardRef={contextMenu.cardRef}
                />
            )}

            {customFooter}
        </div>
    );
};
