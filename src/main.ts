import './scss/main.scss';
import { initIcons } from './ts/icon-loader';
import { initThemeHandler } from './ts/theme-handler';

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initThemeHandler();
});
