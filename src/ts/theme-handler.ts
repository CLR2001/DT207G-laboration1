/**
 * @file Theme Handler
 * @module ThemeHandler
 * @description
 * Manages light/dark theme switching and saves user preference via localStorage.
 */

/**
 * Valid theme options.
 */
type Theme = 'light' | 'dark';

/**
 * Applies the theme to the DOM and saves preference to local storage.
 * @param {Theme} theme - The theme to activate ('light' or 'dark').
 */
function applyTheme(
  theme: Theme,
  button: HTMLButtonElement | null,
  metaColor: HTMLMetaElement | null
): void {
  // Applies dataset to :root.
  document.documentElement.dataset.theme = theme;

  //Saves to local storage.
  localStorage.setItem('theme', theme);

  // Updates button icon and metaColor attribute.
  if (button) {
    button.innerHTML = `<svg class="icon"><use href="#icon-${theme}-mode"></use></svg>`; 
  }
  if (metaColor) metaColor.content = theme;
}

/**
 * Initializes the theme handler.
 */
export function initThemeHandler(): void {
  const metaColor = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  const button = document.querySelector<HTMLButtonElement>('.theme-button');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  /**
   * Applies initial theme with following prioritization:
   * 1. Saved localStorage value
   * 2. System preference
   * 3. Default: 'light'
   */
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  const initialTheme: Theme = savedTheme || (prefersDarkMode ? 'dark' : 'light');
  applyTheme(initialTheme, button, metaColor);

  // Applies button logic.
  if (!button) return;

  button.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme as Theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, button, metaColor);
  });
}