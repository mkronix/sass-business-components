import { useState } from "react";
import TreeView from "./TreeView";
import { TreeNode } from "./types";
import { Input } from "@/components/ui/input";

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
                        {
                            id: 'pages', name: 'pages', type: 'folder',
                            children: [
                                { id: 'index.tsx', name: 'index.tsx', type: 'file' },
                                { id: 'about.tsx', name: 'about.tsx', type: 'file' }
                            ]
                        },
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
            id: `${parentNode.id}-${Date.now()}-${Math.random()}`,
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
        // Simple copy to clipboard functionality
        navigator.clipboard.writeText(node.name).then(() => {
            console.log(`Copied "${node.name}" to clipboard`);
        }).catch(() => {
            console.log('Failed to copy to clipboard');
        });
    };

    return (
        <div className="min-h-screen p-6 space-y-6 bg-background">
            <div className="flex gap-4 items-center">
                <Input
                    type="text"
                    placeholder="Search files and folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 w-72 border border-secondary/30 rounded-lg bg-secondary text-white placeholder:text-gray-400"
                />
            </div>

            <div className="p-4 rounded-lg bg-secondary overflow-hidden max-w-md border border-primary/10">
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