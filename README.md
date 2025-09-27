# Pinterest FE (Vite + React + Tailwind)

## Run
```bash
npm i
cp .env.example .env
# edit VITE_API_BASE_URL to your backend
npm run dev
```

## Endpoints expected (flexible)
- POST /auth/register
- POST /auth/login
- GET /images?search=
- GET /images/:id
- GET /images/:id/comments
- POST /images/:id/comments
- POST /images (multipart: file + title/ten_hinh + description/mo_ta)
- DELETE /images/:id
- ME routes: any of /me | /users/me | /auth/me | /me/profile | /users/current | /users/:id
- Saved: /images/:id/saved or /me/saved or /saves or /users/:id/saved
- Created: /me/created or /users/:id/created
```

Robust fallbacks & JWT decode are implemented to avoid 404/401 crashes.
