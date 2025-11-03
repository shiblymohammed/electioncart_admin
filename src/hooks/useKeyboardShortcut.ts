import { useEffect, useCallback } from 'react';

type KeyboardShortcutHandler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

/**
 * Hook to handle keyboard shortcuts
 * @param key - Key to listen for (e.g., 'k', 'Escape')
 * @param handler - Function to call when shortcut is triggered
 * @param options - Modifier keys (ctrl, shift, alt, meta)
 */
export function useKeyboardShortcut(
  key: string,
  handler: KeyboardShortcutHandler,
  options: ShortcutOptions = {}
): void {
  const { ctrl = false, shift = false, alt = false, meta = false } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if the key matches
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      
      // Check if modifiers match
      const ctrlMatches = ctrl === event.ctrlKey;
      const shiftMatches = shift === event.shiftKey;
      const altMatches = alt === event.altKey;
      const metaMatches = meta === event.metaKey;

      if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
        event.preventDefault();
        handler(event);
      }
    },
    [key, handler, ctrl, shift, alt, meta]
  );

  useEffect(() => {
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Hook to handle ESC key
 * @param handler - Function to call when ESC is pressed
 */
export function useEscapeKey(handler: () => void): void {
  useKeyboardShortcut('Escape', handler);
}
