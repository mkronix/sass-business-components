import React, { memo, useCallback, useEffect } from "react";
import DefaultNodeRenderer from "./DefaultNodeRenderer";
import InlineAddInput from "./InlineAddInput";
import { NodeContext, TreeNode } from "./types";
import { shouldShowNode } from "./utils";

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
    onRename?: (node: TreeNode, newName: string) => void;
    onAdd?: (parentNode: TreeNode, name: string, type: string) => void;
    onDelete?: (node: TreeNode) => void;
    onCopy?: (node: TreeNode) => void;
    renderNode?: (node: TreeNode, context: NodeContext) => React.ReactNode;
    showConnectors: boolean;
    searchTerm?: string;
    setNodeLoading: (nodeId: string, loading: boolean) => void;
    contextMenu: { nodeId: string; x: number; y: number } | null;
    setContextMenu: (menu: { nodeId: string; x: number; y: number } | null) => void;
    renamingNodeId: string | null;
    setRenamingNodeId: (nodeId: string | null) => void;
    addingToNode: { parentNodeId: string; type: 'file' | 'folder' } | null;
    onAddConfirm: (name: string) => void;
    onAddCancel: () => void;
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
    onRename,
    onAdd,
    onDelete,
    onCopy,
    renderNode,
    showConnectors,
    searchTerm,
    setNodeLoading,
    contextMenu,
    setContextMenu,
    renamingNodeId,
    setRenamingNodeId,
    addingToNode,
    onAddConfirm,
    onAddCancel
}) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodes.has(node.id);
    const isHovered = hoveredNode === node.id;
    const isLoading = loadingNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const currentPath = [...path, node.id];
    const isRenaming = renamingNodeId === node.id;
    const isAddingToThis = addingToNode?.parentNodeId === node.id;

    const searchResult = shouldShowNode(node, searchTerm);
    const { showNode, hasMatchingDescendants } = searchResult;

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

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            nodeId: node.id,
            x: e.clientX,
            y: e.clientY
        });
    }, [node.id, setContextMenu]);

    const handleRename = useCallback((newName: string) => {
        onRename?.(node, newName);
        setRenamingNodeId(null);
    }, [node, onRename, setRenamingNodeId]);

    useEffect(() => {
        if (shouldAutoExpand) {
            onToggle(node.id);
        }
    }, [shouldAutoExpand, node.id, onToggle]);

    if (!showNode) {
        return null;
    }

    return (
        <div className="group">
            {renderNode ? (
                renderNode(node, context)
            ) : (
                <DefaultNodeRenderer
                    node={node}
                    context={context}
                    onToggle={handleToggle}
                    onSelect={handleSelect}
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                    showConnectors={showConnectors}
                    isRenaming={isRenaming}
                    onRename={handleRename}
                    onCancelRename={() => setRenamingNodeId(null)}
                />
            )}

            {/* Inline Add Input - shows right after the parent node when adding */}
            {isAddingToThis && (
                <InlineAddInput
                    type={addingToNode.type}
                    level={level + 1}
                    onSave={onAddConfirm}
                    onCancel={onAddCancel}
                />
            )}

            {/* Children */}
            {isExpanded && hasChildren && (
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
                            onRename={onRename}
                            onAdd={onAdd}
                            onDelete={onDelete}
                            onCopy={onCopy}
                            renderNode={renderNode}
                            showConnectors={showConnectors}
                            searchTerm={searchTerm}
                            setNodeLoading={setNodeLoading}
                            contextMenu={contextMenu}
                            setContextMenu={setContextMenu}
                            renamingNodeId={renamingNodeId}
                            setRenamingNodeId={setRenamingNodeId}
                            addingToNode={addingToNode}
                            onAddConfirm={onAddConfirm}
                            onAddCancel={onAddCancel}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default TreeNodeComponent;