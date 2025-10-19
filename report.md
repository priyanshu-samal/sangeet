# Frontend Development Report for Sangeet

This report outlines the strategy and steps for building a modern frontend for the Sangeet music application using **Vite + React**. It covers architecture, API integration, and deployment on Vercel, assuming the backend microservices are deployed on AWS.

## 1. Frontend Architecture Overview

The frontend will be a Single Page Application (SPA) built with React and bundled with Vite for a fast development experience. It will be deployed on **Vercel**, which provides a seamless CI/CD pipeline, automatic SSL, and a global CDN.

### Core Principles:
- **Component-Based:** Structure the UI into reusable React components.
- **State Management:** Use a centralized state management library like **Zustand** or **Redux Toolkit** to manage global state such as user authentication, playback status, and the current playlist.
- **API-Driven:** The application will be entirely driven by the backend microservices. All data will be fetched or pushed via API calls.

### High-Level Flow

```mermaid
graph TD
    A[User's Browser] --> B{Vercel CDN};
    B --> C[React SPA];
    subgraph "API Communication"
        C --> D{API Gateway / ALB on AWS};
        D --> E[Auth Service];
        D --> F[Music Service];
        C --> G[Sync Service (WebSocket) on AWS];
    end
```

## 2. Project Setup

To start, create a new Vite + React project.

```bash
# Using npm
npm create vite@latest sangeet-frontend -- --template react-ts

# cd into the project
cd sangeet-frontend

# Install dependencies
npm install
```

### Recommended Libraries:
- **`axios`**: For making HTTP requests to the backend.
- **`react-router-dom`**: For routing.
- **`zustand`**: For simple and effective state management.
- **`socket.io-client`**: To connect to the real-time Sync Service.

```bash
npm install axios react-router-dom zustand socket.io-client
```

## 3. API Integration

### Environment Variables

Create a `.env` file in the root of your Vite project. Vite uses the `VITE_` prefix to expose variables to the client.

```
# The base URL for your backend API Gateway on AWS
VITE_API_BASE_URL=https://api.your-domain.com

# The URL for your WebSocket Sync Service on AWS
VITE_SYNC_SERVICE_URL=wss://sync.your-domain.com
```

### API Client (Axios)

Create a centralized Axios instance to handle API calls. This allows you to configure base URLs and interceptors in one place. Since the backend uses `httpOnly` cookies for authentication, you need to configure Axios to send credentials with each request.

`src/api/axios.js`:
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // This is crucial for sending httpOnly cookies!
});

export default apiClient;
```

### Auth Service Integration

The backend's `Auth Service` handles registration and login. Since it uses `httpOnly` cookies, you don't need to manage JWTs manually in the frontend. The browser will handle sending the cookie with each request to the same domain (or subdomain).

- **Registration:**
  ```javascript
  // src/services/authService.js
  import apiClient from '../api/axios';

  export const registerUser = async (userData) => {
    // The backend expects: { email, password, fullname: { firstname, lastname } }
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  };
  ```

- **Google Login:**
  The backend handles the Google OAuth flow via redirects. In the frontend, you simply need a link that points to the backend's Google auth endpoint.
  ```html
  <a href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`}>Login with Google</a>
  ```
  After the user authenticates with Google, the backend will redirect back to your frontend (you need to configure this redirect URI in your Google Cloud Console and potentially in your backend). The `httpOnly` cookie will be set by the browser upon the final redirect from the backend.

### Music Service Integration (Assumed)

Assuming a `Music Service` exists, you would create service functions to fetch data.

- **Fetch Songs:**
  ```javascript
  // src/services/musicService.js
  import apiClient from '../api/axios';

  export const getSongs = async () => {
    const response = await apiClient.get('/api/music/songs');
    return response.data;
  };
  ```

### Sync Service (WebSocket) Integration

The `Sync Service` provides real-time playback control. You'll use `socket.io-client` to connect.

`src/services/syncService.js`:
```javascript
import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SYNC_SERVICE_URL;

// The 'withCredentials' option is important for cookies
export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});

// Example of listening for an event
socket.on('PLAY', (data) => {
  console.log('Playback started:', data);
  // Here, you would update your global playback state
});

// Example of emitting an event
export const emitPlay = (songId, timestamp) => {
  socket.emit('PLAY', { songId, timestamp });
};
```

## 4. Deployment: Vercel + AWS

Deploying the frontend on Vercel and backend on AWS is a powerful combination, but requires careful configuration.

### The CORS Challenge

**This is the most critical part.** By default, a browser will block a web page on `sangeet.vercel.app` from making API calls to `api.your-domain.com` due to the **Same-Origin Policy**. 

To fix this, you must configure **CORS (Cross-Origin Resource Sharing)** on your AWS backend.

1.  **API Gateway/ALB:** Your API Gateway or Application Load Balancer on AWS must be configured to respond to `OPTIONS` requests and include the following headers in its responses:
    -   `Access-Control-Allow-Origin`: This **must** be set to your Vercel domain (e.g., `https://sangeet.vercel.app` or your custom domain `https://www.sangeet.com`). Using `*` is not secure and **will not work** with cookies.
    -   `Access-Control-Allow-Credentials`: This **must** be set to `true` to allow the browser to send the `httpOnly` authentication cookie.
    -   `Access-Control-Allow-Methods`: `GET, POST, PUT, DELETE, OPTIONS`.
    -   `Access-Control-Allow-Headers`: `Content-Type, Authorization`.

2.  **Express CORS Middleware:** In each of your backend services, you should also use a CORS middleware package.
    ```javascript
    import cors from 'cors';

    const corsOptions = {
      origin: 'https://sangeet.vercel.app', // Your Vercel frontend URL
      credentials: true,
    };

    app.use(cors(corsOptions));
    ```

### Vercel Configuration

1.  **Import Project:** Import your Git repository into Vercel.
2.  **Build Settings:** Vercel will automatically detect the Vite + React setup. The default settings are usually correct (`npm run build`, output directory `dist`).
3.  **Environment Variables:** In the Vercel project settings, add the same environment variables you defined in your `.env` file (`VITE_API_BASE_URL`, `VITE_SYNC_SERVICE_URL`).

### Custom Domain

When you add a custom domain to Vercel (e.g., `www.sangeet.com`):

- **Update CORS:** You **must** update the `Access-Control-Allow-Origin` header in your AWS backend configuration to reflect your new custom domain. It's often best to have a list of allowed origins (e.g., `['https://www.sangeet.com', 'https://sangeet.vercel.app']`).
- **Update Vercel Env Vars:** While not strictly necessary if you use relative paths, it's good practice to ensure your Vercel environment variables point to your final production API domains.
