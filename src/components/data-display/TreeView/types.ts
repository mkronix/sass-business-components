interface TreeNode {
    id: string;
    name: string;
    type?: string;
    children?: TreeNode[];
    metadata?: Record<string, any>;
    isLoading?: boolean;
}

interface NodeContext {
    isExpanded: boolean;
    isSelected: boolean;
    isHovered: boolean;
    level: number;
    hasChildren: boolean;
    isLoading: boolean;
    path: string[];
}

interface TreeViewProps {
    data: TreeNode[];
    renderNode?: (node: TreeNode, context: NodeContext) => React.ReactNode;
    onNodeClick?: (node: TreeNode) => void;
    onNodeToggle?: (node: TreeNode, isExpanded: boolean) => void;
    onNodeSelect?: (node: TreeNode) => void;
    onLoadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
    onRename?: (node: TreeNode, newName: string) => void;
    onAdd?: (parentNode: TreeNode, name: string, type: string) => void;
    onDelete?: (node: TreeNode) => void;
    onCopy?: (node: TreeNode) => void;
    className?: string;
    allowMultiSelect?: boolean;
    showConnectors?: boolean;
    searchTerm?: string;
}

interface ContextMenuProps {
    x: number;
    y: number;
    node: TreeNode;
    onClose: () => void;
    onRename: () => void;
    onAdd: (type: string) => void;
    onDelete: () => void;
    onCopy: () => void;
}


export type { TreeNode, NodeContext, TreeViewProps, ContextMenuProps };