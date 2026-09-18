# Gaia page

Design artifacts for the Gaia landing page on gorgias.com. Each folder is a self-contained piece: plain HTML, CSS and JavaScript, no build step, no dependencies. Open any `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## What is here

| Folder | |
|---|---|
| `before-after-prototype/` | The "Before / After Gaia" section as a working page: the toggle, the two cards, the photo crossfade, and the rain, glass-drop and petal animations. A reference for whoever builds the section in Webflow. |

## Notes for implementers

- Animations run on a `<canvas>` (rain streaks, petals, pollen) and on a handful of DOM elements with `backdrop-filter` (the drops on the glass). They pause when the section is off screen and are skipped for visitors with reduced motion enabled.
- Fonts under `assets/fonts/` are the Gorgias brand fonts. Check licensing before reusing them outside gorgias.com.
