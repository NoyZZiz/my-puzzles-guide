# NoYzzing OPS - Strategy Command Center PRD

## Original Problem Statement
User wants their gaming guide website rebuilt with proper SEO and monetization. Google AdSense not approved, Infolinks rejected. Using Monetag + Buy Me a Coffee for free monetization. Need build setup for GitHub Pages deployment. Fix chatbot for static deployment. Add more game guides. Fix mobile overflow on mini-game pages.

## Architecture
- **Frontend**: React 18 (CRA) + Tailwind CSS 3 + Lucide React
- **Backend**: FastAPI + MongoDB (optional - site works fully static)
- **Static Build**: `yarn build` outputs to `/build` folder for GitHub Pages
- **Monetization**: Monetag MultiTag (zone 10303259), Buy Me a Coffee, AdSense (pending)
- **SEO**: JSON-LD (WebSite, Organization, BreadcrumbList, FAQPage), OG tags, Twitter Cards, comprehensive sitemap (16 URLs)

## User Personas
- **Gamers**: Puzzles and Conquest players seeking strategy guides
- **Alliance Members**: ROL (Rebirth of Legends) alliance community
- **New Players**: People searching for P&C tips and calculators

## Core Requirements
1. Professional gaming guide homepage with military/tactical theme
2. SEO-optimized for "Puzzles and Conquest" keywords
3. Free monetization through Monetag (no approval needed)
4. AI chatbot (NoyzBot v3.0) - fully client-side, no API needed
5. Newsletter subscription (backend + localStorage fallback)
6. All guides/tools preserved and mobile-responsive
7. GitHub Pages compatible static build

## What's Been Implemented

### Iteration 1 (Jan 2026)
- [x] Full React homepage rebuild with glassmorphic tactical design
- [x] SEO: JSON-LD, OG tags, Twitter Cards across all pages
- [x] Google Analytics (G-VYP41CV8E4) integration
- [x] Buy Me a Coffee donation widget
- [x] NoyzBot v3.0 chatbot
- [x] Newsletter API with MongoDB
- [x] 100% test pass rate

### Iteration 2 (Jan 2026)
- [x] Monetag MultiTag added to ALL 17 pages
- [x] Infolinks completely removed (rejected user)
- [x] OG tags added to all sub-pages
- [x] Verified all pages on mobile, tablet, desktop
- [x] 100% test pass rate

### Iteration 3 (Jan 2026)
- [x] ChatBot rebuilt with 12-topic knowledge base (pure client-side)
- [x] NEW: Hero Tier List 2026 guide (element system, God/Elite/Solid/Starter tiers)
- [x] NEW: Trap Workshop Guide (6 trap types, defense strategies)
- [x] Mobile overflow fixes on Pocket Conquest, Stranger Things, Pokemon Registry, Harry Potter
- [x] Build setup for GitHub Pages (`yarn build` -> /build folder)
- [x] Newsletter localStorage fallback for static deployment
- [x] Footer and sidebar updated with new guide links
- [x] Sitemap updated to 16 URLs
- [x] 100% test pass rate

## Deployment Instructions
1. In the project root, run: `cd frontend && yarn build`
2. The `build/` folder contains the complete static site
3. Push `build/` contents to the `gh-pages` branch or root of your GitHub Pages repo
4. All 19 HTML pages + assets will be deployed

## Prioritized Backlog
### P0 - None
### P1 (High)
- Sign up for AdMaven + PropellerAds (additional revenue)
- Create Buy Me a Coffee account
- Submit sitemap to Google Search Console
### P2 (Medium)
- Add blog section for weekly content (SEO boost)
- Add social sharing buttons
- Implement page view analytics dashboard

## Pages (19 total)
Homepage, Military Guide, Calculator, Troop Strength, Talent Memory, Battle of Saurnesia, Hero Tier List, Trap Workshop, Event Calendar, Pokemon Registry, Pocket Conquest (3 pages), Stranger Things, Harry Potter, Alliance, Privacy Policy, Terms of Service
