# Study MVP Backend Server

Simple Express server that proxies OpenAI API requests to keep API keys secure.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_key_here
```

## Run

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs on port 3000 by default (or PORT env variable).
