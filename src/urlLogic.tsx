import urls from './urls.json';

export interface SubItem {
  text: string;
  url?: string;
  newtab?: boolean;
  subItems?: SubItem[];
}

export interface MenuItem {
  text: string;
  icon?: React.ReactNode;
  subItems?: SubItem[];
  url?: string;
  newtab?: boolean;
}


// --- Helper functions ---

// Handle click on a subitem to embed in app
function handleSubItemClickEmbed(
  subItem: SubItem,
  setSelectedPage?: (page: string) => void,
  setSelectedUrl?: (url: string | null) => void
) {
  setSelectedPage && setSelectedPage(subItem.text);
  setSelectedUrl && setSelectedUrl(subItem.url || null);
}

// Handle click on a subitem to open in new tab
function handleSubItemClickNewTab(
  subItem: SubItem,
  setSelectedUrl?: (url: string | null) => void
) {
  window.open(subItem.url, '_blank', 'noopener,noreferrer');
  setSelectedUrl && setSelectedUrl(null);
}

// Universal handler for sidebar-style links and menu items
export function handleUrlClick(
  item: SubItem | MenuItem,
  setSelectedPage?: (page: string) => void,
  setSelectedUrl?: (url: string | null) => void
) {
  // If it's a logout action (for MenuItem)
  if ('text' in item && item.text === "Logout") {
    window.location.href = "/logout";
    return;
  }
  // If it's a new tab
  if (item.newtab) {
    handleSubItemClickNewTab(item, setSelectedUrl);
  } else {
    handleSubItemClickEmbed(item, setSelectedPage, setSelectedUrl);
  }
}

