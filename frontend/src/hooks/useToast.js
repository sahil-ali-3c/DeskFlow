import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for toast notifications
 * @returns {{ toast: Object, showToast: Function, hideToast: Function }}
 */
export function useToast() {
  const [toast, setToast] = useState({
    message: '',
    type: 'info',
    visible: false
  });

  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({ message, type, visible: true });

    timerRef.current = setTimeout(() => {
      hideToast();
      timerRef.current = null;
    }, 3000);
  }, [hideToast]);

  return { toast, showToast, hideToast };
}
