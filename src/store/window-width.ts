import { create } from 'zustand'

/**
 * WindowWidth store manages the current window width for responsive UI adjustments.
 *
 * @description This store maintains the current window width of the browser and provides
 * a method to update it. It's designed to help components adapt their layouts and behavior
 * based on the available screen space. The store initializes with a null width value and
 * updates it when the setWidth method is called, typically in response to window resize events.
 *
 * The store uses Zustand for state management, providing a lightweight and efficient solution
 * for sharing window width information across components. This approach eliminates prop drilling
 * and allows any component to access or update the window width when needed.
 *
 * Components can subscribe to width changes to implement responsive designs, conditional rendering,
 * or optimize layouts based on available space. The null initial state helps identify when the
 * width hasn't been measured yet.
 *
 * @returns {Object} A Zustand store with width value and setter function
 * @returns {number|null} returns.width - The current window width or null if not yet measured
 * @returns {Function} returns.setWidth - Function to update the window width value
 *
 * @example
 * const { width, setWidth } = useWindowWidth();
 * useEffect(() => {
 *   const handleResize = () => setWidth(window.innerWidth);
 *   window.addEventListener('resize', handleResize);
 *   handleResize();
 *   return () => window.removeEventListener('resize', handleResize);
 * }, [setWidth]);
 */
interface WindowWidth {
  width: number
  setWidth: (width: number) => void
}

export const useWindowWidth = create<WindowWidth>((set) => ({
  width: 0,
  setWidth: (width) => set({ width }),
}))
