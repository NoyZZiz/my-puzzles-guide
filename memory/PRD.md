# NoYzzing OPS - Strategy Command Center PRD

## Original Problem Statement
User wants their gaming guide website rebuilt with proper SEO and monetization. Google AdSense not approved, so needs alternative free monetization. Make it advanced and free.

## Architecture
- **Frontend**: React 18 (CRA) + Tailwind CSS 3 + Lucide React icons
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Static Pages**: Existing sub-pages served from /public folder
- **Monetization**: Monetag meta tag, Infolinks in-text ads, Google AdSense (pending approval), Buy Me a Coffee donations
- **SEO**: JSON-LD structured data, Open Graph, Twitter Cards, comprehensive sitemap, robots.txt

## User Personas
- **Gamers**: Puzzles and Conquest players looking for strategy guides
- **Alliance Members**: ROL (Rebirth of Legends) alliance members
- **New Players**: People searching for P&C tips and calculators

## Core Requirements (Static)
1. Professional gaming guide homepage with military/tactical theme
2. SEO-optimized for "Puzzles and Conquest" keywords
3. Monetization through free ad networks (no AdSense approval needed)
4. AI chatbot (NoyzBot v3.0) for quick strategy queries
5. Newsletter subscription system
6. All existing guides/tools preserved and accessible

## What's Been Implemented (Jan 2026)
- [x] Full React homepage rebuild with glassmorphic design
- [x] SEO: JSON-LD (WebSite, Organization, BreadcrumbList, FAQPage), OG tags, Twitter Cards
- [x] Google Analytics (G-VYP41CV8E4) integration
- [x] Google AdSense (ca-pub-1115056295957658) - ready for when approved
- [x] Monetag verification meta tag (dc4cd1c75e904df6c3759be0529f93c8)
- [x] Infolinks in-text ads (pid: 3442090)
- [x] Buy Me a Coffee donation widget
- [x] NoyzBot v3.0 chatbot with local fallback responses
- [x] Newsletter API (/api/newsletter/subscribe) with MongoDB storage
- [x] Contact API (/api/contact)
- [x] Comprehensive sitemap.xml (14 URLs)
- [x] Optimized robots.txt
- [x] ads.txt with 20+ ad network entries
- [x] All 16+ sub-pages accessible via static files
- [x] Responsive design (mobile, tablet, desktop)
- [x] 100% test pass rate (backend, frontend, integration, SEO)

## Prioritized Backlog
### P0 (Critical)
- None

### P1 (High)
- Set up Buy Me a Coffee account at buymeacoffee.com/noyzzing
- Apply to Monetag dashboard for push notification ads
- Re-apply to Google AdSense once traffic increases

### P2 (Medium)
- Add Google Search Console verification
- Implement article/blog system for fresh content (SEO boost)
- Add social sharing buttons to each guide
- Implement page view analytics dashboard

## Next Tasks
1. User should create accounts on: Monetag, Buy Me a Coffee, Infolinks
2. Consider adding a blog section for regular content (SEO loves fresh content)
3. Submit sitemap to Google Search Console
4. Build internal linking strategy between guides
