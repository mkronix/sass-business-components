import { useCallback, useState } from "react";
import { TreeNode } from "./types";

function useTreeState(initialData: TreeNode[], allowMultiSelect = false) {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

    const toggleNode = useCallback((nodeId: string) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    }, []);

    const selectNode = useCallback((nodeId: string) => {
        setSelectedNodes(prev => {
            if (allowMultiSelect) {
                const newSet = new Set(prev);
                if (newSet.has(nodeId)) {
                    newSet.delete(nodeId);
                } else {
                    newSet.add(nodeId);
                }
                return newSet;
            } else {
                return new Set([nodeId]);
            }
        });
    }, [allowMultiSelect]);

    const setNodeLoading = useCallback((nodeId: string, loading: boolean) => {
        setLoadingNodes(prev => {
            const newSet = new Set(prev);
            if (loading) {
                newSet.add(nodeId);
            } else {
                newSet.delete(nodeId);
            }
            return newSet;
        });
    }, []);

    return {
        expandedNodes,
        selectedNodes,
        hoveredNode,
        loadingNodes,
        toggleNode,
        selectNode,
        setHoveredNode,
        setNodeLoading
    };
}

export default useTreeState;