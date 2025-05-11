import { useState, useEffect, useRef } from "react";

interface WindowDimensions {
	width: number;
	height: number;
}

/**
 * Get the current window dimensions.
 *
 * @returns {WindowDimensions} An object containing the width and height of the window.
 */
function getWindowDimensions(): WindowDimensions {
	return { width: window.innerWidth, height: window.innerHeight };
}

/**
 * Custom React hook to get the current window dimensions and track resizing state.
 *
 * @param {number} [resizeTimer=1000] - The debounce timer in milliseconds for resize events.
 * @returns {Object} An object containing the window dimensions and resizing state.
 * @example
 * const { windowDimensions, isResizing } = useWindowDimensions();
 * console.log(windowDimensions.width, windowDimensions.height);
 * console.log(isResizing);
 */
export default function useWindowDimensions(resizeTimer: number = 1000): { windowDimensions: WindowDimensions; isResizing: boolean } {
	const _debounceTimerRef = useRef<number | null>(null); // Reference to store the debounce timer
	const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(getWindowDimensions()); // State to store window dimensions
	const [isResizing, setIsResizing] = useState<boolean>(false); // State to track if the window is resizing

	useEffect(() => {
		// Function to handle window resize events
		function handleResize() {
			setIsResizing(true); // Set resizing state to true
			setWindowDimensions(getWindowDimensions()); // Update window dimensions

			// Clear the previous debounce timer and set a new one
			if (_debounceTimerRef.current !== null) {
				clearTimeout(_debounceTimerRef.current);
			}
			_debounceTimerRef.current = window.setTimeout(() => {
				setIsResizing(false); // Set resizing state to false after debounce timer
			}, resizeTimer);
		}

		// Add event listener for window resize
		window.addEventListener("resize", handleResize);
		return () => {
			// Cleanup event listener and debounce timer on component unmount
			window.removeEventListener("resize", handleResize);
			if (_debounceTimerRef.current !== null) {
				clearTimeout(_debounceTimerRef.current);
			}
		};
	}, [resizeTimer]); // Dependency array includes resizeTimer to handle changes

	return { windowDimensions, isResizing }; // Return window dimensions and resizing state
}
