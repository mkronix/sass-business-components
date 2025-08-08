import { ChevronDown, ChevronRight } from "lucide-react";
import { memo } from "react";
import RenameInput from "./RenameInput";
import { NodeContext, TreeNode } from "./types";
import { DEFAULT_ICONS } from "./utils";

const DefaultNodeRenderer: React.FC<{
    node: TreeNode;
    context: NodeContext;
    onToggle: () => void;
    onSelect: () => void;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    showConnectors: boolean;
    isRenaming: boolean;
    onRename: (newName: string) => void;
    onCancelRename: () => void;
}> = memo(({
    node,
    context,
    onToggle,
    onSelect,
    onClick,
    onContextMenu,
    showConnectors,
    isRenaming,
    onRename,
    onCancelRename
}) => {
    const IconComponent = DEFAULT_ICONS[node.type as keyof typeof DEFAULT_ICONS] || DEFAULT_ICONS.default;

    return (
        <div
            className={`
        flex items-center py-2 px-3 rounded-md cursor-pointer group
        transition-colors duration-150 ease-in-out
        ${context.isSelected ? 'bg-primary/10 border border-primary/30' : ''}
        ${context.isHovered && !context.isSelected ? 'bg-primary/10' : ''}
        hover:bg-primary/10 border border-transparent
      `}
            style={{ paddingLeft: `${context.level * 20 + 12}px` }}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {/* Expand/Collapse Button */}
            <div className="flex items-center justify-center w-4 h-4 mr-3">
                {context.hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                        className="p-0.5 rounded hover:bg-primary/30 transition-colors"
                    >
                        {context.isLoading ? (
                            <div className="w-3 h-3 border border-primary/50 border-t-transparent rounded-full animate-spin" />
                        ) : context.isExpanded ? (
                            <ChevronDown className="w-3 h-3 text-primborder-primary/50" />
                        ) : (
                            <ChevronRight className="w-3 h-3 text-primborder-primary/50" />
                        )}
                    </button>
                )}
            </div>

            {/* Node Icon */}
            <IconComponent className="w-4 h-4 mr-3 text-primary flex-shrink-0" />

            {/* Node Label or Rename Input */}
            {isRenaming ? (
                <RenameInput
                    initialValue={node.name}
                    onSave={onRename}
                    onCancel={onCancelRename}
                />
            ) : (
                <span className="flex-1 text-sm text-primary truncate">
                    {node.name}
                </span>
            )}
        </div>
    );
});

export default DefaultNodeRenderer;