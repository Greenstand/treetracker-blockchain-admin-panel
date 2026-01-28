# Treetracker Admin Panel

React-based admin dashboard for tree verification integrated with the TreeTracker services.

## Quick start

```bash
npm install
npm start
```

## Environment

Configure service URLs via environment variables:

```env
REACT_APP_AUTH_API_URL=http://138.68.4.47:30001/api/v1
REACT_APP_CAPTURE_API_URL=http://138.68.4.47:30002
REACT_APP_TOKEN_API_URL=http://138.68.4.47:30004
```

## Scripts

- `npm run start` - Run development server
- `npm run build` - Build production bundle
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

## Admin access

Use an admin account managed by `treetracker-auth-service`.
