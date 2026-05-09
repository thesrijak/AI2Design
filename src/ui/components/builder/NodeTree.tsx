import { h } from "preact";

import type { ComponentSetJSON, NodeJSON } from "../../../schema";
import type { ColorTokens } from "../../tokens";
import type { NodePath } from "../../hooks/useBuilderState";
import { SectionHeader } from "./shared/SectionHeader";

type NewNodeType = "FRAME" | "TEXT" | "RECTANGLE" | "ELLIPSE";

interface NodeTreeProps {
  componentSet: ComponentSetJSON;
  variantIndex: number;
  selectedNodePath: NodePath | null;
  expandedNodePaths: Set<string>;
  onSelectNode: (path: NodePath) => void;
  onToggleExpand: (path: NodePath) => void;
  onBuilderChange: (
    updater: (prev: ComponentSetJSON) => ComponentSetJSON,
  ) => void;
  colors: ColorTokens;
}

function pathKey(path: NodePath): string {
  return path.length === 0 ? "root" : path.join(",");
}

const NODE_ICONS: Record<string, string> = {
  FRAME: "⬜",
  TEXT: "T",
  RECTANGLE: "▭",
  ELLIPSE: "○",
};

function defaultNode(type: NewNodeType): NodeJSON {
  switch (type) {
    case "FRAME":
      return {
        type: "FRAME",
        name: "Frame",
        layoutMode: "NONE",
        fills: [],
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        itemSpacing: 0,
      };
    case "TEXT":
      return {
        type: "TEXT",
        name: "Text",
        characters: "Text",
        fills: ["#000000"],
      };
    case "RECTANGLE":
      return {
        type: "RECTANGLE",
        name: "Rect",
        width: 100,
        height: 40,
        fills: [],
      };
    case "ELLIPSE":
      return {
        type: "ELLIPSE",
        name: "Ellipse",
        width: 40,
        height: 40,
        fills: [],
      };
  }
}

/** Navigate path into node tree, returning the node (mutating on set) */
function getNodeAtPath(root: NodeJSON, path: NodePath): NodeJSON | null {
  let current: NodeJSON = root;
  for (const idx of path) {
    const children = (current as { children?: NodeJSON[] }).children;
    if (!children || idx >= children.length) return null;
    current = children[idx];
  }
  return current;
}

/** Immutably insert a child at the end of children at path */
function insertChildAt(
  root: NodeJSON,
  path: NodePath,
  child: NodeJSON,
): NodeJSON {
  if (path.length === 0) {
    const existing = (root as { children?: NodeJSON[] }).children ?? [];
    return { ...root, children: [...existing, child] } as NodeJSON;
  }
  const [head, ...rest] = path;
  const children = ((root as { children?: NodeJSON[] }).children ?? []).map(
    (c, i) => (i === head ? insertChildAt(c, rest, child) : c),
  );
  return { ...root, children } as NodeJSON;
}

/** Immutably remove the node at path from root */
function removeNodeAt(root: NodeJSON, path: NodePath): NodeJSON {
  if (path.length === 0) return root; // can't remove root
  const [...parentPath] = path;
  const idx = parentPath.pop()!;
  const parent = getNodeAtPath(root, parentPath);
  if (!parent) return root;
  const children = (
    (parent as { children?: NodeJSON[] }).children ?? []
  ).filter((_, i) => i !== idx);
  return replaceAt(root, parentPath, { ...parent, children } as NodeJSON);
}

function replaceAt(
  root: NodeJSON,
  path: NodePath,
  replacement: NodeJSON,
): NodeJSON {
  if (path.length === 0) return replacement;
  const [head, ...rest] = path;
  const children = ((root as { children?: NodeJSON[] }).children ?? []).map(
    (c, i) => (i === head ? replaceAt(c, rest, replacement) : c),
  );
  return { ...root, children } as NodeJSON;
}

interface TreeRowProps {
  node: NodeJSON;
  path: NodePath;
  depth: number;
  selected: boolean;
  expanded: boolean;
  hasChildren: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onAddChild: (type: NewNodeType) => void;
  onRemove: (() => void) | null;
  colors: ColorTokens;
}

function TreeRow({
  node,
  path: _path,
  depth,
  selected,
  expanded,
  hasChildren,
  onSelect,
  onToggle,
  onAddChild,
  onRemove,
  colors,
}: TreeRowProps) {
  const isFrame = node.type === "FRAME";
  const icon = NODE_ICONS[node.type] ?? "?";
  const label = node.name || node.type;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: `${8 + depth * 14}px`,
        paddingRight: "4px",
        height: "24px",
        borderRadius: "4px",
        background: selected ? colors.accentMuted : "transparent",
        cursor: "pointer",
        gap: "2px",
      }}
      onClick={onSelect}
    >
      {/* Expand/collapse toggle */}
      <span
        style={{
          width: "14px",
          flexShrink: 0,
          fontSize: "9px",
          color: colors.textMuted,
          textAlign: "center",
          cursor: hasChildren ? "pointer" : "default",
          userSelect: "none",
        }}
        onClick={(e) => {
          if (hasChildren) {
            e.stopPropagation();
            onToggle();
          }
        }}
      >
        {hasChildren ? (expanded ? "▼" : "▶") : ""}
      </span>

      {/* Type icon */}
      <span
        style={{
          fontSize: "10px",
          color: selected ? colors.accent : colors.textMuted,
          width: "14px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>

      {/* Label */}
      <span
        style={{
          flex: 1,
          fontSize: "11px",
          color: selected ? colors.accent : colors.text,
          fontWeight: selected ? 500 : 400,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginLeft: "2px",
        }}
      >
        {label}
      </span>

      {/* Add child (FRAME only) */}
      {isFrame && (
        <select
          title="Add child"
          onChange={(e) => {
            const val = (e.target as HTMLSelectElement).value as NewNodeType;
            if (val) {
              e.stopPropagation();
              onAddChild(val);
              (e.target as HTMLSelectElement).value = "";
            }
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            border: "none",
            background: "transparent",
            color: colors.accent,
            fontSize: "11px",
            fontFamily: "inherit",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            width: "16px",
            appearance: "none",
          }}
        >
          <option value="">+</option>
          <option value="FRAME">Frame</option>
          <option value="TEXT">Text</option>
          <option value="RECTANGLE">Rect</option>
          <option value="ELLIPSE">Ellipse</option>
        </select>
      )}

      {/* Remove (non-root) */}
      {onRemove && (
        <span
          title="Remove node"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            fontSize: "12px",
            color: colors.textMuted,
            cursor: "pointer",
            lineHeight: 1,
            flexShrink: 0,
            padding: "0 2px",
          }}
        >
          ×
        </span>
      )}
    </div>
  );
}

interface TreeBranchProps {
  node: NodeJSON;
  path: NodePath;
  depth: number;
  selectedNodePath: NodePath | null;
  expandedNodePaths: Set<string>;
  onSelectNode: (path: NodePath) => void;
  onToggleExpand: (path: NodePath) => void;
  onBuilderChange: NodeTreeProps["onBuilderChange"];
  variantIndex: number;
  colors: ColorTokens;
}

function TreeBranch({
  node,
  path,
  depth,
  selectedNodePath,
  expandedNodePaths,
  onSelectNode,
  onToggleExpand,
  onBuilderChange,
  variantIndex,
  colors,
}: TreeBranchProps) {
  const key = pathKey(path);
  const expanded = expandedNodePaths.has(key);
  const children = (node as { children?: NodeJSON[] }).children ?? [];
  const hasChildren = children.length > 0;
  const isRoot = path.length === 0;

  const selected =
    selectedNodePath !== null &&
    selectedNodePath.length === path.length &&
    selectedNodePath.every((v, i) => v === path[i]);

  function addChild(type: NewNodeType) {
    const child = defaultNode(type);
    onBuilderChange((prev) => {
      const variants = [...prev.variants];
      const variant = { ...variants[variantIndex] };
      variant.node = insertChildAt(variant.node, path, child);
      variants[variantIndex] = variant;
      return { ...prev, variants };
    });
  }

  function removeNode() {
    onBuilderChange((prev) => {
      const variants = [...prev.variants];
      const variant = { ...variants[variantIndex] };
      variant.node = removeNodeAt(variant.node, path);
      variants[variantIndex] = variant;
      return { ...prev, variants };
    });
    // If we deleted selected node or ancestor, select root
    if (
      selectedNodePath !== null &&
      selectedNodePath.length >= path.length &&
      path.every((v, i) => v === selectedNodePath[i])
    ) {
      onSelectNode([]);
    }
  }

  return (
    <div>
      <TreeRow
        node={node}
        path={path}
        depth={depth}
        selected={selected}
        expanded={expanded}
        hasChildren={hasChildren}
        onSelect={() => onSelectNode(path)}
        onToggle={() => onToggleExpand(path)}
        onAddChild={addChild}
        onRemove={isRoot ? null : removeNode}
        colors={colors}
      />
      {expanded &&
        children.map((child, i) => (
          <TreeBranch
            key={i}
            node={child}
            path={[...path, i]}
            depth={depth + 1}
            selectedNodePath={selectedNodePath}
            expandedNodePaths={expandedNodePaths}
            onSelectNode={onSelectNode}
            onToggleExpand={onToggleExpand}
            onBuilderChange={onBuilderChange}
            variantIndex={variantIndex}
            colors={colors}
          />
        ))}
    </div>
  );
}

export function NodeTree({
  componentSet,
  variantIndex,
  selectedNodePath,
  expandedNodePaths,
  onSelectNode,
  onToggleExpand,
  onBuilderChange,
  colors,
}: NodeTreeProps) {
  const variant = componentSet.variants[variantIndex];
  if (!variant) {
    return (
      <div style={{ fontSize: "11px", color: colors.textMuted }}>
        No variant selected.
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Node Tree" colors={colors} />
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: "6px",
          padding: "4px 0",
          maxHeight: "160px",
          overflowY: "auto",
        }}
      >
        <TreeBranch
          node={variant.node}
          path={[]}
          depth={0}
          selectedNodePath={selectedNodePath}
          expandedNodePaths={expandedNodePaths}
          onSelectNode={onSelectNode}
          onToggleExpand={onToggleExpand}
          onBuilderChange={onBuilderChange}
          variantIndex={variantIndex}
          colors={colors}
        />
      </div>
    </div>
  );
}
