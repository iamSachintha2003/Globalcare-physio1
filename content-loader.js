/* ========================================
   GLOBALCARE PHYSIO - Content Loader
   Fetches and renders JSON content dynamically
   ======================================== */

/**
 * ContentLoader Class
 * Handles loading and rendering of JSON-based content
 */
class ContentLoader {
  constructor(basePath = './content') {
    this.basePath = basePath;
    this.cache = {};
  }

  /**
   * Fetch JSON data from a file
   * @param {string} filename - Name of the JSON file (without extension)
   * @param {boolean} forceRefresh - Skip cache and fetch fresh data
   * @returns {Promise<Object>} - Parsed JSON data
   */
  async load(filename, forceRefresh = false) {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && this.cache[filename]) {
      return this.cache[filename];
    }

    try {
      // Add cache-busting timestamp to prevent browser caching
      const cacheBuster = `?v=${Date.now()}`;
      const response = await fetch(`${this.basePath}/${filename}.json${cacheBuster}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}.json`);
      }
      const data = await response.json();
      this.cache[filename] = data;
      return data;
    } catch (error) {
      console.error(`ContentLoader Error: ${error.message}`);
      return null;
    }
  }

  /**
   * Clear internal cache (useful after content updates)
   */
  clearCache() {
    this.cache = {};
  }

  /**
   * Load articles data
   */
  async loadArticles() {
    const data = await this.load('articles');
    return data?.articles || [];
  }

  /**
   * Load a single article by ID
   */
  async loadArticle(id) {
    const articles = await this.loadArticles();
    return articles.find(article => article.id === id) || null;
  }

  /**
   * Load conditions data
   */
  async loadConditions() {
    const data = await this.load('conditions');
    return data?.conditions || [];
  }

  /**
   * Load treatments data
   */
  async loadTreatments() {
    const data = await this.load('treatments');
    return data?.treatments || [];
  }

  /**
   * Load medical terms data
   */
  async loadTerms() {
    const data = await this.load('terms');
    return data?.terms || [];
  }

  /**
   * Filter terms by starting letter
   */
  async loadTermsByLetter(letter) {
    const terms = await this.loadTerms();
    return terms.filter(term => 
      term.term.toLowerCase().startsWith(letter.toLowerCase())
    );
  }

  /**
   * Search across all terms
   */
  async searchTerms(query) {
    const terms = await this.loadTerms();
    const lowerQuery = query.toLowerCase();
    return terms.filter(term =>
      term.term.toLowerCase().includes(lowerQuery) ||
      term.definition.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Search articles by title, category, or content
   */
  async searchArticles(query) {
    const articles = await this.loadArticles();
    const lowerQuery = query.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.category.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * Render Functions - Create HTML from data
 */
const Renderer = {
  /**
   * Render article cards
   */
  articleCard(article) {
    // Support image URL or show placeholder
    const imageHtml = article.image 
      ? `<img src="${article.image}" alt="${article.title}" class="card-image" loading="lazy" onerror="this.outerHTML='<div class=\\'card-image-placeholder\\'>📰</div>'">`
      : `<div class="card-image-placeholder">📰</div>`;
    
    return `
      <article class="card article-card animate-fadeIn">
        ${imageHtml}
        <div class="card-body">
          <div class="article-meta">
            <span class="article-category">${article.category}</span>
            <span class="article-meta-item">
              <span>📅</span> ${this.formatDate(article.date)}
            </span>
            <span class="article-meta-item">
              <span>⏱️</span> ${article.readTime}
            </span>
          </div>
          <h3 class="card-title">${article.title}</h3>
          <p class="card-text article-excerpt">${article.excerpt}</p>
          <a href="article.html?id=${article.id}" class="article-link">
            Read Article <span>→</span>
          </a>
        </div>
      </article>
    `;
  },

  /**
   * Render condition cards
   */
  conditionCard(condition) {
    return `
      <div class="condition-card animate-fadeIn" data-id="${condition.id}">
        <div class="condition-icon">${condition.icon || '🩺'}</div>
        <h3 class="condition-title">${condition.title}</h3>
        <p class="condition-description">${condition.description}</p>
      </div>
    `;
  },

  /**
   * Render treatment cards
   */
  treatmentCard(treatment) {
    const benefitsHtml = treatment.benefits
      .map(b => `<span class="treatment-benefit">${b}</span>`)
      .join('');
    
    return `
      <div class="treatment-card animate-fadeIn">
        <div class="treatment-icon-wrapper">${treatment.icon || '💪'}</div>
        <div class="treatment-content">
          <h3 class="treatment-title">${treatment.title}</h3>
          <p class="treatment-description">${treatment.description}</p>
          <div class="treatment-benefits">${benefitsHtml}</div>
        </div>
      </div>
    `;
  },

  /**
   * Render term cards
   */
  termCard(term) {
    return `
      <div class="term-card animate-fadeIn">
        <div class="term-word">${term.term}</div>
        <p class="term-definition">${term.definition}</p>
        ${term.category ? `<span class="term-category">${term.category}</span>` : ''}
      </div>
    `;
  },

  /**
   * Render featured article for homepage
   */
  featuredArticle(article) {
    return `
      <a href="article.html?id=${article.id}" class="card feature-card animate-fadeIn">
        <div class="feature-icon">📖</div>
        <h3 class="card-title">${article.title}</h3>
        <p class="card-text">${article.excerpt}</p>
      </a>
    `;
  },

  /**
   * Format date string
   */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Render loading skeleton
   */
  skeleton(count = 3) {
    return Array(count).fill(`
      <div class="card">
        <div class="skeleton skeleton-card"></div>
        <div class="card-body">
          <div class="skeleton skeleton-heading"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text" style="width: 80%"></div>
        </div>
      </div>
    `).join('');
  },

  /**
   * Render empty state
   */
  emptyState(title = 'No content found', text = 'Try adjusting your search or filters.') {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">${title}</h3>
        <p class="empty-state-text">${text}</p>
      </div>
    `;
  }
};

/**
 * Render content to a container
 * @param {string} containerId - ID of the container element
 * @param {Array} items - Array of data items
 * @param {Function} renderFn - Function to render each item
 */
function renderToContainer(containerId, items, renderFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = Renderer.emptyState();
    return;
  }

  container.innerHTML = items.map(item => renderFn.call(Renderer, item)).join('');
}

/**
 * Show loading state in container
 */
function showLoading(containerId, count = 3) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = Renderer.skeleton(count);
  }
}

// Create global instance
const contentLoader = new ContentLoader();

// Export for use in other modules
window.ContentLoader = ContentLoader;
window.contentLoader = contentLoader;
window.Renderer = Renderer;
window.renderToContainer = renderToContainer;
window.showLoading = showLoading;
