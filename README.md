# FormFanz — Interactive Shape Studio

A creative coding playground built with **vanilla JavaScript, the HTML Canvas API, and Three.js**. Explore shapes in 2D and 3D, draw freehand, adjust colors and dimensions, and export PNG images.

## Features

- **2D shapes:** Circle, square, rectangle, triangle, pentagon, hexagon, star, and heart.
- **3D preview:** Sphere, cube, cone, cylinder, torus, and icosahedron, with optional auto-rotation.
- **Freehand sketching:** Mouse, touch, and stylus input using Pointer Events.
- **Customize and save:** Change color and size, reset the canvas, and export a PNG.
- **Responsive interface:** Works with desktop and mobile viewports, including accessible labels and keyboard focus indicators.

All drawing and exporting takes place locally in the browser; no user account or backend is required.

## Run locally

Use a local web server (ES modules and Three.js CDN imports need a browser environment):

```bash
python -m http.server 8000
```

Open **http://localhost:8000/**. You can also use VS Code Live Server.

**Internet access is required for the 3D mode** because the site imports Three.js from jsDelivr. The 2D and sketch modes work without that dependency.

## Run unit tests

With Node.js 18 or later:

```bash
npm test
```

Tests cover geometry utilities, input validation, and export filename generation. **Browser and mobile interactions have not been verified in CI**; test them manually before merging.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Modern landing page and studio interface |
| `studio.css` | Responsive styling |
| `studio.js` | Canvas and Three.js drawing logic |
| `shape-utils.js` | Pure geometry utilities |
| `tests/` | Unit tests |
| `home.html`, `drawing.html` | Original learning prototype, kept intact |

## Manual QA checklist

- [ ] 2D shapes respond to shape, color, and size changes.
- [ ] 3D shapes load and rotate on a browser with WebGL and internet access.
- [ ] Mouse, touch, and stylus strokes appear in Free draw.
- [ ] PNG export downloads correctly in all three modes.
- [ ] Reset works and small-screen layout remains usable.
- [ ] The browser console contains no unexpected errors.

## Deployment and portfolio suggestions

After manual verification, publish the site using GitHub Pages (entry point: `index.html`) and add the live URL and a real demo video. Suggested repo description:

> Interactive 2D, 3D and freehand shape studio built with JavaScript, Canvas and Three.js.

Suggested GitHub topics: `javascript`, `threejs`, `canvas-api`, `webgl`, `creative-coding`, `frontend`.

### Notes

- The original prototype remains available at `home.html` and `drawing.html`. Its historical scripts and development setup are preserved for reference.
- If the CDN is unavailable or WebGL is unsupported, the new studio reports a 3D preview error rather than silently failing.
- This is a portfolio demonstration, not a professional illustration tool.
