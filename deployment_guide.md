# 🚀 PODCASTER — Step-by-Step Deployment Guide

This guide explains how to deploy the backend of your PODCASTER project to **Render** and the frontend to **Vercel** for free.

---

## Part 1: Preparing Your Database (MongoDB Atlas)

Since you are deploying the backend online, the database must allow connections from the hosting server.

1.  Log in to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2.  Go to **Network Access** (under the Security tab on the left).
3.  Click **Add IP Address**.
4.  Choose **Allow Access From Anywhere** (IP `0.0.0.0/0`). Since Render servers use dynamic IP addresses, we must allow access from anywhere.
5.  Click **Confirm**.

---

## Part 2: Deploying the Backend on Render

Render is a free cloud hosting service that runs Node.js applications.

1.  Log in to [Render](https://render.com/).
2.  Click **New +** in the top right and select **Web Service**.
3.  Connect your GitHub account and select your **AUDIO-PODCASTER** repository.
4.  Configure the service:
    *   **Name:** `audio-podcaster` (or any custom name).
    *   **Region:** Select the region closest to you (e.g. Singapore or Oregon).
    *   **Branch:** `main`.
    *   **Root Directory:** `backend` (very important — this tells Render the server code is inside the backend folder).
    *   **Runtime:** `Node`.
    *   **Build Command:** `npm install`
    *   **Start Command:** `node app.js`
5.  Scroll down to **Advanced** and click **Add Environment Variable** to add your secret keys:
    *   `PORT` = `1000`
    *   `MONGO_URI` = `mongodb+srv://...` (your Atlas connection string)
    *   `JWT_SECRET` = `your_jwt_secret_key`
    *   `NODE_ENV` = `production`
6.  Click **Create Web Service**.
7.  Once the build finishes, Render will provide a public URL (e.g. `https://audio-podcaster.onrender.com`). **Copy this URL.**

---

## Part 3: Deploying the Frontend on Vercel

Vercel is the industry standard for hosting React applications.

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** and select **Project**.
3.  Select your **AUDIO-PODCASTER** repository.
4.  Configure the build settings:
    *   **Framework Preset:** `Vite`.
    *   **Root Directory:** `frontend` (very important — this tells Vercel the React code is inside the frontend folder).
5.  Expand the **Environment Variables** section and add:
    *   Key: `VITE_BACKEND_URL`
    *   Value: `https://audio-podcaster.onrender.com` (paste your Render backend URL **without** a trailing slash `/`).
6.  Click **Deploy**.
7.  Vercel will build your React code and provide a public URL for your web app (e.g. `https://audio-podcaster.vercel.app`).

---

## Part 4: Final Step — CORS Configuration Sync

Because of browser security (CORS), the backend must explicitly trust the frontend URL to accept login cookies.

1.  Open `backend/app.js` in your editor.
2.  Look at the CORS origin settings (Lines 13-16):
    ```javascript
    app.use(cors({
        origin: ["http://localhost:5173"],
        credentials:true,
    }));
    ```
3.  You need to add your Vercel URL to this list so the backend trusts it. Change it to:
    ```javascript
    app.use(cors({
        origin: ["http://localhost:5173", "https://your-app-name.vercel.app"],
        credentials:true,
    }));
    ```
4.  Commit and push this change to GitHub. Render will automatically redeploy the backend with the updated CORS policy.
