import { useState } from "preact/hooks";

export type NodePath = number[]; // [] = variant root; [1, 0] = children[1].children[0]

export interface BuilderUIState {
  selectedVariantIndex: number | null;
  selectedNodePath: NodePath | null;
  expandedNodePaths: Set<string>;
  setSelectedVariant: (i: number) => void;
  setSelectedNode: (path: NodePath | null) => void;
  toggleNodeExpand: (path: NodePath) => void;
  resetSelection: () => void;
}

function pathKey(path: NodePath): string {
  return path.join(",");
}

export function useBuilderState(): BuilderUIState {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    number | null
  >(0);
  const [selectedNodePath, setSelectedNodePath] = useState<NodePath | null>([]);
  const [expandedNodePaths, setExpandedNodePaths] = useState<Set<string>>(
    new Set(["root"]),
  );

  function setSelectedVariant(i: number) {
    setSelectedVariantIndex(i);
    setSelectedNodePath([]); // select variant root on variant switch
  }

  function setSelectedNode(path: NodePath | null) {
    setSelectedNodePath(path);
  }

  function toggleNodeExpand(path: NodePath) {
    const key = path.length === 0 ? "root" : pathKey(path);
    setExpandedNodePaths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function resetSelection() {
    setSelectedVariantIndex(null);
    setSelectedNodePath(null);
  }

  return {
    selectedVariantIndex,
    selectedNodePath,
    expandedNodePaths,
    setSelectedVariant,
    setSelectedNode,
    toggleNodeExpand,
    resetSelection,
  };
}
