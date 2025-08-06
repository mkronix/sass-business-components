import { CheckSquare, ChevronDown, ChevronRight, Circle, File, Folder, MessageCircle, MoreHorizontal, Package, Tag } from 'lucide-react';
import React, { memo, useCallback } from 'react'
import { NodeContext, TreeNode, TreeViewProps } from './types';
import { AnimatePresence, motion } from 'framer-motion'
import useTreeState from './useTreeState';

const DEFAULT_ICONS = {
    folder: Folder,
    file: File,
    product: Package,
    category: Tag,
    comment: MessageCircle,
    task: CheckSquare,
    default: Circle
};

const nodeVariants = {
    hover: { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
    selected: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
    tap: { scale: 0.98 }
};

const treeVariants = {
    expanded: {
        height: 'auto',
        opacity: 1,
        transition: {
            height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
            opacity: { duration: 0.15, delay: 0.05 }
        }
    },
    collapsed: {
        height: 0,
        opacity: 0,
        transition: {
            height: { duration: 0.2, ease: [0.4, 0, 0.6, 1] as const },
            opacity: { duration: 0.1 }
        }
    }
};

function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

const DefaultNodeRenderer: React.FC<{
    node: TreeNode;
    context: NodeContext;
    onToggle: () => void;
    onSelect: () => void;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    showConnectors: boolean;
}> = memo(({
    node,
    context,
    onToggle,
    onSelect,
    onClick,
    onMouseEnter,
    onMouseLeave,
    showConnectors
}) => {
    const IconComponent = DEFAULT_ICONS[node.type as keyof typeof DEFAULT_ICONS] || DEFAULT_ICONS.default;

    return (
        <motion.div
            variants={nodeVariants}
            whileHover="hover"
            whileTap="tap"
            animate={context.isSelected ? "selected" : ""}
            className={`
        flex items-center py-1.5 px-2 rounded-md cursor-pointer
        transition-colors duration-150 ease-in-out
        ${context.isSelected ? 'bg-primary-custom border border-secondary-custom' : ''}
        ${context.isHovered ? 'bg-accent-secondary' : ''}
      `}
            style={{ paddingLeft: `${context.level * 20 + 8}px` }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {/* Connector lines */}
            {showConnectors && context.level > 0 && (
                <div className="absolute left-0 top-0 bottom-0 flex items-center">
                    {Array.from({ length: context.level }, (_, i) => (
                        <div
                            key={i}
                            className="w-px h-full bg-accent-primary"
                            style={{ left: `${(i + 1) * 20 - 10}px` }}
                        />
                    ))}
                </div>
            )}

            {/* Expand/Collapse Button */}
            <div className="flex items-center justify-center w-4 h-4 mr-2">
                {context.hasChildren && (
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-0.5 rounded hover:bg-accent-primary transition-colors"
                    >
                        {context.isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-3 h-3 border border-border border-t-transparent rounded-full"
                            />
                        ) : context.isExpanded ? (
                            <ChevronDown className="w-3 h-3 text-primary-custom" />
                        ) : (
                            <ChevronRight className="w-3 h-3 text-primary-custom" />
                        )}
                    </motion.button>
                )}
            </div>

            {/* Node Icon */}
            <IconComponent className="w-4 h-4 mr-2 text-primary-custom flex-shrink-0" />

            {/* Node Label */}
            <span className="flex-1 text-sm text-primary-custom truncate">
                {node.name}
            </span>

            {/* Node Actions */}
            <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Handle node actions
                    }}
                >
                    <MoreHorizontal className="w-3 h-3 text-primary-custom" />
                </button>
            </div>

            {/* Metadata badges */}
            {node.metadata?.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-secondary-custom text-secondary-custom rounded-full">
                    {node.metadata.badge}
                </span>
            )}
        </motion.div>
    );
});

function shouldShowNode(node: TreeNode, searchTerm: string | undefined): {
    showNode: boolean;
    hasMatchingDescendants: boolean;
    isDirectMatch: boolean;
} {
    if (!searchTerm || searchTerm.trim() === '') {
        return { showNode: true, hasMatchingDescendants: false, isDirectMatch: false };
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const isDirectMatch = node.name.toLowerCase().includes(searchLower);

    // Check if any descendants match
    let hasMatchingDescendants = false;
    if (node.children) {
        for (const child of node.children) {
            const childResult = shouldShowNode(child, searchTerm);
            if (childResult.showNode) {
                hasMatchingDescendants = true;
                break;
            }
        }
    }

    const showNode = isDirectMatch || hasMatchingDescendants;

    return { showNode, hasMatchingDescendants, isDirectMatch };
}

const TreeNodeComponent: React.FC<{
    node: TreeNode;
    level: number;
    path: string[];
    expandedNodes: Set<string>;
    selectedNodes: Set<string>;
    hoveredNode: string | null;
    loadingNodes: Set<string>;
    onToggle: (nodeId: string) => void;
    onSelect: (nodeId: string) => void;
    onHover: (nodeId: string | null) => void;
    onNodeClick?: (node: TreeNode) => void;
    onNodeToggle?: (node: TreeNode, isExpanded: boolean) => void;
    onLoadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
    renderNode?: (node: TreeNode, context: NodeContext) => React.ReactNode;
    showConnectors: boolean;
    animated: boolean;
    searchTerm?: string;
    setNodeLoading: (nodeId: string, loading: boolean) => void;
}> = memo(({
    node,
    level,
    path,
    expandedNodes,
    selectedNodes,
    hoveredNode,
    loadingNodes,
    onToggle,
    onSelect,
    onHover,
    onNodeClick,
    onNodeToggle,
    onLoadChildren,
    renderNode,
    showConnectors,
    animated,
    searchTerm,
    setNodeLoading
}) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodes.has(node.id);
    const isHovered = hoveredNode === node.id;
    const isLoading = loadingNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const currentPath = [...path, node.id];

    // Enhanced search logic
    const searchResult = shouldShowNode(node, searchTerm);
    const { showNode, hasMatchingDescendants, isDirectMatch } = searchResult;

    // Auto-expand nodes that have matching descendants when searching
    const shouldAutoExpand = searchTerm && hasMatchingDescendants && !isExpanded;

    const context: NodeContext = {
        isExpanded,
        isSelected,
        isHovered,
        level,
        hasChildren: hasChildren || false,
        isLoading,
        path: currentPath
    };

    const handleToggle = useCallback(async () => {
        if (onLoadChildren && !node.children && !isLoading) {
            setNodeLoading(node.id, true);
            try {
                const children = await onLoadChildren(node);
                // In a real app, you'd update the tree data here
                node.children = children;
            } catch (error) {
                console.error('Failed to load children:', error);
            } finally {
                setNodeLoading(node.id, false);
            }
        }

        onToggle(node.id);
        onNodeToggle?.(node, !isExpanded);
    }, [node, isExpanded, isLoading, onToggle, onNodeToggle, onLoadChildren, setNodeLoading]);

    const handleSelect = useCallback(() => {
        onSelect(node.id);
    }, [node.id, onSelect]);

    const handleClick = useCallback(() => {
        handleSelect();
        onNodeClick?.(node);
    }, [handleSelect, onNodeClick, node]);

    const handleMouseEnter = useCallback(() => {
        onHover(node.id);
    }, [node.id, onHover]);

    const handleMouseLeave = useCallback(() => {
        onHover(null);
    }, [onHover]);

    // Auto-expand when search has matching descendants
    React.useEffect(() => {
        if (shouldAutoExpand) {
            onToggle(node.id);
        }
    }, [shouldAutoExpand, node.id, onToggle]);

    // Don't render if node doesn't match search criteria
    if (!showNode) {
        return null;
    }

    return (
        <div className="group">
            {/* Node Content */}
            {renderNode ? (
                renderNode(node, context)
            ) : (
                <DefaultNodeRenderer
                    node={node}
                    context={context}
                    onToggle={handleToggle}
                    onSelect={handleSelect}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    showConnectors={showConnectors}
                />
            )}

            {/* Children */}
            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={animated ? "collapsed" : undefined}
                        animate={animated ? "expanded" : undefined}
                        exit={animated ? "collapsed" : undefined}
                        variants={animated ? treeVariants : undefined}
                        className="overflow-hidden"
                    >
                        <div className="ml-0">
                            {node.children?.map((child) => (
                                <TreeNodeComponent
                                    key={child.id}
                                    node={child}
                                    level={level + 1}
                                    path={currentPath}
                                    expandedNodes={expandedNodes}
                                    selectedNodes={selectedNodes}
                                    hoveredNode={hoveredNode}
                                    loadingNodes={loadingNodes}
                                    onToggle={onToggle}
                                    onSelect={onSelect}
                                    onHover={onHover}
                                    onNodeClick={onNodeClick}
                                    onNodeToggle={onNodeToggle}
                                    onLoadChildren={onLoadChildren}
                                    renderNode={renderNode}
                                    showConnectors={showConnectors}
                                    animated={animated}
                                    searchTerm={searchTerm}
                                    setNodeLoading={setNodeLoading}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

const TreeView: React.FC<TreeViewProps> = ({
    data,
    renderNode,
    onNodeClick,
    onNodeToggle,
    onNodeSelect,
    onLoadChildren,
    className = '',
    allowMultiSelect = false,
    showConnectors = false,
    animated = true,
    searchTerm
}) => {
    const {
        expandedNodes,
        selectedNodes,
        hoveredNode,
        loadingNodes,
        toggleNode,
        selectNode,
        setHoveredNode,
        setNodeLoading
    } = useTreeState(data, allowMultiSelect);

    const handleNodeSelect = useCallback((nodeId: string) => {
        selectNode(nodeId);
        const node = findNodeById(data, nodeId);
        if (node) {
            onNodeSelect?.(node);
        }
    }, [selectNode, onNodeSelect, data]);

    return (
        <div className={`tree-view ${className}`}>
            {data.map((node) => (
                <TreeNodeComponent
                    key={node.id}
                    node={node}
                    level={0}
                    path={[]}
                    expandedNodes={expandedNodes}
                    selectedNodes={selectedNodes}
                    hoveredNode={hoveredNode}
                    loadingNodes={loadingNodes}
                    onToggle={toggleNode}
                    onSelect={handleNodeSelect}
                    onHover={setHoveredNode}
                    onNodeClick={onNodeClick}
                    onNodeToggle={onNodeToggle}
                    onLoadChildren={onLoadChildren}
                    renderNode={renderNode}
                    showConnectors={showConnectors}
                    animated={animated}
                    searchTerm={searchTerm}
                    setNodeLoading={setNodeLoading}
                />
            ))}
        </div>
    );
};

export default TreeView