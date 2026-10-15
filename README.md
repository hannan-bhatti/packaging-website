# Foldline — Modern Packaging Company Website

A minimal, editorial, and interactive packaging company website featuring a scroll-driven 3D box folding hero animation, instant 3D interactive box builder, real-time pricing engine, product showcase, and sustainability section.

---

## 🌟 Key Features

### 1. Scroll-Through Hero Box Animation
- **True 3D CSS Folding Dieline**: Built with vanilla CSS 3D transforms (`preserve-3d`, dynamic hinge rotations).
- **Progressive Unfolding Story**:
  - **Phase 1 (01 Design it)**: Starts as a flat die-cut cardboard sheet lying on the drafting table with dieline markings.
  - **Phase 2 (02 Fold it)**: The 4 outer walls crease and fold upward 90 degrees.
  - **Phase 3 (03 Close it)**: The top lid swings down and the tuck flap folds smoothly into the front lip.
  - **Phase 4 (04 Ship it)**: The finished branded mailer box lifts off the floor with dynamic 3D lighting, cast shadows, and rotates into 3/4 hero perspective with a "Ready to ship ✓" indicator.
- **Interactive Step Navigation**: Clicking any step in the story immediately scrolls to and demonstrates that folding phase.

### 2. Live 3D Box Customizer & Instant Quote Builder
- **Real-Time Interactive 3D Box**: Fully draggable (rotates in 360 degrees on pointer drag) with smooth auto-rotation idle loop.
- **Dynamic Proportions & Finish**:
  - Length, Width, and Height sliders dynamically reshape the 3D preview model in real time (supports `cm` and `inches`).
  - Swatch selections switch between **Kraft**, **White**, and **Black** paperboard materials.
  - Print options (*No print*, *1-colour logo*, *Full outside*, *Inside & out*) update surface textures and foil logos.
  - Surface finish toggles (*Matte*, *Gloss* with specular light sheen, *Soft-touch*).
- **Dynamic Pricing Engine**:
  - Mathematical pricing model calculating surface area, board thickness, quantity tiers (100 to 25,000 units), setup fees, and finishes.
  - Animated rolling counters for unit price and total cost.
  - Estimated delivery dates automatically calculated against business day schedules.
  - "Request this quote" modal auto-populates all user-configured specifications.

### 3. Minimal Studio Aesthetics & Clean Copy
- Warm minimal palette: warm off-white canvas (`#F6F3EE`), kraft terracotta accents (`#C98F55`), deep forest green (`#2F5D45`), and editorial charcoal ink (`#141414`).
- Editorial typography pairing: **Inter** for crisp functional UI + **Instrument Serif** italic for editorial brand emphasis.
- Plain, friendly, transparent English copy written for modern founders and e-commerce brands.

### 4. Products & Interactive Quick Views
- 6 core packaging product formats with custom studio photography generated with consistent art direction:
  - Mailer Box
  - Shipping Carton
  - Folding Product Carton
  - Rigid Luxury Gift Box
  - Paper Shopping Bag
  - Padded Paper Mailer
- Interactive category filtering (All, Shipping, Retail, Gifting, Plastic-free).
- Clickable modal quick view with feature breakdown and 1-click transition into the quote builder.

### 5. Sustainability Section & Social Proof
- Dynamic animated number counters triggered on viewport entry (recycled fiber %, plastic-free options, void fill reduction, trees planted).
- Fluid customer review carousel with touch/drag support, autoplay, and responsive pagination.
- One-at-a-time animated FAQ accordion.

---

## 🚀 Quick Start / How to Run

Because this site is built purely with standard modern HTML5, CSS3, and vanilla JavaScript:

### Option 1: Direct in Browser
Simply double-click or open `index.html` in any modern web browser (Chrome, Edge, Safari, Firefox).

### Option 2: Local HTTP Server (Node.js)
```bash
npx serve "c:\Users\Public\Packaging Website"
```
Or with Python:
```bash
cd "c:\Users\Public\Packaging Website"
python -m http.server 3000
```
Then navigate to `http://localhost:3000`.

---

## 📁 File Structure
```
c:\Users\Public\Packaging Website\
├── index.html          # Semantic HTML5 markup, accessible ARIA roles, modals
├── styles.css          # Design system, 3D CSS transforms, responsive media queries
├── script.js           # Scroll timeline, 3D box engine, quote calculator, modals, slider
├── README.md           # Documentation
└── assets/
    └── images/         # Studio product photography
        ├── mailer.jpg
        ├── shipping.jpg
        ├── carton.jpg
        ├── rigid.jpg
        ├── bag.jpg
        ├── pouch.jpg
        └── eco.jpg
```
