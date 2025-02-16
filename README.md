# Home Solution

Home Solution is an online platform that allows users to find various home services on a single platform. Users can search, choose, and hire any service provider, while service providers can register and grow their businesses with us. The application consists of a React Native mobile app, a React web application, a Node.js backend, and a PostgreSQL database.

## Table of Contents

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Setup and Installation](#setup-and-installation)
-   [Usage](#usage)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)
-   [Work Flow](/documents/workflow.md)
-   [References / Links](/documents/references.md)

## Features

-   Search for various home services
-   Choose and hire service providers
-   Service providers can register and manage their services
-   User authentication and authorization
-   Real-time updates and notifications

## Technologies Used

-   **Frontend:**
    -   Next.js (Web)
    -   React Native (Mobile)
    -   Axios for HTTP requests
-   **Backend:**
    -   Node.js
    -   Express.js
    -   JWT for authentication
    -   Prisma ORM for PostgreSQL
-   **Database:**
    -   PostgreSQL
-   **Others:**
    -   Socket.io

## Setup and Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/subash-gautam/homesolution
    cd homesolution
    ```
2. Run React Native App:
    ```bash
    cd frontend
    npm install
    npx expo start
    ```
3. Run backend server:

    navigate folder and install packages
    ```bash
    cd backend
    npm install
    ```
    Setup PostgreSQL Database in .env file
    ```bash
    DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
    ```
    migrate database and run server
    ```bash
    npx prisma migrate dev --name init
    npx run server
    ```
    Run prisma studio : to see database status and change them manually too
    ```bash
    npx prisma studio
    ```
4. Run Admin Pannel
    ```bash
    cd admin
    npm install
    npm run dev
    ```
