/* ========================================
   GLOBALCARE PHYSIO - Theme Toggle
   Dark/Light mode with persistence
   ======================================== */

/**
 * Theme Manager
 * Handles dark/light mode switching and persistence
 */
const ThemeManager = {
  STORAGE_KEY: 'globalcare-theme',
  DARK: 'dark',
  LIGHT: 'light',

  /**
   * Initialize theme on page load
   */
  init() {
    const savedTheme = this.getSavedTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme, or system preference, or default to light
    const theme = savedTheme || (prefersDark ? this.DARK : this.LIGHT);
    this.setTheme(theme);
    this.initToggle();
    this.watchSystemPreference();
  },

  /**
   * Get saved theme from localStorage
   */
  getSavedTheme() {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (e) {
      return null;
    }
  },

  /**
   * Save theme to localStorage
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }
  },

  /**
   * Set theme on document
   */
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateToggleIcon(theme);
    this.saveTheme(theme);
  },

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || this.LIGHT;
  },

  /**
   * Toggle between dark and light
   */
  toggle() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === this.DARK ? this.LIGHT : this.DARK;
    this.setTheme(newTheme);
  },

  /**
   * Update toggle button icon
   */
  updateToggleIcon(theme) {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === this.DARK ? '☀️' : '🌙';
      toggleBtn.setAttribute('aria-label', 
        theme === this.DARK ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  },

  /**
   * Initialize toggle button click handler
   */
  initToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  },

  /**
   * Watch for system preference changes
   */
  watchSystemPreference() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't set a preference
      if (!this.getSavedTheme()) {
        this.setTheme(e.matches ? this.DARK : this.LIGHT);
      }
    });
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
});

// Export for global access
window.ThemeManager = ThemeManager;
