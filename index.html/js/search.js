/* ========================================
   GLOBALCARE PHYSIO - Search Functionality
   Real-time search for articles and terms
   ======================================== */

/**
 * Search Manager
 * Handles search functionality across the site
 */
const SearchManager = {
  debounceTime: 300,

  /**
   * Initialize search on a page
   * @param {Object} options - Search configuration
   */
  init(options = {}) {
    const {
      inputId = 'search-input',
      containerId = 'search-results',
      type = 'terms', // 'terms', 'articles', 'conditions'
      onSearch = null
    } = options;

    const input = document.getElementById(inputId);
    if (!input) return;

    const debouncedSearch = debounce(async (query) => {
      if (onSearch) {
        onSearch(query);
      } else {
        await this.performSearch(query, containerId, type);
      }
    }, this.debounceTime);

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      debouncedSearch(query);
    });

    // Handle clear button if exists
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      });
    }
  },

  /**
   * Perform search and render results
   */
  async performSearch(query, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!query) {
      // Load all items if query is empty
      await this.loadAll(containerId, type);
      return;
    }

    showLoading(containerId, 3);

    let results = [];
    let renderFn;

    switch (type) {
      case 'terms':
        results = await contentLoader.searchTerms(query);
        renderFn = Renderer.termCard;
        break;
      case 'articles':
        results = await contentLoader.searchArticles(query);
        renderFn = Renderer.articleCard;
        break;
      case 'conditions':
        const conditions = await contentLoader.loadConditions();
        const lowerQuery = query.toLowerCase();
        results = conditions.filter(c => 
          c.title.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery)
        );
        renderFn = Renderer.conditionCard;
        break;
    }

    renderToContainer(containerId, results, renderFn);
  },

  /**
   * Load all items for a type
   */
  async loadAll(containerId, type) {
    showLoading(containerId, 6);

    let items = [];
    let renderFn;

    switch (type) {
      case 'terms':
        items = await contentLoader.loadTerms();
        renderFn = Renderer.termCard;
        break;
      case 'articles':
        items = await contentLoader.loadArticles();
        renderFn = Renderer.articleCard;
        break;
      case 'conditions':
        items = await contentLoader.loadConditions();
        renderFn = Renderer.conditionCard;
        break;
    }

    renderToContainer(containerId, items, renderFn);
  }
};

/**
 * Alphabet Filter for Medical Terms
 */
const AlphabetFilter = {
  /**
   * Initialize alphabet navigation
   */
  init(containerId = 'terms-container') {
    const alphabetNav = document.querySelector('.alphabet-nav');
    if (!alphabetNav) return;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    alphabetNav.innerHTML = `
      <a href="#" class="alphabet-link active" data-letter="all">All</a>
      ${letters.map(l => 
        `<a href="#" class="alphabet-link" data-letter="${l}">${l}</a>`
      ).join('')}
    `;

    alphabetNav.addEventListener('click', async (e) => {
      e.preventDefault();
      const link = e.target.closest('.alphabet-link');
      if (!link) return;

      // Update active state
      alphabetNav.querySelectorAll('.alphabet-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const letter = link.dataset.letter;
      await this.filterByLetter(letter, containerId);
    });
  },

  /**
   * Filter terms by letter
   */
  async filterByLetter(letter, containerId) {
    showLoading(containerId, 6);

    let terms;
    if (letter === 'all') {
      terms = await contentLoader.loadTerms();
    } else {
      terms = await contentLoader.loadTermsByLetter(letter);
    }

    renderToContainer(containerId, terms, Renderer.termCard);
  }
};

/**
 * Article Category Filter
 */
const CategoryFilter = {
  /**
   * Initialize category filter
   */
  async init(containerId = 'articles-container') {
    const filterContainer = document.querySelector('.category-filter');
    if (!filterContainer) return;

    // Get unique categories from articles
    const articles = await contentLoader.loadArticles();
    const categories = [...new Set(articles.map(a => a.category))];

    filterContainer.innerHTML = `
      <button class="btn btn-sm btn-primary category-btn active" data-category="all">All</button>
      ${categories.map(cat => 
        `<button class="btn btn-sm btn-secondary category-btn" data-category="${cat}">${cat}</button>`
      ).join('')}
    `;

    filterContainer.addEventListener('click', async (e) => {
      const btn = e.target.closest('.category-btn');
      if (!btn) return;

      // Update active state
      filterContainer.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary', 'active');

      const category = btn.dataset.category;
      await this.filterByCategory(category, containerId);
    });
  },

  /**
   * Filter articles by category
   */
  async filterByCategory(category, containerId) {
    showLoading(containerId, 3);

    const articles = await contentLoader.loadArticles();
    const filtered = category === 'all' 
      ? articles 
      : articles.filter(a => a.category === category);

    renderToContainer(containerId, filtered, Renderer.articleCard);
  }
};

// Export for global access
window.SearchManager = SearchManager;
window.AlphabetFilter = AlphabetFilter;
window.CategoryFilter = CategoryFilter;
