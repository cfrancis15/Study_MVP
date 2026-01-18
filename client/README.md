# SaaS Boilerplate with Clerk

Minimal SaaS starter with authentication, billing, and content protection.

## Quick Start

1. `npm install`
2. Copy `.env.example` to `.env`
3. Add your Clerk Publishable Key
4. `npm run dev`

## Features

- Authentication (Clerk)
- Billing & Subscriptions (Clerk Billing)
- Content Protection (`<Protect>` component)
- Mobile Responsive Layout
- React Router (Declarative mode)

## Protecting Content

import { Protect } from '@clerk/clerk-react';

<Protect plan="pro" fallback={<div>Upgrade!</div>}>
  <YourPremiumFeature />
</Protect>
