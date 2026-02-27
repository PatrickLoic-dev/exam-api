# Heyama Objects API

Backend REST API for the **Heyama Developer Technical Assessment**.

This project provides a scalable backend service that manages a collection of **Objects**, including image uploads, real-time synchronization, and data persistence.

The API is built using **NestJS**, **MongoDB**, and **S3-compatible storage**, and enables both **mobile (React Native)** and **web (Next.js)** applications to interact through a centralized service.

---

## 🚀 Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** MongoDB (Native Driver)
* **Storage:** S3-Compatible Object Storage (Cloudflare R2 / MinIO / DigitalOcean Spaces)
* **Realtime Communication:** Socket.IO
* **File Upload:** Multer
* **Configuration Management:** Convict
* **Architecture Style:** Modular & Scalable REST API

---

## 📁 Project Structure

```
src/
│
├── config/            # Application configuration (Convict)
│
├── database/          # MongoDB connection service
│
├── objects/           # Objects module
│   ├── dto/
│   ├── objects.controller.ts
│   ├── objects.service.ts
│   └── objects.module.ts
│
├── storage/           # S3 upload & deletion logic
│
├── gateway/           # Socket.IO realtime gateway
│
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
✅ S3 image storage
✅ MongoDB persistence
✅ Environment validation via Convict

---

## 🧱 Object Model

Each Object contains:

| Field       | Type   | Description         |
| ----------- | ------ | ------------------- |
| title       | string | Object title        |
| description | string | Object description  |
| imageUrl    | string | Public S3 image URL |
| createdAt   | Date   | Creation timestamp  |

---

## ⚙️ Environment Configuration

Environment variables are managed using **Convict**.

Create a `.env` file at the project root:

```
NODE_ENV=development
PORT=3000

MONGO_URI=mongodb://localhost:27017

S3_ENDPOINT=https://your-storage-endpoint
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=heyama
```

Convict validates configuration at startup and prevents the application from running with invalid or missing variables.

---

## 🗄️ Database

MongoDB is accessed using the **official MongoDB Driver**.

No ORM or ODM (such as Mongoose) is used to maintain flexibility and performance.

Connection lifecycle is handled through a dedicated service initialized during application bootstrap.

---

## ☁️ Image Storage

Images are uploaded to an **S3-compatible storage provider**.

Supported providers include:

* Cloudflare R2
* MinIO
* DigitalOcean Spaces
* Any S3-compatible service (except AWS S3)

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
POST /objects
```

**Content-Type:** `multipart/form-data`

#### Body

* `title` (string)
* `description` (string)
* `image` (file)

#### Behavior

* Uploads image to S3 storage
* Saves Object in MongoDB
* Emits realtime event

---

### Get All Objects

```
GET /objects
```

Returns list of all stored Objects.

---

### Get Single Object

```
GET /objects/:id
```

Returns a single Object by ID.

---

### Delete Object

```
DELETE /objects/:id
```

Removes:

* MongoDB record
* Stored image from S3

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

Server runs on:

```
http://localhost:3000
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

## ✅ Evaluation Focus

This backend demonstrates:

* REST API design
* File upload handling
* Cloud storage integration
* Realtime systems
* Clean architecture
* Production-level configuration management

---

## 📌 Notes

* UI design is intentionally minimal.
* Deployment is not required.
* Code is structured for local review.

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