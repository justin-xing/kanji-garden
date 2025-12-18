import { useState } from 'react';
import Navigation from './components/Navigation.tsx';
import GardenTab from './tabs/Garden/GardenTab.tsx';
import LearnTab from './tabs/Learn/LearnTab.tsx';
import LibraryTab from './tabs/Library/LibraryTab.tsx';
import ReviewTab from './tabs/Review/ReviewTab.tsx';
import CommunityTab from './tabs/Community/CommunityTab.tsx';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import type { AppTabType } from './types';
import { AppTab } from './types';

function App() {
  const [currentTab, setCurrentTab] = useState<AppTabType>(AppTab.GARDEN);
  const [hasVisited, setHasVisited] = useState<boolean>(false);

  const handleStart = () => {
    setHasVisited(true);
  };

  const renderTab = () => {
    switch (currentTab) {
      case AppTab.GARDEN:
        return <GardenTab onNavigate={setCurrentTab} />;
      case AppTab.LEARN:
        return <LearnTab />;
      case AppTab.LIBRARY:
        return <LibraryTab />;
      case AppTab.REVIEW:
        return <ReviewTab />;
      case AppTab.COMMUNITY:
        return <CommunityTab />;
      default:
        return <GardenTab onNavigate={setCurrentTab} />;
    }
  };

  if (!hasVisited) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="antialiased text-stone-800 bg-stone-100 min-h-screen font-sans selection:bg-wasabi/20">
      {renderTab()}
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default App
