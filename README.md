# Gaia page

Design artifacts for the Gaia landing page on gorgias.com. Each folder is a self-contained piece: plain HTML, CSS and JavaScript, no build step, no dependencies. Open any `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## What is here

| Folder | |
|---|---|
| `before-after-prototype/` | The "Before / After Gaia" section as a working page: the toggle, the two cards, the photo crossfade, and the rain, glass-drop and petal animations. A reference for whoever builds the section in Webflow. |
| `gaia-lp/` | The full Gaia landing page as one prototype: nav, hero, every section down to a footer placeholder. Built from `template.html` + `styles.css` + `app.js`; `build.py` stitches in the two sections above (scoped CSS, renamed keyframes) and writes `index.html`. Run `python3 build.py` after editing the template or either section. |
| `conversation-scroll/` | The "Now the whole thing is a conversation" section as a scroll-driven page. The section pins to the screen and reveals itself in seven steps as you scroll: an input, a typed prompt, the Routines block, a second input, a typed question, the chat window, and the share modal. |

## Notes for implementers

- Animations run on a `<canvas>` (rain streaks, petals, pollen) and on a handful of DOM elements with `backdrop-filter` (the drops on the glass). They pause when the section is off screen and are skipped for visitors with reduced motion enabled.
- `conversation-scroll/` uses a sticky stage inside a tall track. Scroll position picks the step (one `data-step` attribute on the stage) and CSS transitions move every element between states, so scrolling back plays it in reverse. JavaScript only handles the scroll maths, the typing and the cursor. The layout is authored at 1440px and scaled down on narrower screens.
- Fonts under `assets/fonts/` are the Gorgias brand fonts. Check licensing before reusing them outside gorgias.com.
