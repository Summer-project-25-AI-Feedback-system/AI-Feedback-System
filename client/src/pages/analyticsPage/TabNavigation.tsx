type TabNavigationProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function TabNavigation({ tabs, activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex justify-center border-b mb-8 w-fit mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-4 font-semibold border-b-2 transition-all duration-200 ${
            activeTab === tab
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
          {tab}
        </button>
      ))}
    </div>
  )
}
