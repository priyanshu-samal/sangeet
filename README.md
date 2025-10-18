# 🎵 Sangeet: Your Synchronized Microservices Music Experience 🎵

Welcome to **Sangeet**! This project is a deep dive into building a scalable, real-time music streaming application using a microservices architecture. We're creating a platform where music playback is synchronized across multiple devices, providing a seamless and shared listening experience, all powered by a robust and independently scalable backend.

## ✨ The Sangeet Vision: Why Microservices?

Imagine a music app where a sudden spike in user logins doesn't slow down the music streaming for everyone else. Picture a system where you can introduce a new feature, like a real-time lyrics engine, without ever taking the main application offline. This is the power of microservices, and it's the foundation of Sangeet.

By breaking down the application into smaller, focused services, we gain:

-   **Scalability:** The music streaming service can be scaled up to handle millions of listeners without affecting the authentication or notification services.
-   **Resilience:** If the notification service experiences a temporary issue, it won't interrupt your music.
-   **Agility:** We can develop, deploy, and update individual services faster, bringing new features to you more quickly.
-   **Technology Flexibility:** Each service can be built with the best tools for the job.

## 🗺️ Architectural Blueprint: How It All Connects

Sangeet is composed of specialized services, each mastering a specific part of the music experience. These services communicate with each other asynchronously through a message broker, ensuring the platform is decoupled and resilient.

-   **Asynchronous Communication with RabbitMQ:** We use **RabbitMQ** as our message broker. This allows services to communicate without being directly connected. For example, when a new user signs up, the `Auth Service` publishes a `USER_CREATED` event. The `Notification Service` listens for this event and sends a welcome email, all without the two services ever needing to know about each other's existence.
-   **AWS Cloud Hosting:** The entire Sangeet platform is designed for the cloud. Each microservice is containerized and deployed independently on **Amazon Web Services (AWS)** using the **Elastic Container Service (ECS)**. This provides the scalability and reliability needed for a world-class music application.

## 🐳 Containerization with Docker

Every microservice in the Sangeet ecosystem is containerized using Docker. This guarantees a consistent environment from development to production, simplifying the entire workflow. Our `dockerfile` for each service follows a lean and efficient pattern:

1.  **Base Image:** Start with a lightweight `node:18-alpine` image.
2.  **Setup:** Copy `package.json` and `package-lock.json`.
3.  **Dependencies:** Install dependencies with `npm install`.
4.  **Source Code:** Copy the rest of the application code.
5.  **Expose Port:** Expose the port the service runs on.
6.  **Start:** Run the application with `npm start`.

This standardized approach makes managing and deploying our services a breeze.

## 🚀 Getting Started: Your Backstage Pass to Sangeet

Ready to get the music playing? Follow the steps in the [Local Development](#-local-development) section to get Sangeet running on your machine.

## 🏡 Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sangeet.git
    ```
2.  **Set up environment variables:**
    Each service needs its own `.env` file. Go into each service's directory, create a `.env` file, and add the necessary variables. See the [Environment Variables](#-environment-variables) section for details.

3.  **Install dependencies and run the services:**
    For each service, open a new terminal window and run:
    ```bash
    cd sangeet/&lt;service-name&gt;  # e.g., cd sangeet/auth
    npm install
    npm run dev
    ```

## 🔑 Environment Variables

Each service requires a `.env` file in its root directory.

### All Services
-   `MONGO_URI`: Connection string for your MongoDB database.
-   `RABBIT_URL`: Connection string for your RabbitMQ instance.
-   `NODE_ENV`: Set to `development`.

### Auth Service
-   `JWT_SECRET`: Secret key for signing JWTs.
-   `CLIENT_ID`: Google OAuth Client ID.
-   `CLIENT_SECRET`: Google OAuth Client Secret.

### Notification Service
-   `EMAIL_HOST`: SMTP host for your email provider.
-   `EMAIL_PORT`: SMTP port.
-   `EMAIL_USER`: SMTP username.
-   `EMAIL_PASS`: SMTP password.

## ☁️ AWS Deployment

**Disclaimer:** The public AWS deployment for this project has been taken down to avoid high costs. The following is a guide on how you can deploy Sangeet to your own AWS account.

1.  **Prerequisites:**
    -   An AWS account.
    -   AWS CLI installed and configured.
    -   Docker installed.

2.  **Create ECR Repositories:**
    In Amazon ECR, create a private repository for each microservice (e.g., `sangeet-auth`, `sangeet-notification`).

3.  **Build and Push Docker Images:**
    For each service:
    a.  Navigate to the service directory.
    b.  Build the Docker image: `docker build -t &lt;repository-uri&gt; .`
    c.  Authenticate Docker to ECR.
    d.  Push the image: `docker push &lt;repository-uri&gt;`

4.  **Set up an ECS Cluster:**
    Create a new ECS cluster. The Fargate launch type is recommended for a serverless approach.

5.  **Create Task Definitions:**
    For each service, create an ECS task definition. Specify the Docker image from ECR, CPU/memory needs, port mappings, and the required **environment variables**.

6.  **Create Services:**
    For each task definition, create a new service in your cluster. This will manage the running containers and handle auto-scaling.

7.  **Set up an Application Load Balancer (ALB):**
    Create an ALB to route incoming traffic. Configure listener rules to direct traffic based on the path (e.g., `/api/auth/*` to the auth service).

8.  **Configure Security Groups:**
    Ensure your security groups allow traffic between the ALB, ECS tasks, and your database.

For detailed instructions, refer to the official AWS documentation for ECR, ECS, and ALB.

## 📊 Architecture and Flow Diagrams

### High-Level Architecture

```mermaid
graph TD
    subgraph "User Interaction"
        A[Client Browser/App] --&gt; B(API Gateway / ALB);
    end

    subgraph "Core Services"
        B --&gt; C[Auth Service];
        B --&gt; D[Music Service];
        B --&gt; E[Sync Service (WebSocket)];
    end

    subgraph "Supporting Services"
        O[Notification Service];
    end

    subgraph "Data & Events"
        subgraph Databases
            DB1[(Auth DB)]
            DB2[(Music DB)]
        end
        
        subgraph "Message Broker"
            N[RabbitMQ];
        end

        subgraph "File Storage"
            S3[AWS S3];
        end
    end

    %% Service to DB Connections
    C --- DB1;
    D --- DB2;

    %% HTTP Communications
    D --&gt; S3;

    %% Event Publishing
    C -- "USER_CREATED" --&gt; N;
    D -- "NEW_SONG_UPLOADED" --&gt; N;

    %% Event Consumption
    N -- "USER_CREATED" --&gt; O;
    N -- "NEW_SONG_UPLOADED" --&gt; O;

```

### User Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Auth_Service
    participant Auth_DB
    participant RabbitMQ
    participant Notification_Service

    Client-&gt;&gt;Auth_Service: POST /api/auth/register (email, password)
    Auth_Service-&gt;&gt;Auth_DB: Check if user exists
    alt User does not exist
        Auth_Service-&gt;&gt;Auth_DB: Save new user with hashed password
        Auth_Service-&gt;&gt;RabbitMQ: Publish 'USER_CREATED' event
        RabbitMQ--&gt;&gt;Notification_Service: Consume 'USER_CREATED' event
        Notification_Service--&gt;&gt;Notification_Service: Send Welcome Email
        Auth_Service--&gt;&gt;Client: 201 Created {user, token}
    else User exists
        Auth_Service--&gt;&gt;Client: 400 Bad Request (User already exists)
    end
```

### Real-time Music Sync Flow

```mermaid
sequenceDiagram
    participant User_Device_1
    participant User_Device_2
    participant Sync_Service

    User_Device_1-&gt;&gt;Sync_Service: Connect (WebSocket with Auth Token)
    User_Device_2-&gt;&gt;Sync_Service: Connect (WebSocket with Auth Token)
    Sync_Service--&gt;&gt;User_Device_1: Connection successful
    Sync_Service--&gt;&gt;User_Device_2: Connection successful

    User_Device_1-&gt;&gt;Sync_Service: emit('PLAY', {songId: 'xyz', timestamp: 10.5})
    Sync_Service-&gt;&gt;User_Device_2: broadcast('PLAY', {songId: 'xyz', timestamp: 10.5})

    User_Device_2-&gt;&gt;Sync_Service: emit('PAUSE', {songId: 'xyz'})
    Sync_Service-&gt;&gt;User_Device_1: broadcast('PAUSE', {songId: 'xyz'})
```

## 🌟 Current Services Spotlight

### 🔐 Auth Service

-   **Port:** `3000`
-   **Description:** The gateway to Sangeet. This service handles user registration, login, and token generation (JWT). It also supports Google OAuth and publishes events on user creation.
-   **Key Technologies:** `Node.js`, `Express`, `MongoDB`, `JWT`, `Passport.js`, `amqplib`.

#### API Endpoints

| Method | Endpoint                | Description                  | Auth Required |
| :----- | :---------------------- | :--------------------------- | :------------ |
| POST   | `/api/auth/register`    | Register a new user          | No            |
| POST   | `/api/auth/login`       | Login a user                 | No            |
| GET    | `/api/auth/google`      | Initiate Google OAuth        | No            |
| GET    | `/api/auth/google/callback` | Google OAuth callback    | No            |

### 🔔 Notification Service

-   **Port:** `3001`
-   **Description:** This service is the messenger, keeping users informed. It listens for events via RabbitMQ and sends emails for events like user registration.
-   **Key Technologies:** `Node.js`, `Express`, `amqplib`, `Nodemailer`.
-   **Consumed Events:**
    -   `USER_CREATED`

## 🚧 Roadmap to Awesomeness: What's Next for Sangeet?

-   [x] **Auth Service:** Secure user authentication with JWT and Google OAuth.
-   [x] **Notification Service:** Asynchronous email notifications.
-   [x] **RabbitMQ Integration:** Implemented for robust inter-service communication.
-   [x] **Docker Containerization:** All services are containerized.
-   [ ] **Music Service:** To manage song uploads, metadata, and streaming links from S3.
-   [ ] **Sync Service:** To handle real-time playback synchronization using WebSockets.
-   [ ] **AWS Deployment:** Deploy all services to a production-ready AWS environment.
-   [ ] **Frontend Application:** A sleek, responsive React frontend to bring the Sangeet experience to life.

## 🛠️ Core Technologies Powering Sangeet

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB
-   **Authentication:** Passport.js, JWT, bcryptjs
-   **Messaging:** RabbitMQ
-   **Email:** Nodemailer
-   **Containerization:** Docker
-   **Cloud Provider:** Amazon Web Services (AWS)
    -   **Compute:** Elastic Container Service (ECS)
    -   **Storage:** S3
    -   **Networking:** Elastic Load Balancing (ELB)

## 👋 Contributing: Be a Part of Sangeet!

Contributions are welcome! If you have ideas for new features, bug fixes, or improvements, please open an issue or submit a pull request. Let's build the future of music together!