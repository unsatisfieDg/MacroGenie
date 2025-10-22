import { useEffect, useRef, useCallback } from 'react';

/**
 * Session Manager Hook
 * Handles automatic logout on inactivity and session expiration
 */
export const useSessionManager = (user, onLogout) => {
  const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000; // Default: 1 hour
  const ACTIVITY_CHECK_INTERVAL = 60000; // Check every minute
  
  const lastActivityRef = useRef(Date.now());
  const activityCheckIntervalRef = useRef(null);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (user) {
      localStorage.setItem('macroGenie_lastActivity', lastActivityRef.current.toString());
    }
  }, [user]);

  // Check if session has expired
  const checkSession = useCallback(() => {
    if (!user) return;

    const now = Date.now();
    const lastActivity = parseInt(localStorage.getItem('macroGenie_lastActivity') || now);
    const timeSinceLastActivity = now - lastActivity;

    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      console.log('Session expired due to inactivity');
      onLogout();
      alert('Your session has expired due to inactivity. Please sign in again.');
    }
  }, [user, SESSION_TIMEOUT, onLogout]);

  // Setup activity listeners
  useEffect(() => {
    if (!user) return;

    // Activity events to track
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Throttled activity update (max once per minute)
    let lastUpdate = 0;
    const throttledUpdate = () => {
      const now = Date.now();
      if (now - lastUpdate > 60000) { // Only update once per minute
        updateActivity();
        lastUpdate = now;
      }
    };

    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, throttledUpdate, { passive: true });
    });

    // Set up periodic session check
    activityCheckIntervalRef.current = setInterval(checkSession, ACTIVITY_CHECK_INTERVAL);

    // Initial activity update
    updateActivity();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, throttledUpdate);
      });
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
    };
  }, [user, updateActivity, checkSession]);

  // Check session on mount
  useEffect(() => {
    if (user) {
      checkSession();
    }
  }, [user, checkSession]);

  return {
    updateActivity,
    sessionTimeout: SESSION_TIMEOUT
  };
};




