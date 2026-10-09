# 💕 LoveMatch — Playful Connection Web App

A cute, light-pink web application designed for two people (couples, best friends, or family) to celebrate their bond, test how well they know each other, uncover their heart traits, and receive a personalized Relationship Happiness Plan.

Built with **React**, **Vite**, and **vanilla CSS** — 100% frontend, zero backend needed, mobile-first, and delightful.

---

## ✨ Features & Modules

### 🌸 Theme & Visual Design
- **Aesthetic**: Soft light-pink palette (`#FFF0F5`, `#FFE4EC`, `#FF8FAB`, `#E75480`, deep berry text `#5A2A3C`), rounded corners, white cards with pink drop shadows.
- **Micro-Animations**: Floating background hearts, pulsing heart buttons/logo, animated circular score rings with stroke-dashoffset, smooth slide-ins, and `canvas-confetti` celebrations.

### 💘 Module 1: Love & Know Each Other
- **Part A (Love Score)**: Deterministic, order-independent 0–100 score `(nameHash(A) + nameHash(B) + extraHash) % 101` with a 2-second animated calculation sequence and score ring reveal.
- **Part B (Know-Each-Other Quiz)**: Pass-and-play 10-question trivia game with privacy handoff screens ("Hand the device to..."), real-time heart reveal feedback ("Perfect match!" / "Oops, not quite!"), breakdown percentage comparison, and conversation starters drawn directly from missed questions.

### 🌿 Module 2: Who Loves Unconditionally, Cares, and is True
- **Private Scenario Quiz**: Each person takes a 12-question scenario quiz about how they react to real relationship situations (forgiving mistakes, needing space, honoring plans).
- **3 Core Dimensions**:
  1. **Unconditional Love**: Acceptance and grace through mistakes and bad days.
  2. **Caring Style**: Scale from *Gives space* to *Balanced* to *Cares too much* (with gentle self-care reminder if in the over-caring zone).
  3. **Trueness**: Honesty, loyalty, and dependability.
- **Compassionate Framing**: Soft badges ("Unconditional Heart", "Caring Soul", "True Blue"), kind comparative leadership highlights, and a shared balance synthesis ("Together you balance each other because...").

### 💌 Module 3: Suggestions & Best Recommendations
- **Happiness Plan**:
  - Warm summary of mutual strengths.
  - 3 date ideas matched to results (e.g. 20 Questions Night, Home Spa Oasis, Spontaneous Adventure).
  - 3 conversation starters.
  - Tailored small gesture for each person.
  - Gentle growth tip for each person.
  - **7-Day "Happy Together Challenge"**: Interactive daily checklist persisted in `localStorage`.

### 📸 Final Keepsake Card & Sharing
- **1080x1350 High-Resolution Card**: Ready to save as an image (`html-to-image`) or post to social media.
- **Instant URL Share Link**: Encodes results into a URL-safe base64 string in the URL hash (`#/shared/...`) allowing anyone to open a read-only results certificate without a database.
- **Retake**: Seamless reset to play again anytime.

---

## 🛠️ Tech Stack

- **React 19** (Functional components, Hooks, Context API + `useReducer`)
- **Vite 8** (Lightning fast dev server and bundler)
- **React Router 7** (`HashRouter` for zero-server client routing)
- **Vanilla CSS** (Scoped CSS per screen/component, CSS variables, keyframe animations)
- **html-to-image** (PNG export for the 1080x1350 card)
- **canvas-confetti** (Confetti bursts on milestones)
- **Vitest** (Unit tests for scoring algorithms)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Run Unit Tests
```bash
npm test
```
Runs the Vitest suite testing Love Score determinism, order-independence, Know Score math, and trait normalization.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

---

## 🔒 Privacy & Offline Support

LoveMatch has **no tracking, no ads, and no external database**. All calculations run locally in the browser, and all progress is safely saved in `localStorage`.
