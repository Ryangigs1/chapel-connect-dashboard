
export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  targetBlank?: boolean;
}

export const QUICK_LINKS: QuickLink[] = [
  {
    id: 'prayer-request',
    title: 'Submit Prayer Request',
    url: '/prayer-request',
    icon: 'prayer'
  },
  {
    id: 'chapel-rules',
    title: 'Chapel Rules & Guidelines',
    url: '/chapel-rules',
    icon: 'rules'
  },
  {
    id: 'meet-chaplains',
    title: 'Meet the Chaplains',
    url: '/chaplains',
    icon: 'chaplain'
  },
  {
    id: 'special-event',
    title: 'Register for Special Event',
    url: '/events',
    icon: 'event'
  }
];

// Pages for quick links
export const QUICK_LINK_PAGES = {
  'prayer-request': '/prayer-request',
  'chapel-rules': '/chapel-rules',
  'meet-chaplains': '/chaplains',
  'special-event': '/events'
};
