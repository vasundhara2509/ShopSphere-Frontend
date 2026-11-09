# ShopSphere – Frontend

## Project Overview

ShopSphere is a modern e-commerce frontend application developed using React.js and TypeScript.

It provides an interactive shopping experience where users can browse products, register, log in, manage their cart and wishlist, place orders and view payment information.

The frontend communicates with the Spring Boot backend through REST APIs using Axios.

## Technologies Used

- React.js
- TypeScript
- JavaScript
- HTML5
- CSS3
- Vite
- Axios
- React Router

## Features

- User registration and login
- Product listing and browsing
- Product search
- Shopping cart management
- Add and remove wishlist products
- Address management
- Checkout
- Order placement
- Order history
- Order details
- Order cancellation
- Payment method selection
- Payment success page
- Payment history
- Product reviews
- Responsive user interface

## Project Structure

```text
shopsphere-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## How to Run the Frontend

**1. Clone the repository**

```bash
git clone https://github.com/vasundhara2509/ShopSphere-Frontend.git
```

**2. Navigate to the project**

```bash
cd ShopSphere-Frontend
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

```text
http://localhost:5173
```

## Backend Integration

The frontend communicates with the ShopSphere Spring Boot backend.

Backend base URL:

```text
http://localhost:8080
```

Make sure the backend and PostgreSQL database are running before using features that require API communication.

## GitHub Repository

[ShopSphere Frontend](https://github.com/vasundhara2509/ShopSphere-Frontend)

## Author

Developed as part of the ShopSphere full-stack e-commerce application project.