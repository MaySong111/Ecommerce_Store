# 🛒 Bay — E-commerce Platform

A full-stack e-commerce web application for snowboard and winter sports equipment. Customers can browse products, manage a shopping cart, and complete checkout with Stripe payment integration.

🔗 **Live Demo**: *(your Azure URL here)*

> **Test Account**
>
> Customer: `Test1@test.com` / `Test1@test.com`
>
> You can also register a new account.

> **Test Card** (Stripe)
>
> Card number: `4242 4242 4242 4242` | Expiry: `02/29` | CVC: `123`
>
> Or enter your own card details to test a real payment flow.
---

## Features

### Shopping & Browsing
- Browse products with brand and category filtering, alphabetical and price sorting
- Fuzzy search across all products via the navbar search bar — triggers on Enter or search icon click, navigating to `/products?searchTerm=...` so the URL itself acts as the state bridge between Navbar and ProductListPage
- Paginated product listing (6 items per page)
- Product detail page with full product info

### Cart
- Add to cart from both the product list and product detail page
- Cart badge in navbar updates in real time
- Adjust item quantities — quantity controls show a delete icon when quantity is 1, and a minus icon otherwise
- Remove individual items or clear entire cart
- Cart is cookie-based and persists across browser sessions — a guest can add items, close the browser, return later, and their cart is still intact. Logging in does not clear the cart

### Checkout (3-step flow)
- **Step 1 — Address**: Full name, country, address fields auto-expand on input; "Save as default address" option (UI present, not yet implemented)
- **Step 2 — Payment**: Stripe card input with automatic delivery fee calculation — orders over $500 qualify for free delivery (currently $5 otherwise)
- **Step 3 — Review**: Confirms shipping address and full order breakdown before payment
- Order summary panel on the right stays in sync across all three steps
- Requires login to proceed — unauthenticated users are redirected to the login page when clicking Checkout or Buy Now

### Buy Now
- Single-click purchase from the product detail page — adds the item to cart and navigates directly to checkout in one action

### Orders
- View full order history with order status and date
- Order detail page shows shipping address, items, quantities, subtotal, delivery fee, and total
- **Buy Again** — re-adds all items from a past order to cart and navigates to checkout

### Authentication
- Register and login with JWT
- JWT token stored in Zustand with `persist` middleware (localStorage)
- Authenticated API calls attach `Authorization: Bearer <token>` manually per request
- Cart operations use `credentials: "include"` (cookie-based, separate from JWT)
- User avatar dropdown in navbar with My Orders and Logout

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React | UI framework |
| Zustand | Auth state (JWT + user info), persisted to localStorage |
| React Router | Client-side routing and URL-based state (search, navigation) |
| MUI (Material UI) | Component library |
| Stripe.js | Payment UI |

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core (.NET 9) | REST API |
| Entity Framework Core | ORM and database migrations |
| AutoMapper | DTO ↔ Entity mapping |
| JWT | Authentication and authorization |
| Stripe .NET SDK | Payment intent creation and webhook handling |

### Infrastructure
| Technology | Purpose |
|---|---|
| Azure SQL Server | Production database |
| Azure App Service | Hosting (frontend served as static files from ASP.NET wwwroot) |
| GitHub Actions | CI/CD pipeline |

---

## Architecture

### Backend Structure

```
Controllers
├── AccountController.cs      → Register, login, JWT issuance
├── BasketController.cs       → Add, reduce, remove, clear, buy-again
├── OrdersController.cs       → Create order, fetch orders, order detail
├── PaymentsController.cs     → Stripe payment intent, webhook
└── ProductsController.cs     → Product list (with filtering/sorting/pagination), product detail

Core
├── AppContext                → EF DbContext
├── AutoMappingConfig         → AutoMapper profiles
├── Constants
│   └── OrderStatus.cs        → Order status constants
├── Dtos                      → Request / Response models
├── Entities                  → Domain models
└── Services
    ├── JwtTokenCreator.cs    → JWT generation
    └── PaymentsService.cs    → Stripe logic
```

### Frontend Structure

```
src/
├── api/
│   └── http.js               → All fetch calls, 401/403 handling, auth header attachment
├── components/
│   ├── Navbar.jsx            → Search, cart badge, auth dropdown
│   ├── Filters.jsx           → Brand / category / sort controls
│   ├── ProductCard.jsx       → Product grid card
│   ├── BasketItem.jsx        → Cart item with quantity controls
│   ├── CheckoutStepper.jsx   → 3-step checkout wrapper
│   ├── OrderSummary.jsx      → Right-panel summary (shared across cart and checkout)
│   ├── ReviewOrder.jsx       → Step 3 review panel
│   ├── GuardAuth.jsx         → Route protection (redirect to login if unauthenticated)
│   └── Layout.jsx            → App shell with Navbar
├── hooks/
│   ├── useProducts.js        → Product list and detail fetching
│   ├── useBasket.js          → Cart state and mutations
│   ├── useOrder.js           → Order fetching and creation
│   └── useAccount.js         → Login and register
├── pages/                    → One file per route
├── store/
│   └── useAuthStore.js       → Zustand auth store (persisted)
└── App.jsx                   → Route definitions
```

### Key Design Decisions

**URL as state bridge for search**

The Navbar search bar lives outside the ProductListPage component. Rather than sharing state via a global store, typing and pressing Enter navigates to `/products?searchTerm=...`. The ProductListPage reads this query param and triggers the API call. Clearing the input navigates back to `/products`. This keeps the components decoupled and makes search results bookmarkable and shareable.

**Cookie-based cart, JWT-based auth — kept separate**

Cart operations use `credentials: "include"` so the backend can read the basket cookie. Auth-required operations (orders, payments) attach a `Bearer` token manually. This means a guest can build a cart without an account, and the cart persists through login without any merge logic.

**Stripe webhook drives order creation**

Order creation is not triggered by the frontend. The flow is:

```
Frontend → Stripe (payment confirmed)
                ↓
           Stripe → POST /payments/webhook
                         ↓
                    Verify signature
                         ↓
                    payment_intent.succeeded
                         ↓
                    Create Order + Delete Basket + Clear cookie
```

The backend only creates an `Order` after receiving a verified `payment_intent.succeeded` event from Stripe. This means an order can only exist if real payment actually occurred — the frontend has no ability to create an order directly. The webhook handler also checks whether an order with the same `PaymentIntentId` already exists before creating a new one, preventing duplicate orders if Stripe retries the webhook.

Shipping address and receipt email are read from the `PaymentIntent` object sent by Stripe, not from a separate API call, so the order record is always consistent with what Stripe processed.

**Delivery fee calculated on the backend**

```csharp
DeliveryFee = basket.BasketItems.Sum(i => i.Quantity * i.Product.Price) >= 50000 ? 0 : 500;
```
The threshold is currently hardcoded. A future improvement would be to move this to an `appsettings.json` configuration value so it can be changed without modifying code.

**Buy Again**

A dedicated `/basket/buy-again/{orderId}` endpoint on the backend reads the order's items and adds them all to the current basket in a single request. The frontend then navigates to checkout.

---

## CI/CD

Every push to `main` triggers a GitHub Actions workflow that:

1. Installs Node.js dependencies and runs `npm run build` for the React frontend
2. Builds and publishes the ASP.NET Core backend with `dotnet publish`
3. Deploys the combined artifact to Azure App Service

The React build output is served as static files from the ASP.NET `wwwroot` folder, so a single Azure App Service hosts both frontend and backend.

---

## Future Improvements

- **Admin role and product management** — add an admin role with a backend management panel for creating, editing, and deleting products; currently product data is seeded manually
- **Save as default address** — the checkbox is present in the checkout UI but the feature is not yet implemented; would require storing a default address per user account
- **Voucher / discount codes** — the voucher input is present in the cart and checkout UI but not yet implemented on the backend
- **Delivery fee configuration** — move the free-delivery threshold from hardcoded backend logic to `appsettings.json` so it can be changed without a code deployment

- **JWT security** — token is currently stored in localStorage via Zustand persist, which is accessible to JavaScript; a more secure approach would be to store it in an httpOnly cookie set by the server
- **Refresh token** — implement refresh token rotation; currently the JWT has a fixed expiry with no renewal mechanism
- **Image storage** — product images are currently stored as URLs pointing to external sources; a production system would use a managed storage service (e.g. Azure Blob Storage) with upload support from the admin panel