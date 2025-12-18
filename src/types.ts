export const AppTab = {
  GARDEN: 'GARDEN',
  LEARN: 'LEARN',
  LIBRARY: 'LIBRARY',
  REVIEW: 'REVIEW',
  COMMUNITY: 'COMMUNITY'
}

export type AppTabType = (typeof AppTab)[keyof typeof AppTab];

export interface TabProps {
  isActive: boolean;
}