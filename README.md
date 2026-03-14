# ITtcargo SuperApp Scaffold

Бұл репозиторий ITtcargo MVP үшін код қаңқасын береді:
- Backend API (Node.js, dependency-free, modular services)
- Web Control Tower scaffold (React/TS беттері)
- Mobile scaffold (Flutter)
- Infra (`docker-compose`: Postgres/Redis/MinIO)
- Product docs (`docs/PRD.md`, `docs/openapi.yaml`)

## Backend іске қосу
```bash
cd backend
npm run start
```

API health check:
```bash
curl http://localhost:3000/health
```

## Тесттер
```bash
cd backend
npm test
```

## CI
- `Python package` workflow: pytest no-tests (`exit 5`) жағдайын success қылады.
- `Node backend tests` workflow: backend-тегі `node --test` тесттерін іске қосады.

## Қадам-қадаммен дамыту (ұсынылатын тәртіп)
1. **Step 1 (жасалды):** RBAC + order status transition guard + Node CI.
2. **Step 2:** Postgres persistence және migration layer.
3. **Step 3:** Audit log, idempotent webhook, escrow state machine.
4. **Step 4:** Web/Mobile экрандарын нақты API-ге жалғау.

5. **Step 5:** Audit logs endpoint + idempotent payment webhooks (жасалды).

## Infra
```bash
cp infra/.env.example infra/.env
docker compose -f infra/docker-compose.yml up -d
```


## Web (Control Tower)
```bash
cd web
npm install
npm run dev
```


## Mobile (Негізгі қосымша)
```bash
cd mobile
flutter pub get
flutter run
```

Қосымшада бар:
- OTP login + role select (Shipper/Driver/Carrier Admin/Corporate)
- Bottom navigation: Order create, Tracking, Wallet, Profile
- KZ localization baseline (kk/ru, KZT, Asia/Almaty)
