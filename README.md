# RentNest — Rental Property Marketplace

RentNest is a rental property marketplace built with Next.js and TypeScript. It provides a platform for tenants to discover rental properties, landlords to manage listings, and administrators to oversee users and properties.

## Live Demo

- **Frontend:** https://rentnest-frontend-lyart.vercel.app
- **Backend API:** https://rentnest-backend-83pn.onrender.com
- **Frontend Repository:** https://github.com/mahmudulhaque13/rentnest-frontend
- **Backend Repository:** https://github.com/mahmudulhaque13/rentnest-backend

## Screenshots

<!-- Upload a screenshot to the repository, then uncomment and update this image path. -->

<!-- ![RentNest Homepage](./screenshots/rentnest-homepage.png) -->

## Features

### Authentication and Roles

- User registration and login
- Role-based access for Tenant, Landlord, and Admin
- Loading, error, and feedback states

### Property Discovery

- Browse and search rental properties
- View property information and details
- Responsive property browsing experience

### Landlord Features

- Manage property listings
- Manage rental requests

### Admin Features

- Manage users and properties
- Administrative access to supported workflows

### Payments and User Experience

- Stripe payment integration
- Responsive design for desktop and mobile
- Form feedback and error handling

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Image Optimization:** Next.js `next/image`
- **API Communication:** REST API
- **Payments:** Stripe

See `package.json` for the project's complete dependency list.

## Getting Started

### Prerequisites

- Node.js version supported by the project
- npm
- A running RentNest backend for API-dependent features

### 1. Clone the repository

```bash
git clone https://github.com/mahmudulhaque13/rentnest-frontend.git
cd rentnest-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and configure the backend API URL using the exact variable name expected by the source code.

Example only:

```env
NEXT_PUBLIC_API_BASE_URL=https://rentnest-backend-83pn.onrender.com
```

Verify the variable name and API path against the project's API client before using this example. Never commit private credentials, API secrets, or production keys.

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Build for production

```bash
npm run build
```

### 6. Start the production server

```bash
npm run start
```

## Backend

The backend provides the API used by the frontend for supported authentication, property, rental request, administrative, and payment workflows.

- **Live API:** https://rentnest-backend-83pn.onrender.com
- **Backend Source:** https://github.com/mahmudulhaque13/rentnest-backend

## Deployment

The frontend is deployed on Vercel.

1. Import the frontend repository into Vercel.
2. Configure the required environment variables.
3. Ensure the backend API is reachable.
4. Deploy and test the main user workflows on the live site.

## Author

**Mahmudul Haque**

- **Portfolio:** https://mahmudul-portfolio-xi.vercel.app
- **GitHub:** https://github.com/mahmudulhaque13
- **LinkedIn:** https://www.linkedin.com/in/mahmudul-haque-425113420
- **Email:** m.h.upal13@gmail.com
