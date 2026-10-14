# 🌌 CalcVerse — Next-Gen Scientific & Symbolic Calculator

**CalcVerse** is a quantum-grade, full-featured, secure **Advanced Scientific Calculator & Symbolic Engineering Suite**. Built with a high-performance **React 18 + Vite + Tailwind CSS + Framer Motion** frontend and a robust **Python (Flask + SymPy + NumPy)** backend.

---

## 🎨 1. Brand Identity & Brand Guide

### Name: **CalcVerse**
*Evaluation & Alternatives:*
1. **CalcVerse** *(Selected)*: Represents an infinite universe of mathematics, from elementary arithmetic to multivariable calculus and matrix vector spaces.
2. *SympliMath*: Friendly, but sounds like high-school algebra rather than college-level engineering.
3. *AxiomLab*: Sounds experimental and academic, but less recognizable as a daily calculator tool.
4. *OmniCalc*: Generic, used by several basic multi-calculators.

### Logo Concept
A mathematical fusion of the **Integral ($\int$)**, **Sigma ($\sum$)**, and **Infinity Orbit ($\infty$)** nested inside a **Quantum Hexagon** boundary. The mark symbolizes continuous calculus, discrete summation, and infinite computational precision.

### Color Palette (Hex)
| Token | Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| `--accent-primary` | Electric Cyan | `#00f2fe` / `#38bdf8` | Primary active states, live KaTeX glow, integrals |
| `--accent-secondary` | Royal Violet | `#8b5cf6` | Matrix vectors, sub-tabs, derivatives |
| `--accent-tertiary` | Vivid Pink / Rose | `#f43f5e` | Warning indicators, negative limits, graph $f_3(x)$ |
| `--bg-base` | Deep Void Navy | `#070a12` | Background canvas |
| `--bg-surface` | Cosmic Surface | `#0e1526` | Card backgrounds, glass panels |
| `--accent-amber` | Solar Amber | `#f59e0b` | SHIFT / 2nd mode active indicator |
| `--accent-emerald` | Emerald | `#10b981` | Success check, memory active badge |

### Typography
- **Wordmark & Big Headings**: `Orbitron` & `Space Grotesk` (bold, geometric, futuristic)
- **UI Labels & Inputs**: `Space Grotesk` & `Inter` (high legibility at small sizes)
- **Mathematical Equations & HUD**: `JetBrains Mono` & `KaTeX` (tabular digits, clear distinction of $0$ vs $O$, $1$ vs $l$)

### Clear-Space Rule
Maintain an exclusion clear-space zone around the logo mark equal to at least **$1.5\times$ the width of the central core hexagon** ($1.5 \times X$). No text, borders, or busy graphics may intrude into this zone.

### Brand Do's & Don'ts
- ✅ **DO**: Use the neon gradient (`#00f2fe` $\to$ `#8b5cf6` $\to$ `#f43f5e`) on dark backdrops.
- ✅ **DO**: Maintain the self-drawing SVG animation on page load.
- ✅ **DO**: Use the monochrome variant when rendering on high-contrast print or monochrome displays.
- ❌ **DON'T**: Distort, rotate beyond 15°, or stretch the geometric logo mark.
- ❌ **DON'T**: Replace the duotone gradient with harsh unapproved neon greens or reds.
- ❌ **DON'T**: Import external raster bitmap logos or third-party generic icon libraries.

---

## 💎 2. Custom Icon System (Zero `react-icons`)

The app uses a 100% proprietary, hand-coded duotone SVG icon set located at [`src/components/icons/index.jsx`](file:///c:/Users/ANSH/OneDrive/Documents/Projects/advanced-scientific-calculator/frontend/src/components/icons/index.jsx).
- **Stroke**: Crisp 1.75px rounded caps & joins (`strokeWidth="1.75" strokeLinecap="round"`).
- **Grid**: Normalized $24 \times 24$ viewbox.
- **Duotone Styling**: `currentColor` primary stroke with secondary theme gradient / opacity fills.
- **Included Icons**:
  - `HistoryIcon`, `MemoryIcon`, `ThemeIcon` (Sun/Moon), `SettingsIcon`
  - `GraphIcon`, `MatrixIcon`, `CalculusIcon` (Integral $\int$), `AlgebraIcon`
  - `ConverterIcon`, `ScientificIcon` ($f(x)$), `BasicIcon` ($\pm$)
  - `CopyIcon`, `DeleteIcon` (Backspace), `ClearIcon` (AC), `UndoIcon`
  - `WarningIcon` (with shake animation), `SuccessCheckIcon` (with self-drawing stroke animation)
  - `WifiOffIcon`, `DownloadIcon`, `ShareIcon`, `InfoIcon`, `CloseIcon`, `MenuIcon`
  - Chevrons: `ChevronUpIcon`, `ChevronDownIcon`, `ChevronLeftIcon`, `ChevronRightIcon`
- **Math Operator Glyphs**: Custom SVG glyphs for $\div, \times, \sqrt{}, \pi$.

---

## 🌈 3. The 5 Premium Themes

Switch instantly using the animated preview swatches in the top navigation bar:
1. **Aurora** *(Default)*: Electric cyan, violet & rose on deep cosmic navy (`#070a12`).
2. **Cyberpunk**: High-contrast neon pink, acid yellow & electric blue on black (`#040406`).
3. **Emerald Matrix**: Digital terminal matrix green (`#00ff66`) on onyx black with subtle code-grid ambience.
4. **Sunset Gold**: Solar amber, crimson sunset & twilight purple on deep plum (`#11091a`).
5. **Clean Light**: Soft pearl white (`#f8fafc`), frosted glass cards & ocean sapphire accents for daylight environments.

*Selection is automatically persisted in `localStorage` and honors system `prefers-color-scheme` on first visit.*

---

## ⚡ 4. Visuals & Micro-Interactions

- **Mesh Gradient & Parallax**: 3 soft aurora blobs moving in fluid motion with subtle mouse-follow parallax (GPU-accelerated `transform`, disabled when `prefers-reduced-motion` is active).
- **Film Grain Noise Overlay**: Subtle SVG fractal noise texture preventing color banding on OLED screens.
- **Futuristic HUD Screen**: Scanline overlay, animated light scan beam, blinking neon caret (`.hud-caret`), and KaTeX rendered math preview.
- **Neumorphic Keypad**: Soft number keys, glowing operator buttons, springy tap feedback (`framer-motion` spring), and instant shiftness of labels when `SHIFT` or `HYP` is toggled.
- **Error Shake Feedback**: When a syntax or domain error occurs, the display activates an intense `@keyframes shake` with a red glow, displaying an error code badge, user-friendly message, and actionable hint.

---

## 📁 5. Directory Structure

```
advanced-scientific-calculator/
├── .env                              # Environment configuration
├── requirements.txt                  # Pinned backend dependencies
├── run.py                            # Flask server entry point
├── app/                              # Flask + SymPy backend
│   ├── config.py
│   ├── errors.py
│   ├── routes/ (api.py, main.py)
│   └── services/ (calculus, algebra, matrix, complex, plotter, extras)
└── frontend/                         # Modern React 18 + Vite frontend
    ├── index.html                    # PWA metadata, fonts, KaTeX & Plotly
    ├── vite.config.js                # Vite config with /api reverse proxy
    ├── tailwind.config.js            # Tailwind config mapped to CSS tokens
    ├── public/                       # Favicon (SVG & PWA assets), og-image.svg
    └── src/
        ├── main.jsx
        ├── App.jsx                   # Master layout with tabs & parallax
        ├── index.css                 # Mesh gradient, HUD scanlines, noise
        ├── theme.css                 # 5 themes CSS design token variables
        ├── components/
        │   ├── Logo.jsx              # Vector brand mark with drawing animation
        │   ├── Navbar.jsx            # Mode indicators & theme selector
        │   ├── HUDDisplay.jsx        # Futuristic display with KaTeX & caret
        │   ├── Keypad.jsx            # Neumorphic keypad with button shiftness
        │   ├── HistoryDrawer.jsx     # Slide-over glass drawer (last 20 items)
        │   ├── StepByStepAccordion.jsx # KaTeX mathematical derivations
        │   ├── SplashLoader.jsx      # Animated SVG intro screen
        │   ├── NotFound.jsx          # Custom animated 404 page
        │   ├── Footer.jsx
        │   ├── ThemeSwitcher.jsx
        │   ├── icons/index.jsx       # 100% custom duotone icon suite
        │   └── tabs/                 # Calculus, Algebra, Matrix, Complex, Graph, Extras
        ├── hooks/ (useTheme.js, useParallax.js)
        └── utils/ (api.js)
```

---

## 🚀 6. Installation & Run Instructions

### Step 1: Start the Backend (Flask + SymPy)
```powershell
# In project root
python run.py
```
*Backend will start on `http://127.0.0.1:5000`.*

### Step 2: Start the Frontend (Vite + React)
```powershell
cd frontend
npm run dev
```
*Frontend will launch on `http://localhost:3000` with automatic `/api` proxying to the Flask backend.*

### Step 3: Production Build (Optional)
To build the frontend bundle to `frontend/dist`:
```powershell
cd frontend
npm run build
```
*(Flask is configured to automatically serve the built React bundle at `http://127.0.0.1:5000`!)*

---

## ✅ 7. Verification Checklist

- [x] **Logo Everywhere**: Brand logo appears in Navbar, Splash Screen, 404 Page, Footer, Favicon (`public/favicon.svg`), and Open Graph image (`public/og-image.svg`).
- [x] **Zero `react-icons`**: Complete removal of `react-icons`; zero imports across the entire project (100% custom duotone 1.75px SVG components).
- [x] **5 Themes Fully Operational**: Aurora, Cyberpunk, Emerald Matrix, Sunset Gold, Clean Light with animated swatches and persistent localStorage memory.
- [x] **Shiftness of Buttons**: Pressing `SHIFT` toggles functions (`sin` ⇄ `sin⁻¹`, `ln` ⇄ `eˣ`, `x²` ⇄ `√x`, `nCr` ⇄ `nPr`).
- [x] **Accessibility & Performance**: GPU-accelerated transforms, full `aria-label` / titles on all interactive buttons, and `prefers-reduced-motion` compliance.
- [x] **Backend Untouched & Fully Operational**: All 21 Flask backend unit tests pass with zero regression.
