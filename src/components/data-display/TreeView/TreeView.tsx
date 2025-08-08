import React, { useCallback, useState } from 'react';
import ContextMenu from './ContextMenu';
import TreeNodeComponent from './TreeNodeComponent';
import { TreeViewProps } from './types';
import useTreeState from './useTreeState';
import { findNodeById } from './utils';


const TreeView: React.FC<TreeViewProps> = ({
    data,
    renderNode,
    onNodeClick,
    onNodeToggle,
    onNodeSelect,
    onLoadChildren,
    onRename,
    onAdd,
    onDelete,
    onCopy,
    className = '',
    allowMultiSelect = false,
    showConnectors = false,
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

    const [contextMenu, setContextMenu] = useState<{ nodeId: string; x: number; y: number } | null>(null);
    const [renamingNodeId, setRenamingNodeId] = useState<string | null>(null);

    const handleNodeSelect = useCallback((nodeId: string) => {
        selectNode(nodeId);
        const node = findNodeById(data, nodeId);
        if (node) {
            onNodeSelect?.(node);
        }
    }, [selectNode, onNodeSelect, data]);

    const handleContextMenuAction = (action: string, type?: string) => {
        if (!contextMenu) return;

        const node = findNodeById(data, contextMenu.nodeId);
        if (!node) return;

        switch (action) {
            case 'rename':
                setRenamingNodeId(node.id);
                break;
            case 'add':
                if (type && onAdd) {
                    const newName = type === 'folder' ? 'New Folder' : 'New File';
                    onAdd(node, newName, type);
                }
                break;
            case 'delete':
                onDelete?.(node);
                break;
            case 'copy':
                onCopy?.(node);
                break;
        }
    };

    return (
        <div className={`tree-view relative ${className}`} onMouseLeave={() => setHoveredNode(null)}>
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
                />
            ))}

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    node={findNodeById(data, contextMenu.nodeId)}
                    onClose={() => setContextMenu(null)}
                    onRename={() => handleContextMenuAction('rename')}
                    onAdd={(type) => handleContextMenuAction('add', type)}
                    onDelete={() => handleContextMenuAction('delete')}
                    onCopy={() => handleContextMenuAction('copy')}
                />
            )}
        </div>
    );
};


export default TreeView