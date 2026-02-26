# ITtcargo SuperApp — MVP және Scale-ready спецификация

## A) MVP Summary (12 апта)
- **Мақсат:** KZ нарығына локализацияланған логистика + fintech + control tower MVP шығару.
- **Core value:** Shipper пен Carrier/Driver арасындағы instant auction арқылы баға/ETA оптимизациясы, escrow-пен қауіпсіз есеп айырысу.
- **MVP вертикалі:** Auth/KYC → Order create → Bidding → Assignment → Tracking → Delivery → Escrow release → eTTN PDF.
- **Локализация:** `kk/ru`, `KZT`, `Asia/Almaty`.
- **Нәтиже метрикалары (90 күн):**
  - 5,000 тіркелген қолданушы.
  - ≥ 1,000 аяқталған рейс/ай.
  - Bid acceptance rate ≥ 35%.
  - Delivery SLA on-time ≥ 85%.
  - Payment disputes < 3%.

## B) PRD
### 1. Product Goals
1. Қала ішілік/қалааралық/магистраль тапсырыстарын бір платформада басқару.
2. ITtcargo Pay escrow арқылы төлем тәуекелін азайту.
3. Corporate Control Tower арқылы fleet/finance/ops visibility беру.

### 2. Persona & JTBD
- **Shipper:** тез баға табу, сенімді тасымалдаушы таңдау.
- **Driver:** бос жүрісті азайту, тұрақты тапсырыс алу.
- **Carrier Admin:** автопарк пен ставкаларды бақылау.
- **Corporate Operator:** SLA, шығын, құжат, compliance мониторингі.
- **Support/Admin:** dispute, KYC verification, audit.

### 3. MVP Scope
- Auth (SMS OTP mock), multi-role session.
- KYC/KYB upload + manual verify.
- Orders: City/Intercity/Magistral.
- Auction: bid submit/cancel/accept + anti-spam.
- Tracking: status machine + driver location ping.
- Payments: wallet + escrow hold/release + webhook mock.
- Documents: eTTN draft/issued/signed + PDF placeholder.
- Fuel list + Marketplace light checkout.
- Control Tower basic dashboard/table/filter.
- Support ticket + push notifications.
- Genesis AI Lite (heuristic ұсыныс).

### 4. Out of Scope (MVP емес)
- Real bank acquiring settlement.
- Auto KYC OCR/face match.
- Real customs/G2B APIs (тек mock adapters).
- Dynamic routing optimization ML production model.

### 5. Functional Requirements
- Multi-tenant: company_id бойынша isolation.
- RBAC: platform + tenant-level roles.
- Auction rules:
  - тек `status=bidding` және `bid_deadline > now`.
  - тек бір bid accept.
  - vehicle requirement match міндетті.
  - cooldown (60 сек), max 20 bid/order/carrier.
- Escrow:
  - Accept bid → hold.
  - Delivered+confirmed → release - fee.
  - Dispute flag → manual hold.
- Compliance: withdraw only verified KYC.

### 6. Non-Functional
- Modular monolith (NestJS) with bounded modules.
- PostgreSQL + Redis + S3 compatible.
- JWT + refresh tokens + rate limiting.
- PII encryption (phone, doc numbers).
- Structured logs + metrics + trace id.
- Offline mobile cache (last orders).

### 7. KPI & Telemetry
- Funnel: signup→kyc→order→bid→assign→delivered.
- Finance: GMV, fee revenue, escrow duration.
- Ops: bid latency p95, assignment time median.

### 8. 12 апта roadmap
- **W1-2:** auth/roles/tenant, data model, design system.
- **W3-4:** orders + auction + realtime.
- **W5-6:** tracking + wallet escrow simulation.
- **W7-8:** docs/eTTN + admin + support.
- **W9-10:** control tower dashboard + analytics.
- **W11:** hardening, tests, load smoke.
- **W12:** UAT + stage→prod cutover.

## C) User Stories + Edge Cases
### User Stories
1. Shipper ретінде қала ішінде order жариялаймын, bid аламын, біреуін accept етемін.
2. Driver ретінде тек vehicle-compatible order-ға bid беремін.
3. Carrier admin ретінде bids/shipments статустарын қараймын.
4. Corporate operator ретінде SLA және шығынды filter арқылы талдаймын.
5. Support ретінде dispute-ті hold жасап manual resolution жасаймын.

### Edge Cases
- Bid deadline өтіп кетсе: submit 409.
- Бір уақытта екі accept race: DB transaction + unique constraint.
- Wallet balance жеткіліксіз: accept block.
- Driver offline: соңғы location stale белгісі.
- Payment webhook duplicate: idempotency key.
- KYC pending: withdraw endpoint 403.

## D) UX Screens + Navigation map
### Mobile (Driver/Shipper)
- Splash → Language (kk/ru) → OTP Login → Role select.
- Home (role-based cards).
- Create Order (City/Intercity/Magistral tabs).
- Auction room (bids list, timer, chat).
- Order tracking (map + statuses).
- Wallet (balance, hold, history).
- Documents (upload KYC, eTTN list).
- Profile (active role, company switch).

### Web Control Tower
- Login → Dashboard.
- Shipments table + filters (status, route, tenant, SLA).
- Shipment detail (timeline, bids, docs, payment).
- Users & roles management.
- Analytics (GMV, SLA, top carriers).
- Support tickets queue.

## E) Architecture (components + sequence мәтіндік)
### Components
- API Gateway (NestJS app-level modules)
- Auth Module
- Orders Module
- Auction Module (WebSocket events)
- Payments Module (escrow ledger)
- Documents Module (PDF service)
- Notifications Module (push/sms/email adapters)
- Govlink Adapter Module (mock)
- Analytics/Genesis Module (heuristic engine)

### Sequence: Order → Bid → Accept → Delivery → Release
1. Shipper creates order (`created`→`bidding`).
2. Auction opens; carriers submit bids.
3. Shipper accepts bid in transaction.
4. Payments holds escrow.
5. Driver updates status/location.
6. Delivered + shipper confirm.
7. Payments releases carrier amount minus fee.
8. Audit log writes every state change.

## F) Database schema (ERD + SQL snippets)
ERD ядросы: `tenants`, `users`, `user_roles`, `kyc_cases`, `vehicles`, `orders`, `order_requirements`, `bids`, `shipments`, `locations`, `wallets`, `wallet_ledger`, `escrow_holds`, `documents`, `support_tickets`, `audit_logs`.

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  phone_encrypted TEXT NOT NULL,
  email TEXT,
  locale TEXT DEFAULT 'kk',
  timezone TEXT DEFAULT 'Asia/Almaty',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  type TEXT NOT NULL CHECK (type IN ('city','intercity','magistral')),
  status TEXT NOT NULL,
  shipper_user_id UUID NOT NULL REFERENCES users(id),
  pickup JSONB NOT NULL,
  dropoff JSONB NOT NULL,
  cargo JSONB NOT NULL,
  bid_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_orders_tenant_status ON orders(tenant_id, status);
CREATE INDEX idx_orders_bid_deadline ON orders(bid_deadline);

CREATE TABLE bids (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  carrier_tenant_id UUID NOT NULL REFERENCES tenants(id),
  driver_user_id UUID REFERENCES users(id),
  amount_kzt NUMERIC(14,2) NOT NULL,
  eta_minutes INT NOT NULL,
  vehicle_id UUID,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(order_id, carrier_tenant_id, created_at)
);
CREATE INDEX idx_bids_order_status ON bids(order_id, status);

CREATE TABLE escrow_holds (
  id UUID PRIMARY KEY,
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id),
  shipper_wallet_id UUID NOT NULL,
  carrier_wallet_id UUID NOT NULL,
  gross_amount NUMERIC(14,2) NOT NULL,
  platform_fee NUMERIC(14,2) NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## G) OpenAPI
Толық спецификация: `docs/openapi.yaml`.

## H) Repo structure + main code files
- `backend/`: NestJS-style modular monolith scaffold.
- `web/`: React + TS Control Tower scaffold.
- `mobile/`: Flutter role-based app scaffold.
- `infra/`: docker compose, env templates.

## I) Docker compose + run
1. `cp infra/.env.example infra/.env`
2. `docker compose -f infra/docker-compose.yml up -d`
3. Backend: `cd backend && npm i && npm run start:dev`
4. Web: `cd web && npm i && npm run dev`
5. Mobile: `cd mobile && flutter pub get && flutter run`

## J) Tests
- Unit: auth token service, auction rules, escrow release rules.
- Integration: full order flow create→bid→accept→deliver→release.
- E2E: shipper-driver happy path with mocked webhook.

## K) Deployment plan
- **Envs:** dev / stage / prod (separate DB/Redis/S3 buckets).
- **CI:** lint → unit → integration → build images → scan → deploy stage.
- **CD:** manual approval stage→prod, blue/green.
- **Secrets:** Vault/K8s secrets, key rotation 90 days.

## L) Next Steps Roadmap
### V1 (3-6 ай)
- Real payment provider (acquiring/payout).
- Real Gov APIs (eTTN/tax/customs).
- Route optimization v1 + fraud checks.

### V2 (6-12 ай)
- Dynamic pricing ML, demand forecast.
- International corridors + multi-currency settlement.
- Partner APIs/public developer portal.
