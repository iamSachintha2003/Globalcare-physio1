# Globalcare Physio

A modern, educational physiotherapy website built with HTML, CSS, and JavaScript. Features a JSON-based content management system for easy updates without a database.

**Live Site:** `https://[your-username].github.io/globalcare-physio`

---

## 🚀 Quick Start

1. Clone or download this repository
2. Open `index.html` in a browser
3. Start exploring!

For local development with live reload, use any local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

---

## 📁 Project Structure

```
globalcare-physio/
├── index.html              # Home page
├── conditions.html         # Medical conditions
├── treatments.html         # Treatment methods
├── terms.html              # Medical terminology dictionary
├── articles.html           # Blog listing
├── article.html            # Single article view
├── about.html              # About page
├── contact.html            # Contact form
│
├── css/
│   ├── style.css           # Main styles & design tokens
│   ├── components.css      # UI components
│   └── responsive.css      # Mobile responsiveness
│
├── js/
│   ├── content-loader.js   # JSON content fetching
│   ├── main.js             # Core functionality
│   ├── search.js           # Search & filtering
│   └── theme.js            # Dark/light mode
│
├── content/                # ⭐ EDITABLE CONTENT
│   ├── articles.json       # Blog posts
│   ├── conditions.json     # Medical conditions
│   ├── treatments.json     # Treatment methods
│   └── terms.json          # Medical terminology
│
└── README.md               # This file
```

---

## ✏️ How to Update Content

All content is stored in JSON files in the `/content` folder. Simply edit these files and push to GitHub!

### Adding a New Article

1. Open `content/articles.json`
2. Add a new article object to the `articles` array:

```json
{
  "id": "your-article-slug",
  "title": "Your Article Title",
  "author": "Sachintha Sathsara",
  "date": "2026-01-20",
  "readTime": "5 min",
  "category": "Rehabilitation",
  "excerpt": "A brief summary of your article...",
  "content": "<h2>First Section</h2><p>Your article content in HTML...</p>"
}
```

3. Save and push to GitHub
4. Article appears automatically!

### Adding a New Condition

Edit `content/conditions.json`:

```json
{
  "id": "condition-slug",
  "title": "Condition Name",
  "description": "Brief description...",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "treatments": ["Treatment 1", "Treatment 2"],
  "icon": "🩺"
}
```

### Adding a New Medical Term

Edit `content/terms.json`:

```json
{
  "term": "Term Name",
  "definition": "Clear, student-friendly definition...",
  "category": "Movement"
}
```

### Adding a New Treatment

Edit `content/treatments.json`:

```json
{
  "id": "treatment-slug",
  "title": "Treatment Name",
  "description": "Description of the treatment...",
  "icon": "💪",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"]
}
```

---

## 🚀 Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[username]/globalcare-physio.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `/ (root)`
   - Click Save

4. Your site will be live at: `https://[username].github.io/globalcare-physio`

### Updating Content
```bash
# Edit any JSON file in /content
git add content/articles.json
git commit -m "Add new article: Article Title"
git push
```

Changes will be live within 1-2 minutes!

---

## ✨ Features

- **8 Pages**: Home, Conditions, Treatments, Terms, Articles, Article Detail, About, Contact
- **Dark/Light Mode**: Toggle with localStorage persistence
- **Search**: Real-time search for terms and articles
- **Filters**: Alphabet filter for terms, category filter for articles
- **Responsive**: Mobile-first design, works on all devices
- **Accessible**: Semantic HTML, ARIA labels, focus states
- **Fast**: No frameworks, minimal dependencies
- **Free Hosting**: GitHub Pages compatible

---

## 🎨 Customization

### Colors

Edit CSS custom properties in `css/style.css`:

```css
:root {
  --primary-500: #0077B6;    /* Main blue */
  --secondary-500: #00A676;  /* Healing green */
}
```

### Fonts

The site uses Google Fonts (Inter & Outfit). To change:

1. Update the `<link>` in HTML `<head>`
2. Update `--font-primary` and `--font-heading` in CSS

### Adding New Pages

1. Copy any existing HTML file as a template
2. Update the content and `<title>`
3. Add navigation link in all pages' `<nav class="nav">`

---

## 📋 Contact Form Setup

The contact form uses [Formspree](https://formspree.io/) for free form handling:

1. Create a free Formspree account
2. Create a new form and get your form ID
3. Update `contact.html`:
```html
<form action="https://formspree.io/f/YOUR-FORM-ID" method="POST">
```

---

## 📄 License

This project is created for educational purposes. Feel free to use, modify, and distribute.

---

## 👨‍⚕️ Author

**Sachintha Sathsara**  
Undergraduate Physiotherapy Student  
Faculty of Medicine, University of Colombo  
Sri Lanka

---

*Globalcare Physio - Knowledge for Better Movement*
