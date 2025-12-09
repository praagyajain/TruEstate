Backend architecture

The backend is a Node.js application using Express for HTTP routing and Mongoose to interact with MongoDB. The core responsibility is providing REST endpoints for sales data. The listing endpoint uses MongoDB aggregation pipelines that apply inexpensive sale-level filters early, perform `$lookup` to join product and customer collections, then apply joined-level filters and optional sorting. Heavy aggregations use `allowDiskUse` when necessary. A separate stats endpoint performs aggregation to compute total units, revenue, and discount.

Frontend architecture

The frontend is a React application bootstrapped with Vite. UI state for filters and search is kept in the URL query parameters (React Router `useSearchParams`), making the UI state shareable and bookmarkable. Components are split into presentational UI atoms (ui/*), larger components (Header, SalesTable, StatsCards), and pages (Index). The `Header` component writes filters to the query string; the `Index` page reads them and requests data from the backend.

Data flow

User actions in the frontend (search input, dropdowns, pagination, sort) update the URL query parameters. The `Index` page reads these parameters, builds a query, and calls the backend listing endpoint. The backend applies sale-level and joined-level filters, runs optional sorting, and returns a paged result with metadata. The frontend receives the response and renders the `SalesTable` and `StatsCards`. Background stats are fetched from a dedicated `/api/sales/stats` endpoint using the same filter parameters.

Folder structure

- backend/
  - src/
    - controllers/
    - models/
    - routes/
    - services/
    - utils/
  - scripts/
  - seed/
- frontend/
  - client/
    - components/
      - ui/
    - pages/
    - hooks/
    - lib/
  - vite config and toolchain files
- docs/

Module responsibilities

- backend/src/routes/saleRoutes.js: Build aggregation pipelines for listing and stats, parse query parameters, and return paginated results and statistics.
- backend/src/models/*: Mongoose models for Sale, Product, and Customer defining schema and validation.
- backend/src/services/db.js: Database connection and utility helpers.
- frontend/client/components/Header.jsx: Render UI controls (search, filters, sort) and write normalized query parameters to the URL.
- frontend/client/pages/Index.jsx: Read query parameters, fetch `/api/sales` and `/api/sales/stats`, manage loading state, and pass data to child components.
- frontend/client/components/SalesTable.jsx: Render paginated table of sale rows and pagination controls.
- frontend/client/components/StatsCards.tsx: Display aggregated statistics returned by the stats endpoint.
