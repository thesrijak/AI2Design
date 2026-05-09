import { h } from "preact";

import type { ColorTokens } from "../../tokens";

type Tab = "builder" | "json";

interface TabBarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  colors: ColorTokens;
}

export function TabBar({ currentTab, onTabChange, colors }: TabBarProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "builder", label: "Builder" },
    { id: "json", label: "JSON" },
  ];

  return (
    <div
      style={{
        display: "flex",
        borderBottom: `1px solid ${colors.border}`,
        flexShrink: 0,
      }}
    >
      {tabs.map(({ id, label }) => {
        const active = currentTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              flex: 1,
              height: "36px",
              border: "none",
              borderBottom: active
                ? `2px solid ${colors.accent}`
                : "2px solid transparent",
              background: "transparent",
              color: active ? colors.text : colors.textMuted,
              fontSize: "12px",
              fontWeight: active ? 600 : 400,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "color 0.12s, border-color 0.12s",
              marginBottom: "-1px",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
