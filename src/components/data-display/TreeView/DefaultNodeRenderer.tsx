import { memo } from "react";
import { NodeContext, TreeNode } from "./types";
import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import RenameInput from "./RenameInput";
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
        ${context.isSelected ? 'bg-blue-600/20 border border-blue-500/30' : ''}
        ${context.isHovered && !context.isSelected ? 'bg-gray-700/50' : ''}
        hover:bg-gray-700/50 border border-transparent
      `}
            style={{ paddingLeft: `${context.level * 20 + 12}px` }}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {/* Connector lines */}
            {showConnectors && context.level > 0 && (
                <div className="absolute left-0 top-0 bottom-0 flex items-center">
                    {Array.from({ length: context.level }, (_, i) => (
                        <div
                            key={i}
                            className="w-px h-full bg-gray-600"
                            style={{ left: `${(i + 1) * 20 - 10}px` }}
                        />
                    ))}
                </div>
            )}

            {/* Expand/Collapse Button */}
            <div className="flex items-center justify-center w-4 h-4 mr-3">
                {context.hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                        className="p-0.5 rounded hover:bg-gray-600/50 transition-colors"
                    >
                        {context.isLoading ? (
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : context.isExpanded ? (
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        ) : (
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                    </button>
                )}
            </div>

            {/* Node Icon */}
            <IconComponent className="w-4 h-4 mr-3 text-gray-300 flex-shrink-0" />

            {/* Node Label or Rename Input */}
            {isRenaming ? (
                <RenameInput
                    initialValue={node.name}
                    onSave={onRename}
                    onCancel={onCancelRename}
                />
            ) : (
                <span className="flex-1 text-sm text-gray-200 truncate">
                    {node.name}
                </span>
            )}

            {/* Node Actions */}
            <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className="p-1.5 rounded hover:bg-gray-600/50 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        onContextMenu(e);
                    }}
                >
                    <MoreVertical className="w-3 h-3 text-gray-400" />
                </button>
            </div>

            {/* Metadata badges */}
            {node.metadata?.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-700/50 text-gray-300 rounded-full border border-gray-600/50">
                    {node.metadata.badge}
                </span>
            )}
        </div>
    );
});

export default DefaultNodeRenderer;