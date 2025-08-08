import { Copy, Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef } from "react";
import { ContextMenuProps } from "./types";
const ContextMenu: React.FC<ContextMenuProps> = ({
    x,
    y,
    node,
    onClose,
    onRename,
    onAdd,
    onDelete,
    onCopy
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const menuItems = [
        { icon: Edit, label: 'Rename', action: onRename },
        { icon: Plus, label: 'Add File', action: () => onAdd('file') },
        { icon: Plus, label: 'Add Folder', action: () => onAdd('folder') },
        { icon: Copy, label: 'Copy', action: onCopy },
        { icon: Trash2, label: 'Delete', action: onDelete, dangerous: true }
    ];

    return (
        <div
            ref={menuRef}
            className="fixed z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[140px]"
            style={{ left: x, top: y }}
        >
            {menuItems.map((item, index) => (
                <button
                    key={index}
                    onClick={() => {
                        item.action();
                        onClose();
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${item.dangerous
                        ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default ContextMenu;