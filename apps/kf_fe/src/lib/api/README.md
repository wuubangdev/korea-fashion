# API Client Layout

- `client.ts`: low-level HTTP client, URL building, auth header, error handling, and backend response unwrap.
- `resource.ts`: shared CRUD helpers for standard backend controllers.
- `domains/`: endpoint groups that mirror backend domains.
  - `admin.ts`: admin resources, audit logs, dashboard.
  - `auth.ts`: login and register.
  - `catalog.ts`: products, categories, variants, brands, colors, sizes, product metadata.
  - `commerce.ts`: cart, coupons, inventory, payment, shipping, returns, reviews.
  - `content.ts`: banners, blog, menus, pages, site settings, policies.
  - `orders.ts`: orders and order items.
  - `storefront.ts`: public storefront endpoints.
  - `users.ts`: user management.
- `index.ts`: public barrel export. Existing imports from `@/lib/api` should keep working.
