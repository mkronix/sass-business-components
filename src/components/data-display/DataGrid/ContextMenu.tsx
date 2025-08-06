
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ContextMenu as UIContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Edit, Copy, Delete, Eye, Share, MoreHorizontal } from 'lucide-react';

interface ContextMenuProps<T = any> {
    x: number;
    y: number;
    item: T;
    onClose: () => void;
    cardRef: HTMLElement;
}

export const ContextMenu = <T extends Record<string, any>>({
    x,
    y,
    item,
    onClose,
    cardRef
}: ContextMenuProps<T>) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const positionMenu = () => {
            if (!menuRef.current || !cardRef) return;

            const menu = menuRef.current;
            const cardRect = cardRef.getBoundingClientRect();
            
            // Position relative to the card
            menu.style.position = 'absolute';
            menu.style.left = `${x}px`;
            menu.style.top = `${y}px`;
            menu.style.zIndex = '50';

            // Ensure menu stays within card bounds
            const menuRect = menu.getBoundingClientRect();
            const rightOverflow = (x + menuRect.width) - cardRect.width;
            const bottomOverflow = (y + menuRect.height) - cardRect.height;

            if (rightOverflow > 0) {
                menu.style.left = `${x - rightOverflow - 10}px`;
            }

            if (bottomOverflow > 0) {
                menu.style.top = `${y - bottomOverflow - 10}px`;
            }
        };

        positionMenu();
    }, [x, y, cardRef]);

    const handleAction = (action: string) => {
        console.log(`Action ${action} on item:`, item);
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                style={{
                    position: 'absolute',
                    left: x,
                    top: y
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="py-1">
                    <button
                        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleAction('view')}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </button>

                    <button
                        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleAction('edit')}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </button>

                    <button
                        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleAction('copy')}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                    </button>

                    <button
                        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleAction('share')}
                    >
                        <Share className="mr-2 h-4 w-4" />
                        Share
                    </button>

                    <div className="my-1 h-px bg-border" />

                    <button
                        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-destructive hover:text-destructive-foreground text-destructive"
                        onClick={() => handleAction('delete')}
                    >
                        <Delete className="mr-2 h-4 w-4" />
                        Delete
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
