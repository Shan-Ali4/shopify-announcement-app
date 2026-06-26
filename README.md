# 📢 Shopify Announcement Banner App

A Shopify Embedded App built with the **MERN Stack** that allows merchants to create and manage announcement banners from the Shopify Admin. The announcement is stored in **MongoDB** for audit history, synchronized to **Shopify Shop Metafields** using the Shopify Admin GraphQL API, and displayed across the storefront using a **Theme App Extension (App Embed Block)**.

---

## 📸 Admin Dashboard

![Admin Dashboard](./assets/admin-dashboard.png)

> Replace the image path with your uploaded screenshot (for example `screenshots/dashboard.png`).

---

## 🚀 Features

- Create and manage announcement banners from Shopify Admin
- Save announcements to MongoDB with timestamps
- Maintain announcement history (audit log)
- Synchronize announcements to Shopify Shop Metafields
- Display announcements on every storefront page using Theme App Extension
- Real-time updates after saving announcements
- Embedded Shopify Admin App
- Responsive and clean user interface

---

## 🏗️ Project Architecture

```
Shopify Admin Dashboard
        │
        ▼
React + Polaris UI
        │
        ▼
Express API
        │
        ├────────► MongoDB
        │          (Stores announcement history)
        │
        ▼
Shopify Admin GraphQL API
        │
        ▼
Shop Metafield
(namespace: my_app)
(key: announcement)
        │
        ▼
Theme App Extension
(App Embed Block)
        │
        ▼
Storefront Announcement Banner
```

---

## ⚙️ Tech Stack

### Frontend

- React
- Shopify Polaris
- React Router

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Shopify

- Shopify App CLI
- Shopify Admin GraphQL API
- Shop Metafields
- Theme App Extension
- App Embed Block

---

## 📂 Folder Structure

```
the-app
│
├── app
│   ├── lib
│   │   └── mongodb.js
│   │
│   ├── models
│   │   └── Announcement.js
│   │
│   ├── routes
│   │   ├── app._index.jsx
│   │   └── api.announcement.jsx
│   │
│   └── shopify.server.js
│
├── extensions
│   └── announcement-banner
│       └── blocks
│           └── announcement-banner.liquid
│
├── prisma
│
├── package.json
└── README.md
```

---

## 🔄 Workflow

### Step 1

Merchant opens the Shopify embedded app.

### Step 2

Merchant enters an announcement message.

Example

```
Summer Sale — 40% OFF
```

### Step 3

Click **Save Announcement**.

### Step 4

Backend saves the announcement in MongoDB.

Example Document

```json
{
  "text": "Summer Sale — 40% OFF",
  "createdAt": "2026-06-27T02:36:00Z"
}
```

### Step 5

Backend updates the Shopify Shop Metafield.

Namespace

```
my_app
```

Key

```
announcement
```

### Step 6

Theme App Extension reads the metafield.

```liquid
{{ shop.metafields.my_app.announcement.value }}
```

### Step 7

Banner is displayed automatically on every storefront page.

---

## 🛠 Installation

Clone the repository

```bash
git clone https://github.com/Shan-Ali4/shopify-announcement-app.git
```

Go inside the project

```bash
cd shopify-announcement-app
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file.

```env
MONGODB_URI=

SHOPIFY_API_KEY=

SHOPIFY_API_SECRET=

SHOPIFY_APP_URL=

SCOPES=
```

---

## 📌 Shopify APIs Used

- Shopify Admin GraphQL API
- Shop Metafields API
- Theme App Extension
- App Embed Block

---

## 🎯 Assignment Requirements Completed

- ✔ Shopify Embedded App
- ✔ React Admin Dashboard
- ✔ MongoDB Integration
- ✔ Announcement Audit History
- ✔ Shopify Shop Metafields
- ✔ GraphQL API Integration
- ✔ Theme App Extension
- ✔ App Embed Block
- ✔ Storefront Banner
- ✔ MERN Stack
- ✔ Public GitHub Repository

---

## 💻 Developed By

**Mirza Mohammad Shan Ali**

**GitHub**

https://github.com/Shan-Ali4

---

## 📄 License

This project was developed as part of a Shopify Developer Technical Assessment.
