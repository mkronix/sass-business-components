interface TreeNode {
    id: string;
    name: string;
    type?: string;
    children?: TreeNode[];
    metadata?: Record<string, any>;
    isLoading?: boolean;
}

interface TreeViewProps {
    data: TreeNode[];
    renderNode?: (node: TreeNode, context: NodeContext) => React.ReactNode;
    onNodeClick?: (node: TreeNode) => void;
    onNodeToggle?: (node: TreeNode, isExpanded: boolean) => void;
    onNodeSelect?: (node: TreeNode) => void;
    onLoadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
    className?: string;
    allowMultiSelect?: boolean;
    showConnectors?: boolean;
    animated?: boolean;
    searchTerm?: string;
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

export type { TreeNode, TreeViewProps, NodeContext };