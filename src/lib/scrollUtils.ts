/**
 * Utility functions for scroll behavior
 */

/**
 * Scrolls to the top of the page with smooth animation
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Scrolls to the top of the page instantly (without animation)
 */
export const scrollToTopInstant = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  });
};

/**
 * Scrolls to a specific element by ID with smooth animation
 */
export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

/**
 * Scrolls to a specific element by ID instantly
 */
export const scrollToElementInstant = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'auto',
      block: 'start'
    });
  }
}; 