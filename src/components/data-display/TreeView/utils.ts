import { TreeNode } from "./types";
import { CheckSquare, Circle, File, Folder, MessageCircle, Package, Tag } from 'lucide-react';
const DEFAULT_ICONS = {
    folder: Folder,
    file: File,
    product: Package,
    category: Tag,
    comment: MessageCircle,
    task: CheckSquare,
    default: Circle
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

export { findNodeById, shouldShowNode, DEFAULT_ICONS };