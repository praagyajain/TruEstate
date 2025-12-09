Overview

This repository contains a sales management system with a Node.js + Express backend (MongoDB via Mongoose) and a React + Vite frontend. It provides APIs to list and filter sales data and a UI for searching, filtering, sorting, and paginating sales records.

Tech Stack

- Backend: Node.js, Express, Mongoose, MongoDB
- Frontend: React, Vite, Tailwind CSS
- Dev tooling: pnpm/npm, Vite, Netlify config

Search Implementation Summary

Search is implemented as a server-side text search executed after joining related collections; the backend accepts a `search` query parameter and matches it against customer name, customer phone, and product name using case-insensitive regex matching.

Filter Implementation Summary

Filtering is performed server-side via query parameters. The backend accepts parameters such as category, brand, region, gender, minAge/maxAge, tags, paymentMethod, date ranges, and price ranges. Cheap, sale-level filters are applied first; lookups for product and customer documents happen next followed by joined-level filters to avoid unnecessary work.

Sorting Implementation Summary

Sorting is controlled by a `sort` query parameter that maps to backend sort keys (for example `date_desc`, `date_asc`, `customer_asc`, `customer_desc`). The backend only applies an explicit `$sort` stage when a sort key is provided.

Pagination Implementation Summary

Pagination is done on the server using `page` and `limit` query parameters. The listing endpoint uses an aggregation pipeline with a `$facet` to return both `data` and `meta` (including total, page, limit, totalPages, hasNext, hasPrev) so the frontend can render paginated results and controls.

Setup Instructions

1. Backend
   - cd backend
   - install dependencies: `npm install`
   - create a `.env` file with `MONGODB_URI` set to your MongoDB connection string
   - start server: `npm start`

2. Frontend
   - cd frontend
   - install dependencies: `npm install`
   - start dev server: `npm run dev`
