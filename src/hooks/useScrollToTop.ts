import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to scroll to top when the route changes
 * This ensures users start at the top of each new page
 */
export const useScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash in the URL, scroll to that element
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
        return;
      }
    }

    // Otherwise, scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Optional: Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Scrolling to top for route:', pathname);
    }
  }, [pathname, hash]);
}; 