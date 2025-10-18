
# Sangeet - A Microservices-based Music Application

Sangeet is a music streaming application, similar to Spotify, built with a microservices architecture. This project showcases a scalable and resilient system with features like real-time music synchronization across multiple devices.

## High-Level Architecture

The application is divided into multiple microservices, each responsible for a specific business capability. The services communicate with each other through a message broker (RabbitMQ) and expose REST APIs for client-server communication.

The primary services are:

*   **Authentication Service:** Handles user authentication, authorization, and user management.
*   **Notification Service:** Manages sending notifications to users, such as email verification, password reset, etc.
*   **Music Service:** (Conceptual) Would handle music streaming, playlists, and metadata.
*   **Sync Service:** (Conceptual) Would manage the real-time synchronization of music playback across multiple devices.

## Features

*   **User Authentication:** Secure user registration and login with JWT-based authentication.
*   **Google OAuth 2.0:** Support for social login with Google.
*   **Real-time Music Synchronization:** (Conceptual) Synchronized music playback across multiple logged-in devices with low latency.
*   **Email Notifications:** Asynchronous email notifications for various events.
*   **Scalable Architecture:** Built with a microservices architecture, allowing for independent scaling of services.
*   **Containerized Deployment:** Dockerized services for consistent development and production environments.
*   **Cloud-Native Deployment:** Deployed on AWS Elastic Container Service (ECS) for high availability and scalability.

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB
*   **Authentication:** Passport.js, JWT, bcryptjs
*   **Messaging:** RabbitMQ
*   **Email:** Nodemailer
*   **Containerization:** Docker
*   **Cloud Provider:** Amazon Web Services (AWS)
    *   **Compute:** Elastic Container Service (ECS)
    *   **Storage:** S3 (for music files)
    *   **Networking:** Elastic Load Balancing (ELB)

## Setup and Installation

To run the application locally, you will need to have Node.js, npm, and Docker installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sangeet.git
    cd sangeet
    ```

2.  **Install dependencies for each service:**
    ```bash
    cd auth
    npm install
    cd ../notification
    npm install
    ```

3.  **Set up environment variables:**
    Each service has a `.env` file for configuration. You will need to create a `.env` file in the root of each service and provide the necessary environment variables, such as database connection strings, JWT secrets, and AWS credentials.

4.  **Run the services:**
    You can run each service individually using the `npm run dev` command.

## Deployment on AWS

The application is designed to be deployed on AWS using Docker and ECS.

**Note:** The public-facing AWS services for this project have been taken down to avoid incurring costs. However, you can deploy the application on your own AWS account by following these steps:

1.  **Build Docker images:**
    For each service, build a Docker image:
    ```bash
    docker build -t sangeet-auth .
    docker build -t sangeet-notification .
    ```

2.  **Push images to a container registry:**
    Push the Docker images to a container registry like Amazon ECR.

3.  **Set up ECS:**
    *   Create an ECS cluster.
    *   Create task definitions for each service, specifying the Docker image, CPU/memory requirements, and environment variables.
    *   Create an ECS service for each task definition, which will manage the running containers.

4.  **Set up a load balancer:**
    Create an Application Load Balancer (ALB) to route traffic to the services.

5.  **Set up S3:**
    Create an S3 bucket to store music files.

## API Endpoints

### Authentication Service (`/api/auth`)

*   **`POST /register`**: Register a new user.
*   **`POST /login`**: Log in a user and get a JWT token.
*   **`GET /google`**: Initiate Google OAuth 2.0 authentication.
*   **`GET /google/callback`**: Callback URL for Google OAuth 2.0.

### Notification Service

The notification service does not have any public-facing API endpoints. It listens for messages from the message broker and sends emails accordingly.

## Frontend Development Guide (report.md)

This guide outlines the steps to build a frontend for the Sangeet application using Vite and React.

### Project Setup

1.  **Create a new Vite + React project:**
    ```bash
    npm create vite@latest sangeet-frontend -- --template react
    cd sangeet-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install axios react-router-dom
    ```

### API Integration

You will need to make API calls to the backend services. It is recommended to create a dedicated API client using a library like Axios.

**Example API client (`src/api.js`):**
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://microbazzar-alb-1038075917.ap-south-1.elb.amazonaws.com/api', // Your backend URL
});

export default apiClient;
```

### Connecting to AWS Services

When you deploy your frontend to a service like Vercel, you will need to configure CORS on your backend services to allow requests from your frontend's domain.

In your Express.js applications, you can use the `cors` middleware:
```javascript
import cors from 'cors';

app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

### Building the UI

You can use a component library like Material-UI or Chakra UI to build a modern and responsive UI.

**Example folder structure:**
```
src/
├── api/
│   └── apiClient.js
├── components/
│   ├── Login.js
│   ├── Register.js
│   ├── Player.js
│   └── ...
├── pages/
│   ├── HomePage.js
│   ├── LoginPage.js
│   └── ...
├── App.js
└── main.js
```

### Deployment on Vercel

1.  **Push your code to a Git repository.**
2.  **Create a new project on Vercel and connect it to your Git repository.**
3.  **Configure the build settings:**
    *   **Build command:** `npm run build`
    *   **Output directory:** `dist`
4.  **Add your custom domain.**

## Tweets for Your X Account

Here are three tweets you can use to share your work:

**Tweet 1 (Today):**

> Just started working on a new project! Building a music streaming app called Sangeet with a microservices architecture. Excited to dive deep into Node.js, Docker, and AWS. #webdev #javascript #microservices #aws

**Tweet 2 (After 2 days):**

> Making great progress on Sangeet! The authentication service is up and running, and I'm now working on the real-time music synchronization feature. This is going to be a game-changer. #buildinpublic #coding

**Tweet 3 (After 4 days):**

> It's alive! Sangeet is now deployed on AWS using ECS. It's been a challenging but rewarding experience. Check out the project on my GitHub: [Link to your GitHub repo] #developer #portfolio #fullstack
