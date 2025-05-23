import { useState, useCallback } from 'react';
import React from 'react';

/**
 * Custom Toast Notification Hook
 * Provides toast notification functionality with multiple types and auto-dismissal
 * 
 * @returns {{
 *   toasts: Array<{id: string, message: string, type: string}>,
 *   showToast: (message: string, type?: 'success'|'error'|'info'|'warning', duration?: number) => void,
 *   dismissToast: (id: string) => void
 * }}
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {'success'|'error'|'info'|'warning'} [type='info'] - Type of toast
   * @param {number} [duration=5000] - Duration in milliseconds (0 = persistent)
   */
  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    const newToast = { id, message, type };

    setToasts(prevToasts => [...prevToasts, newToast]);

    // Auto-dismiss if duration is set
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, []);

  /**
   * Dismiss a toast by its ID
   * @param {string} id - The ID of the toast to dismiss
   */
  const dismissToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
};

/**
 * Toast Component (to be used in your layout)
 * 
 * @param {{
 *   toasts: Array<{id: string, message: string, type: string}>,
 *   dismissToast: (id: string) => void
 * }} props
 */
export const ToastContainer = ({ toasts, dismissToast }) => {
  // Toast style mappings
  const toastStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black'
  };

  return React.createElement(
    'div',
    { className: 'fixed bottom-4 right-4 z-50 space-y-2' },
    toasts.map(toast =>
      React.createElement(
        'div',
        {
          key: toast.id,
          className: `${toastStyles[toast.type] || 'bg-gray-800 text-white'} 
                     px-4 py-2 rounded-md shadow-lg flex items-center justify-between 
                     min-w-[250px] max-w-[300px] transition-all duration-300`
        },
        React.createElement('span', null, toast.message),
        React.createElement(
          'button',
          {
            onClick: () => dismissToast(toast.id),
            className: 'ml-4 text-lg font-bold hover:opacity-70',
            'aria-label': 'Dismiss toast'
          },
          '\u00D7'
        )
      )
    )
  );
};