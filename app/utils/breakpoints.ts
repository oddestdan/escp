export const BREAKPOINTS = {
  mobileMaxWidth: 767, // anything above 768 will be treated as tablet
  tabletMaxWidth: 1279, // anything above 1279 will be treated as desktop,
  mobilePortrait: 414,
  mobileLandscape: 667,
  tabletPortrait: 768,
  tabletLandscape: 1025,
  desktopMin: 1200,
};

export const getIsMobile = (): boolean => {
  return window.innerWidth < BREAKPOINTS.mobileMaxWidth;
};
