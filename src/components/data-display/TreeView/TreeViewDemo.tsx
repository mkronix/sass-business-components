import { useState } from "react";
import TreeView from "./TreeView";
import { TreeNode } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TreeViewDemo: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data for different use cases
    const fileSystemData: TreeNode[] = [
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
    ];

    const productData: TreeNode[] = [
        {
            id: 'electronics',
            name: 'Electronics',
            type: 'category',
            metadata: { badge: '24 items' },
            children: [
                {
                    id: 'phones',
                    name: 'Mobile Phones',
                    type: 'category',
                    metadata: { badge: '12 items' },
                    children: [
                        { id: 'iphone', name: 'iPhone 15', type: 'product', metadata: { price: '$999' } },
                        { id: 'samsung', name: 'Galaxy S24', type: 'product', metadata: { price: '$899' } }
                    ]
                },
                {
                    id: 'laptops',
                    name: 'Laptops',
                    type: 'category',
                    metadata: { badge: '8 items' },
                    children: [
                        { id: 'macbook', name: 'MacBook Pro', type: 'product', metadata: { price: '$1999' } },
                        { id: 'dell', name: 'Dell XPS', type: 'product', metadata: { price: '$1299' } }
                    ]
                }
            ]
        }
    ];

    const [currentData, setCurrentData] = useState(fileSystemData);
    const [currentMode, setCurrentMode] = useState('filesystem');

    const handleModeChange = (mode: string) => {
        setCurrentMode(mode);
        setCurrentData(mode === 'filesystem' ? fileSystemData : productData);
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex gap-2">
                    <Button className={`w-full ${currentMode === 'filesystem' ? 'accent-primary-custom' : 'accent-secondary-custom'} accent-primary-custom hover-secondary-custom transition-colors`}
                        onClick={() => handleModeChange('filesystem')}

                    >
                        File System
                    </Button>
                    <Button className={`w-full ${currentMode === 'products' ? 'accent-primary-custom' : 'accent-secondary-custom'} accent-primary-custom hover-secondary-custom transition-colors`}
                        onClick={() => handleModeChange('products')}
                    >
                        Product Catalog
                    </Button>
                </div>
                <Input
                    type="text"
                    placeholder="Search nodes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                <div className="border border-primary-custom rounded-lg p-4 w-full">
                    <TreeView
                        data={currentData}
                        onNodeClick={(node) => console.log('Clicked:', node.name)}
                        onNodeSelect={(node) => console.log('Selected:', node.name)}
                        searchTerm={searchTerm}
                        animated={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default TreeViewDemo;