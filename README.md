# Heyama Objects API

Backend REST API for the **Heyama Developer Technical Assessment**.

This project provides a scalable backend service that manages a collection of **Objects**, including image uploads, real-time synchronization, and data persistence.

The API is built using **NestJS**, **MongoDB**, and **Cloudflare R2 storage**, and enables both **mobile (React Native)** and **web (Next.js)** applications to interact through a centralized service.

---

## 🚀 Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** MongoDB (Native Driver)
* **Storage:** Cloudflare R2 (S3-compatible)
* **Realtime Communication:** Socket.IO
* **File Upload:** Multer
* **Configuration Management:** Convict
* **Architecture Style:** Modular & Scalable REST API

---

## 📁 Project Structure

```
src/
│
├── common/            # Shared logging utilities
├── database/          # MongoDB connection service
├── environments/      # Environment JSON configs (Convict)
├── module/            # Feature modules
│   └── objects/       # Objects module
│       ├── dto/
│       ├── entities/
│       ├── gateway/
│       ├── repositories/
│       ├── objects.controller.ts
│       ├── objects.service.ts
│       └── objects.module.ts
├── storage/           # R2 upload & deletion logic
├── app.module.ts
└── main.ts
```

---

## 📦 Features

✅ Create Objects with image upload
✅ Retrieve all Objects
✅ Retrieve single Object
✅ Delete Object and associated image
✅ Realtime updates across clients
✅ R2 image storage
✅ MongoDB persistence
✅ Environment validation via Convict

---

## 🧱 Object Model

Each Object contains:

| Field       | Type   | Description         |
| ----------- | ------ | ------------------- |
| title       | string | Object title        |
| description | string | Object description  |
| imageUrl    | string | Public R2 image URL |
| createdAt   | Date   | Creation timestamp  |

---

## ⚙️ Environment Configuration

Environment variables are managed using **Convict** and loaded from JSON files under `src/environments/`.

The active environment is determined by the `NODE_ENV` variable:

| `NODE_ENV`    | Config file                          |
| ------------- | ------------------------------------ |
| `development` | `src/environments/development.json`  |
| `production`  | `src/environments/production.json`   |

You can also override values using environment variables or a `.env` file at the project root:

```
NODE_ENV=development
IP_ADDRESS=127.0.0.1
HOST=127.0.0.1
PORT=8080

DB_MONGO_HOST=127.0.0.1:27017
DB_NAME=heyama_exam
DB_USERNAME=
DB_PASSWORD=

BASE_URL=http://localhost:8080
BASE_PATH=/api/v1

R2_ACCOUNT_ID=xxxx
R2_ACCESS_KEY=xxxx
R2_SECRET_KEY=xxxx
R2_BUCKET=heyama
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

Convict validates configuration at startup and prevents the application from running with invalid or missing variables.

---

## 🗄️ Database

MongoDB is accessed using the **official MongoDB Driver**.

No ORM or ODM (such as Mongoose) is used to maintain flexibility and performance.

Connection lifecycle is handled through a dedicated service initialized during application bootstrap.

### Connection Strategy

The connection URL is built differently based on the environment:

- **Development**: `mongodb://user:password@host/dbName?retryWrites=true&w=majority` (or without auth if not set)
- **Production**: `mongodb://user:password@host` — the database name is selected after connection via the driver

The active connection string is logged to the console at startup for debugging purposes.

---

## ☁️ Image Storage

Images are uploaded to **Cloudflare R2**.

Uploaded images return a public URL stored in MongoDB.

When an object is deleted:

* Database record is removed
* Associated image is deleted from storage

---

## 🔌 Realtime Updates

The API uses **Socket.IO** to broadcast updates.

Whenever an Object is created or deleted:

* All connected mobile clients receive updates instantly
* All connected web clients synchronize automatically

Event examples:

```
object.created
object.deleted
```

---

## 📡 REST API Endpoints

### Create Object

```
POST /api/v1/objects
```

**Content-Type:** `multipart/form-data`

#### Body

* `title` (string)
* `description` (string)
* `image` (file)

#### Behavior

* Uploads image to R2 storage
* Saves Object in MongoDB
* Emits realtime event

---

### Get All Objects

```
GET /api/v1/objects
```

Returns list of all stored Objects.

---

### Get Single Object

```
GET /api/v1/objects/:id
```

Returns a single Object by ID.

---

### Delete Object

```
DELETE /api/v1/objects/:id
```

Removes:

* MongoDB record
* Stored image from R2

Triggers realtime update.

---

## ▶️ Running the Project

### 1. Install dependencies

```
npm install
```

---

### 2. Start MongoDB

Example using Docker:

```
docker run -d -p 27017:27017 mongo
```

---

### 3. Run development server

```
npm run start:dev
```

Loads `src/environments/development.json`. Server runs on:

```
http://127.0.0.1:8080
```

---

### 4. Run in production mode

```
npm run start
```

Sets `NODE_ENV=production` via `cross-env` and loads `src/environments/production.json`.

To build first then run the compiled output:

```
npm run build
npm run start:prod
```

---

## 🧪 API Testing

You can test endpoints using:

* Postman
* Insomnia
* Thunder Client
* Curl

Example:

```
POST /objects
multipart/form-data
```

---

## 🔄 Realtime Testing

Open both:

* Mobile App
* Web App

Create an Object from one client.

The new Object should appear instantly on all connected clients.

---

## 🧠 Architectural Decisions

### Native MongoDB Driver

Chosen for:

* Performance
* Full control
* Reduced abstraction
* Lightweight dependency footprint

---

### Convict Configuration

Provides:

* Schema validation
* Centralized configuration
* Environment safety
* Production readiness

---

### Modular NestJS Design

Ensures:

* Separation of concerns
* Maintainability
* Scalability
* Testability

---

## 👨‍💻 Author

**Patrick Loïc KANGUE KWELLE**
Fullstack Developer

Portfolio:
https://kangueloic.me

---

## 📄 License

This project is developed as part of the **Heyama Developer Technical Assessment**.
All code is original and created by the author for this assessment.