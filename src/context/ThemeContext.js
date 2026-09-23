import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('rrc_dark_mode') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('rrc_dark_mode', mode);
  }, [mode]);

  const toggleMode = (event) => {
    const nextMode = mode === 'light' ? 'dark' : 'light';

    // Support modern circular animated View Transition if available and not in reduced-motion
    if (document.startViewTransition && event && event.clientX !== undefined) {
      const x = event.clientX;
      const y = event.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        setMode(nextMode);
        document.documentElement.setAttribute('data-mode', nextMode);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 450,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      }).catch(() => {
        setMode(nextMode);
      });
    } else {
      setMode(nextMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, isDark: mode === 'dark', toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
