Warehouse Management System (WMS) - Base Project

This repository contains the initial scaffold (Phase 1 foundation) for the Warehouse Management System described in the execution plan and technical documentation.

## Getting Started

Install dependencies (already done if you used the scaffold command):

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit: http://localhost:3000

## Structure (initial)

```
src/
	lib/
		firebase/ (config, auth, firestore, storage helpers)
		types/ (domain & api/component types)
		utils/ (constants, later: validators, calculations, formatters)
	store/
		authStore.ts (Zustand auth state)
```

## Next Steps (Planned Roadmap)

- Authentication pages & protected routes
- Core UI components (Button, Input, Modal, Table, Loading)
- Form handling patterns (React Hook Form + Zod/Yup)
- Warehouse & Product modules
- Inventory real-time listeners
- Dashboard & analytics components

## Scripts

Common scripts (extend later for tests & type checking):

```bash
npm run dev     # start dev server
npm run build   # production build
npm start       # run production build
npm run lint    # lint sources
```

## Environment Variables

See `.env.example` and create `.env.local` with real values.

## Documentation

High-level docs & execution plan are one directory up: `../wms_documentation.md` and `../wms_execution_plan.md`.

## License

Proprietary - All rights reserved.

