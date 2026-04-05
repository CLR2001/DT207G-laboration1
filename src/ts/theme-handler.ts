"use strict";

export function initThemeHandler() {
  const metaColor = document.querySelector('meta[name="color-scheme"]');
  const button = document.querySelector('.theme-button');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (prefersDarkMode && localStorage.getItem('theme') !== 'light') {
    applyTheme('dark');
  } else {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
  }

  if (button) {
    button.addEventListener('click', () => {
    let currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
      applyTheme('light');
    } else {
      applyTheme('dark');
    }
  });
  }
  
  function applyTheme(theme: string) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    if (button) {
     button.innerHTML = `<svg class="icon"><use href="#icon-${theme}-mode"></use></svg>`; 
    }
    if (metaColor) {
      metaColor.setAttribute('content', theme);
    }
  }
}