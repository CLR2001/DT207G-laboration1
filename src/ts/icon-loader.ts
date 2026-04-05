/**
 * @file SVG Icon Asset Loader
 * @module IconLoader
 * @description
 * Module to inject SVG sprite sheet into the DOM and provide typed icon helpers.
 */

import iconSvg from '/icons.svg?raw';

/**
 * Valid icon IDs from icons.svg file.
 * Update this whenever a symbol is added or removed from the sprite.
 */
export type IconName = 'home' | 'hamburger-open' | 'hamburger-close' | 'dark-mode' | 'light-mode';

/**
 * Injects the global SVG sprite sheet into the DOM.
 * @description
 * Creates a hidden container at the top of the `<body>` to host all SVG definitions.
 * @example
 * initIcons();
 */
export function initIcons(): void {
  const SPRITE_ID = 'global-svg-sprite';

  if (document.getElementById(SPRITE_ID)) return;

  const div = document.createElement('div');
  div.id = SPRITE_ID;
  div.hidden = true;
  div.innerHTML = iconSvg;
  
  document.body.prepend(div);
}

/**
 * Generates an SVG HTML string for a specific icon.
 * @description
 * Returns a complete `<svg>` tag. 
 * @param name - The ID of the icon.
 * @param className - Optional class name for the <svg> element.
 * @example
 * // Returns: <svg class="icon icon-home my-class" ...>
 * const html = getIconHtml('home', 'my-class');
 * @returns {string} The complete SVG HTML string.
 */
export function getIconHtml(name: IconName, className = ''): string {
  return `
    <svg class="icon icon-${name} ${className}" aria-hidden="true">
      <use href="#${name}"></use>
    </svg>
  `.trim();
}