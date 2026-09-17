# Gaia page

*One paragraph on what this page is, once the brief lands.*

Plain HTML, CSS and JavaScript. No build step, no dependencies, works offline.

## Running it

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then open http://localhost:8000.

## What is where

| File | |
|---|---|
| `index.html` | The page. Sections are marked with `SECTION` comments. |
| `css/site.css` | Gorgias brand base (tokens, fonts, `.gr-*` classes) plus the page styles. |
| `js/content.js` | The page content. The file to edit when copy changes. |
| `js/app.js` | Renders the page from the content. |
| `assets/fonts/` | Fonts, if they ship with the repo. |
| `assets/img/` | Brand marks and images. |
