# Looma Landing (React + Vite)

Minimal landing/login that calls FastAPI `/auth/login` and redirects to Streamlit with `?token=<JWT>`.

## Build
```bash
npm install
npm run build
```

## Deploy (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_API_URL` = https://arhamrizvi-looma-backend.hf.space
  - `VITE_STREAMLIT_URL` = https://YOUR-STREAMLIT-APP.streamlit.app
