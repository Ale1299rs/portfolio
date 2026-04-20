# Portfolio — Data & Analytics Consultant

A production-ready personal portfolio for a Data & Analytics consultant specialised in Salesforce, Power BI and CRM data quality. Built with Next.js App Router, Tailwind CSS and Framer Motion. Deploys to Vercel without configuration.

## Highlights

- **Dark / Light mode** with `prefers-color-scheme` default, manual toggle, localStorage persistence and zero hydration flicker (via `next-themes` + `suppressHydrationWarning`).
- **Design system** built on CSS variables (`--bg`, `--fg`, `--accent`, …) exposed to Tailwind, so theming is one token change away. Light mode is a soft off-white; dark mode is a deep near-black (never pure `#000`).
- **Accessibility**: AA contrast on both themes, keyboard-reachable skip-link, focus rings, `prefers-reduced-motion` respected, proper ARIA on tabs and toggles.
- **Interactive "wow" section**: a live Pipeline Cockpit demo (`/#demo`) with region filter, animated KPIs, bar chart and sparkline — a smaller, interactive version of the kind of dashboards I actually ship.
- **Scroll-based reveals and micro-interactions** via Framer Motion, only on elements that benefit from them.
- **Case studies** modelled as data (`lib/projects.ts`) — add a new engagement by adding one entry.
- **Blog** reads from `lib/blog.ts`, shaped to be swapped for Medium's RSS feed (`/feed/@<handle>`).
- **SEO**: per-page metadata, Open Graph, Twitter cards, sitemap, robots, JSON-LD (`Person` + per-project `CreativeWork`), canonical URLs.
- **Performance**: `next/font` for Inter, `optimizePackageImports` for `lucide-react` and `framer-motion`, server components by default, zero heavy chart libraries (charts are hand-rolled SVG), no runtime CSS-in-JS.

## Stack

- [Next.js 15](https://nextjs.org) (App Router, RSC)
- [Tailwind CSS 3.4](https://tailwindcss.com)
- [Framer Motion 11](https://www.framer.com/motion)
- [next-themes](https://github.com/pacocoursey/next-themes) — SSR-safe theme provider
- [lucide-react](https://lucide.dev) — icons
- TypeScript, strict mode

## Project structure

```
app/
  layout.tsx            root layout, fonts, metadata, JSON-LD
  page.tsx              home — Hero + Proof + Services + Demo + Projects + Process + CTA
  projects/
    page.tsx            all case studies
    [slug]/page.tsx     case-study detail (problem → data → solution → impact)
  about/page.tsx
  blog/page.tsx
  contact/page.tsx
  sitemap.ts            generated sitemap
  robots.ts             generated robots.txt
  not-found.tsx
  globals.css           design tokens + base styles
components/
  theme/
    ThemeProvider.tsx   wraps next-themes
    ThemeToggle.tsx     icon button, top-right
  layout/
    Header.tsx          sticky, glassy on scroll, mobile menu
    Footer.tsx
    Reveal.tsx          scroll-in animation helper
  sections/
    Hero.tsx
    ProofSection.tsx    measurable results + testimonials
    ServicesSection.tsx
    DashboardDemo.tsx   interactive pipeline cockpit
    ProjectsPreview.tsx
    ProcessSection.tsx
    CTA.tsx
    ContactForm.tsx
  ui/
    Button.tsx
    Container.tsx
    SectionHeading.tsx
lib/
  site.ts               site-wide config (name, nav, socials, keywords)
  projects.ts           case-study data
  blog.ts               post data (mock — swap for Medium RSS)
  analytics.ts          vendor-agnostic `track()` shim
  utils.ts
public/
  favicon.svg
```

## Run locally

Requires Node.js 18.18+ (20 LTS recommended).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build     # production build
npm run start     # serve the production build
npm run lint      # eslint
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import it on [vercel.com/new](https://vercel.com/new) — no config needed.
3. Set `NEXT_PUBLIC_SITE_URL` (optional) if you have a custom domain, and update `site.url` in `lib/site.ts` to match.

## Adding a new case study

Edit `lib/projects.ts` and add an entry:

```ts
{
  slug: "unique-slug",
  title: "…",
  tagline: "…",
  category: "Salesforce" | "Power BI" | "CRM Optimization" | "Data Quality",
  industry: "…",
  year: "2026",
  duration: "6 weeks",
  stack: ["…"],
  hero: { accent: "from-blue-500/20 via-sky-400/10 to-transparent" },
  problem: "…",
  data: ["…"],
  solution: ["…"],
  impact: [{ label: "Forecast accuracy", value: "+31%", detail: "in 2 quarters" }],
  takeaway: "…",
  featured: true, // appears on the home page
}
```

The detail page (`/projects/[slug]`), sitemap, and home-page preview pick it up automatically.

## Swapping blog data for Medium

`lib/blog.ts` has the shape you need. Replace the hard-coded `posts` array with a fetch of `https://medium.com/feed/@<username>` inside a cached Server Component (`fetch(..., { next: { revalidate: 3600 } })`), parse the RSS `<item>` entries, and map to `Post[]`. No other code needs to change.

## Customising the theme

All colours live as CSS variables in [`app/globals.css`](app/globals.css):

```css
:root {
  --bg: 248 249 251;
  --fg: 17 24 39;
  --accent: 37 99 235;
  /* … */
}
.dark {
  --bg: 10 12 18;
  --fg: 236 239 245;
  --accent: 96 165 250;
  /* … */
}
```

Change those and every component updates. Tailwind reads them via the `colors` extension in [`tailwind.config.ts`](tailwind.config.ts).

## Analytics

`lib/analytics.ts` exposes a `track(event, props)` helper that calls `window.plausible` and pushes to `dataLayer` — drop in Plausible, Vercel Analytics, or GTM without touching the call sites. CTAs on the hero and contact form are already instrumented.

## Accessibility & performance notes

- Skip-to-content link at the top of `<body>`.
- All interactive controls have `aria-label` / `aria-pressed` / `aria-selected`.
- `prefers-reduced-motion` disables transitions and animations globally.
- `next/font` prevents font swap FOUT/FOIT.
- `suppressHydrationWarning` + `next-themes` guarantee zero theme flicker on first paint.
- Charts are hand-rolled SVG — no `recharts`, `d3`, or `chart.js` in the bundle.
- Framer Motion is tree-shakeable via `optimizePackageImports`.

Targeted Lighthouse scores: 95+ Performance / 100 Accessibility / 100 Best-Practices / 100 SEO on desktop.
