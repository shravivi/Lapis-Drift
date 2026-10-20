# Lapis Drift

Generative art in the browser: thousands of tiny particles follow a noise-driven flow field and leave ribbons of mineral pigment (lapis, jade, gold, cinnabar) on a dark ground. No dependencies, no build step.

## Run it
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Controls
| Input | Action |
|---|---|
| Move pointer | Bends nearby currents |
| Click | Plants a burst of new ribbons |
| `N` | New painting |
| `P` | Next pigment palette |
| `S` | Save as PNG |

## Publish with GitHub Pages
Repo **Settings → Pages → Deploy from branch → `main` / root**. Your piece will be live at `https://<you>.github.io/<repo>/`.

## Make it yours
Palettes live at the top of `src/sketch.js`. Change the noise scales in `angle()` to alter how tightly the currents curl.

## License
MIT
