# VELOOP Rewards — Exchange Center (Full Stack)

A premium redesign of the VELOOP Rewards **Exchange Center**, built as a full-stack app: React + Vite frontend, Node/Express API, JWT login and signup, and working pages behind every sidebar link.

**Live demo:** _add your deployed URL here_

## Highlights

- **Exchange Center redesign** using the official VELOOP assets (vault hero, four gem colours, VE coin, coin pile, shield, treasure chest). The cutout versions in `client/src/assets` were prepared from the supplied PNGs.
- **Real Gems → VEs conversion** handled by the server: balances, history and eligibility are checked on the API, and a repeated request can never convert twice (idempotency key + client lock).
- **Login / Signup** with hashed passwords (bcrypt) and 7-day JWT sessions. Referral codes work: the referrer earns 25 Gems and the new user 10.
- **Working navigation:** Dashboard, Wallet, Rewards (redeem VEs), Level Up & Earn (claim Gems, XP and levels), Exchange Center, Referrals, History (filters + pagination) and Support (FAQ + contact form).
- **Fully responsive:** 320px phones to 1920px+ screens; sidebar becomes a drawer below 992px.
- **All states:** loading, empty, error, insufficient Gems, confirmation, processing, success, failed conversion.

## Demo account

| Email | Password |
| --- | --- |
| `demo@veloop.in` | `Demo@123` |

Or create your own account. New accounts start with 420 Gems and 3,850 VEs (set in `server/src/config.js`).

## Exchange logic

Defined in `server/src/config.js` (single source of truth):

| Conversion | Required Gems | VEs received |
| --- | --- | --- |
| Daily Gem Conversion | 28 | 151 |
| Reward Conversion | 39 | 168 |
| Value Conversion | 57 | 255 |
| Premium Conversion | 100 | 455 |

`POST /api/exchange/convert` rejects the request if the user lacks Gems, applies the change once, records history, and returns the new balances.

## Tech stack

- **Frontend:** React 18, Vite, React Router, Bootstrap 5 (grid/utilities), CSS Modules, Framer Motion, Lucide React
- **Backend:** Node 18+, Express, JSON Web Tokens, bcryptjs, JSON-file data store

## Getting started

```bash
npm install           # installs root, server and client dependencies
npm run dev             # API on :4000 and web app on :5173
```

Open http://localhost:5173 and log in with the demo account.

The database is created automatically at `server/data/db.json` on first start (demo user included). Delete the file to reset everything.

### Production build

```bash
npm run build           # builds client/dist
npm start               # Express serves the API and the built app on one port (default 4000)
```

Use `server/.env.example` as a guide for your host's environment variables and **set a strong `JWT_SECRET`**.

## Project structure

```
client/src
├── api/            fetch wrapper with auth header
├── assets/         optimised VELOOP artwork (.webp, transparent)
├── components/
│   ├── common/     Gem, VeCoin, InfoTip, Dialog, AnimatedNumber, ActivityList…
│   ├── layout/     AppLayout, Sidebar, Topbar, route guards
│   └── exchange/   Hero, BalanceOverview, ExchangeCard, ExchangeModal,
│                   ConversionSuccess, History, Rules, Glossary, Loader, states
├── context/        AuthContext, ToastContext
├── hooks/          useExchangeCenter, useFetch
└── pages/          Auth, Dashboard, Wallet, Rewards, LevelUp, ExchangeCenter,
                    Referrals, History, Support
server/src
├── config.js       exchange options, tasks, rewards, levels
├── db.js           JSON-file store + demo seed
├── auth.js         JWT + auth middleware
└── routes/         auth, exchange, account (dashboard, earn, rewards, referrals, support)
```

## API overview

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup`, `/api/auth/login` | Create account / log in |
| GET | `/api/auth/me` | Current user + balances |
| GET | `/api/exchange` | Options, history, balances |
| POST | `/api/exchange/convert` | Convert Gems → VEs |
| GET | `/api/dashboard`, `/api/activities` | Summary, filtered history |
| GET / POST | `/api/earn/tasks`, `/api/earn/claim` | Earn Gems |
| GET / POST | `/api/rewards`, `/api/rewards/redeem` | Redeem VEs |
| GET | `/api/referrals` | Code + invited friends |
| GET / POST | `/api/support/tickets` | Contact support |

## Preview states (development)

In development a **Preview states** button (bottom right of the Exchange Center) switches between Normal, Low Gems, Loading, Empty and Error. It only changes the display and never alters saved data. Set `VITE_SHOW_PREVIEW_STATES=true` to show it in a production build.

## Responsive design

Cards use container queries (1 / 2 / 4 columns), the right-hand information rail appears from 1280px, and the layout is capped at 1480px so it stays balanced on large displays.

## Deployment

**One server (simplest):** Render / Railway / any Node host. Build command `npm install && npm run build`, start command `npm start`. Set `JWT_SECRET`. Note: the JSON file store needs a persistent disk; for serverless hosts, replace `server/src/db.js` with a hosted database.

**Split hosting:** deploy `client/` to Vercel or Netlify (`vercel.json` / `_redirects` included) with `VITE_API_URL=https://your-api/api`, and the API with `CLIENT_ORIGIN=https://your-client`.

## Screenshots

See `docs/screenshots` — desktop, tablet, mobile, confirmation modal, converting, success, insufficient Gems, loading, empty, error, login, dashboard, rewards and level-up.

## Production notes

- Swap the JSON store for MySQL/PostgreSQL/MongoDB before real traffic.
- Add rate limiting on `/api/auth/*` and HTTPS in production.


<!-- ==================================================================== -->

# terminal 1 (API on port 4000)
npm run dev --prefix server

# terminal 2 (web app on port 5173)
npm run dev --prefix client