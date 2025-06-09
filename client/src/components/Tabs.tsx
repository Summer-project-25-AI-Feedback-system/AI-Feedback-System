import { useState, useEffect } from "react";
import type { ReactNode } from "react";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
}

type TabsProps = {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab: controlledTab, onTabChange } : TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

 useEffect(() => {
    if (controlledTab && tabs.some((tab) => tab.id === controlledTab)) {
      setActiveTab(controlledTab);
    }
  }, [controlledTab, tabs]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId); 
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  );
}
