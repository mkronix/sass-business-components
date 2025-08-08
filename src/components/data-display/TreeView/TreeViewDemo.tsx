import { useState } from "react";
import TreeView from "./TreeView";
import { TreeNode } from "./types";

const TreeViewDemo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [treeData, setTreeData] = useState([
        {
            id: 'root',
            name: 'Project Root',
            type: 'folder',
            metadata: { badge: '4 items' },
            children: [
                {
                    id: 'src',
                    name: 'src',
                    type: 'folder',
                    children: [
                        { id: 'app.tsx', name: 'App.tsx', type: 'file' },
                        { id: 'index.tsx', name: 'index.tsx', type: 'file' },
                        {
                            id: 'components',
                            name: 'components',
                            type: 'folder',
                            children: [
                                { id: 'tree.tsx', name: 'TreeView.tsx', type: 'file' },
                                { id: 'button.tsx', name: 'Button.tsx', type: 'file' }
                            ]
                        }
                    ]
                },
                {
                    id: 'public',
                    name: 'public',
                    type: 'folder',
                    children: [
                        { id: 'index.html', name: 'index.html', type: 'file' }
                    ]
                },
                { id: 'package.json', name: 'package.json', type: 'file' }
            ]
        }
    ]);

    const handleRename = (node: TreeNode, newName: string) => {
        const updateNode = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map(n => {
                if (n.id === node.id) {
                    return { ...n, name: newName };
                }
                if (n.children) {
                    return { ...n, children: updateNode(n.children) };
                }
                return n;
            });
        };
        setTreeData(updateNode(treeData));
    };

    const handleAdd = (parentNode: TreeNode, name: string, type: string) => {
        const newNode: TreeNode = {
            id: `${parentNode.id}-${Date.now()}`,
            name,
            type,
            children: type === 'folder' ? [] : undefined
        };

        const addToNode = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map(n => {
                if (n.id === parentNode.id) {
                    return {
                        ...n,
                        children: [...(n.children || []), newNode]
                    };
                }
                if (n.children) {
                    return { ...n, children: addToNode(n.children) };
                }
                return n;
            });
        };

        setTreeData(addToNode(treeData));
    };

    const handleDelete = (node: TreeNode) => {
        const removeNode = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.filter(n => n.id !== node.id).map(n => ({
                ...n,
                children: n.children ? removeNode(n.children) : undefined
            }));
        };
        setTreeData(removeNode(treeData));
    };

    const handleCopy = (node: TreeNode) => {
        console.log('Copied node:', node.name);
        // You could implement actual clipboard functionality here
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6 space-y-6">
            <div className="flex gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-400">
                    Right-click nodes for context menu
                </span>
            </div>

            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 overflow-hidden">
                <TreeView
                    data={treeData}
                    onNodeClick={(node) => console.log('Clicked:', node.name)}
                    onNodeSelect={(node) => console.log('Selected:', node.name)}
                    onRename={handleRename}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                    searchTerm={searchTerm}
                    showConnectors={true}
                />
            </div>
        </div>
    );
};

export default TreeViewDemo;