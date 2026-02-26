# ITtcargo SuperApp Scaffold

Бұл репозиторий ITtcargo үшін MVP-ready қаңқа береді:
- Backend (NestJS-style TypeScript modular monolith)
- Web Control Tower (React scaffold)
- Mobile app (Flutter scaffold)
- Infra (Postgres/Redis/MinIO docker-compose)
- Product docs (PRD + OpenAPI)

## Жылдам бастау
```bash
cp infra/.env.example infra/.env
docker compose -f infra/docker-compose.yml up -d
```

## Негізгі құжаттар
- `docs/PRD.md`
- `docs/openapi.yaml`

## Тест
```bash
cd backend
npm i
npm test
```
