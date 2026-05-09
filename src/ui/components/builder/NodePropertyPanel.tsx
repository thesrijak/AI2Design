import { h, Fragment } from "preact";

import type {
  ComponentSetJSON,
  FrameNodeJSON,
  NodeJSON,
  RectangleNodeJSON,
  TextNodeJSON,
} from "../../../schema";
import type { ColorTokens } from "../../tokens";
import type { NodePath } from "../../hooks/useBuilderState";
import { SectionHeader } from "./shared/SectionHeader";
import { CommonFields } from "./panels/CommonFields";
import { FramePanel } from "./panels/FramePanel";
import { TextPanel } from "./panels/TextPanel";
import { RectPanel } from "./panels/RectPanel";

interface NodePropertyPanelProps {
  componentSet: ComponentSetJSON;
  variantIndex: number;
  selectedNodePath: NodePath;
  onBuilderChange: (
    updater: (prev: ComponentSetJSON) => ComponentSetJSON,
  ) => void;
  colors: ColorTokens;
}

function getNodeAtPath(root: NodeJSON, path: NodePath): NodeJSON | null {
  let current: NodeJSON = root;
  for (const idx of path) {
    const children = (current as { children?: NodeJSON[] }).children;
    if (!children || idx >= children.length) return null;
    current = children[idx];
  }
  return current;
}

function replaceNodeAtPath(
  root: NodeJSON,
  path: NodePath,
  replacement: NodeJSON,
): NodeJSON {
  if (path.length === 0) return replacement;
  const [head, ...rest] = path;
  const children = ((root as { children?: NodeJSON[] }).children ?? []).map(
    (c, i) => (i === head ? replaceNodeAtPath(c, rest, replacement) : c),
  );
  return { ...root, children } as NodeJSON;
}

export function NodePropertyPanel({
  componentSet,
  variantIndex,
  selectedNodePath,
  onBuilderChange,
  colors,
}: NodePropertyPanelProps) {
  const variant = componentSet.variants[variantIndex];
  if (!variant) return null;

  const node = getNodeAtPath(variant.node, selectedNodePath);
  if (!node) return null;

  function patchNode(patch: Partial<NodeJSON>) {
    onBuilderChange((prev) => {
      const variants = [...prev.variants];
      const v = { ...variants[variantIndex] };
      const updated = { ...getNodeAtPath(v.node, selectedNodePath)!, ...patch };
      v.node = replaceNodeAtPath(v.node, selectedNodePath, updated as NodeJSON);
      variants[variantIndex] = v;
      return { ...prev, variants };
    });
  }

  const title =
    selectedNodePath.length === 0
      ? `${node.type} (root)`
      : `${node.type}${node.name ? ` — ${node.name}` : ""}`;

  return (
    <div>
      <SectionHeader title={title} colors={colors} />
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: "6px",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <CommonFields
          node={node}
          onUpdate={(patch) => patchNode(patch as Partial<NodeJSON>)}
          colors={colors}
        />

        {node.type === "FRAME" && (
          <>
            <div
              style={{
                borderTop: `1px solid ${colors.borderSubtle}`,
                margin: "6px 0",
              }}
            />
            <FramePanel
              node={node as FrameNodeJSON}
              onUpdate={(patch) => patchNode(patch as Partial<NodeJSON>)}
              colors={colors}
            />
          </>
        )}

        {node.type === "TEXT" && (
          <>
            <div
              style={{
                borderTop: `1px solid ${colors.borderSubtle}`,
                margin: "6px 0",
              }}
            />
            <TextPanel
              node={node as TextNodeJSON}
              onUpdate={(patch) => patchNode(patch as Partial<NodeJSON>)}
              colors={colors}
            />
          </>
        )}

        {node.type === "RECTANGLE" && (
          <>
            <div
              style={{
                borderTop: `1px solid ${colors.borderSubtle}`,
                margin: "6px 0",
              }}
            />
            <RectPanel
              node={node as RectangleNodeJSON}
              onUpdate={(patch) => patchNode(patch as Partial<NodeJSON>)}
              colors={colors}
            />
          </>
        )}
      </div>
    </div>
  );
}
