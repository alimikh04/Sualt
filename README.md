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

## Infra
```bash
cp infra/.env.example infra/.env
docker compose -f infra/docker-compose.yml up -d
```
