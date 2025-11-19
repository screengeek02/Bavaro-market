# Bavaro Market

A lightweight, single-page marketplace inspired by OfferUp where neighbors can resell physical products, services, and experiences. The site is built with vanilla HTML, CSS, and JavaScript so you can run it anywhere without a build step.

## Features

- **Category-first discovery** – Browse curated categories and see how many sellers and listings are active in each lane.
- **Profile builder** – Create a seller profile with a headline, location, and format (product, service, or both). Profiles automatically become selectable inside the listing form.
- **Listing composer** – Publish listings for anything: gadgets, home goods, services, or experiences. Listings inherit seller info for quick credibility.
- **Dynamic filters** – Search, filter by category, or limit the feed to products vs. services in real time.
- **Persistent state** – Profiles and listings are saved locally via `localStorage` so refreshes keep your marketplace intact.

## Getting started

1. Open the project folder in your terminal and start a lightweight web server (any static server works). For example:
   ```bash
   cd Bavaro-market
   python -m http.server 4173
   ```
2. Visit `http://localhost:4173` in your browser.
3. Create a seller profile, then add listings tied to that profile. Use the filter controls at the top to explore the marketplace.

Feel free to customize the categories, starter data, and styling to match your brand or region.
