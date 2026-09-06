# Azure Student Starter

A small full-stack monorepo for learning Azure:

- `client`: React + Vite static frontend
- `server`: Node.js + Express API
- `/api/hello`: sample API route
- `/health`: simple App Service health check

The intended deployment is Azure Static Web Apps Free for `client` and Azure App Service F1 Free for `server`.

## 1. Run locally

Requirements: Node.js 20 or newer and npm 10 or newer.

```bash
npm install
copy client\.env.example client\.env
copy server\.env.example server\.env
npm run dev
```

In a second terminal:

```bash
npm run dev:client
```

Open `http://localhost:5173` and click **Call /api/hello**. The frontend reads `client/.env` and calls `http://localhost:3000`.

On macOS/Linux, use `cp client/.env.example client/.env` and `cp server/.env.example server/.env` instead of `copy`.

## 2. Push to GitHub

Create an empty GitHub repository, then from this folder run:

```bash
git init
git add .
git commit -m "Create Azure student starter"
git branch -M main
git remote add origin https://github.com/Ellyxr/Explore-MicrosoftAZ.git
git push -u origin main
```

Do not commit `.env` files. They are ignored; only `.env.example` files belong in the repository. 

> What do these git commands mean? 
>> [Game: Learn Git commands](https://ohmygit.org)

>> [Web: Git commands](https://learngitbranching.js.org)

## Create MS Azure account
1. Create your account using the link given via DM.
2. Sign in at [portal.azure.com](https://portal.azure.com).

## 3. Deploy the Vite client to Static Web Apps Free
1. In the Azure portal, select **Create a resource**, search for **Static Web App**, and select **Create**.
2. Choose the same subscription and resource group. Enter a unique name, and select the **Free** plan.
3. Under **Deployment details**, choose **GitHub**, authorize GitHub, and select this repository and the `main` branch.
4. In **Build details**, set:
   - **Build Presets**: `Custom`
   - **App location**: `/client`
   - **Api location**: leave blank
   - **Output location**: `dist`
5. Create the Static Web App. Azure adds a GitHub Actions workflow. This repository also includes `.github/workflows/deploy-client.yml`; keep one client workflow, not both.
6. In the Static Web App, open **Configuration > Application settings**, add `VITE_API_BASE_URL` with the full API URL, for example `https://YOUR-APP.azurewebsites.net`, and save.
7. Because Vite environment variables are compiled into static files, also add a GitHub repository secret named `VITE_API_BASE_URL` with that same URL. The included workflow uses the secret during the build.
8. Push a change to `main` or rerun the client workflow from the GitHub **Actions** tab. Open the generated `https://YOUR-STATIC-APP.azurestaticapps.net` URL.
9. Click **Call /api/hello**. If the browser reports a CORS error, update the App Service `CORS_ORIGINS` value to the exact Static Web Apps URL, save, and restart the API.

## 4. Deploy the Express API to App Service Free

1. Select **Create a resource**, search for **Web App**, and select **Create**.
2. Select your Azure subscription and create a new resource group, such as `rg-azure-student-starter`.
3. Enter a globally unique app name, such as `yourname-student-api`. The API URL will be `https://yourname-student-api.azurewebsites.net`.
4. Set **Publish** to **Code**, **Runtime stack** to **Node 22 LTS**, and choose **Japan East**.

> Specifically, you can see the available regions you can deploy on by: Home > Search Policy > Search Assignments > Click "Allowed Resource.." >  See parameter value

5. For **Linux Plan**, create a new plan and open its pricing tier. Select **F1 (Free)**, then verify the summary says **Free** before selecting it.
6. Select **Review + create**, verify the estimated cost is `0`, then create the app.
7. In the Web App, open **Settings > Environment Variables** and add:


   - `CORS_ORIGINS` = `Use your frontend URL from static web app`
   - `SCM_DO_BUILD_DURING_DEPLOYMENT` = `true`
   - `WEBSITE_NODE_DEFAULT_VERSION` = `22`




8. Select **Save**, then open **Configuration > Stack settings**. Set **Startup Command** to `npm start`, save, and restart the app.
9. Open **Deployment Center**, choose **GitHub**, authorize GitHub, select the repository and `main` branch, and choose **App Service build service**. For the monorepo path, set the application/source path to `/server` if the screen offers it. Save the configuration.
10. If Deployment Center does not offer a path field, use the included workflow instead: in the app's **Overview**, select **Get publish profile**, download the file, and add its complete contents to a GitHub repository secret named `AZUREAPPSERVICE_PUBLISHPROFILE`. Also add `AZURE_WEBAPP_NAME` with the Web App name. The workflow at `.github/workflows/deploy-server.yml` then deploys the `server` folder on pushes to `main`.
11. Test the API in a browser: `https://YOUR-APP.azurewebsites.net/api/hello`. It should return JSON.

The backend uses `CORS_ORIGINS` as a comma-separated allowlist. For the first deployment, use exactly the Static Web Apps hostname. Do not add a trailing slash.



## 5. Environment variables

### Local development

`client/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

`server/.env`:

```env
PORT=3000
CORS_ORIGINS=http://localhost:5173
```

### Azure

- `VITE_API_BASE_URL` belongs to the client build. It must be the backend's HTTPS URL with no trailing slash.
- `CORS_ORIGINS` belongs to App Service. It must be the frontend's HTTPS origin with no trailing slash.
- Vite variables are public. Never put passwords, keys, or connection strings in a `VITE_` variable.
- If you change `VITE_API_BASE_URL` in Azure, trigger a new Static Web Apps build; changing a runtime setting alone cannot alter already-built JavaScript.

## 6. Avoid charges

- Select **Free (F1)** for the App Service plan and **Free** for Static Web Apps. Do not select **Basic**, **Standard**, **Premium**, or a paid database.
- Check the final Azure create screen and the plan's **Pricing tier** before creating anything. A free web app inside a paid App Service plan is still billed.
- Do not enable deployment slots, custom domains, private endpoints, Application Insights, Azure SQL, Cosmos DB, storage accounts, or other add-ons for this exercise unless you understand their pricing.
- Set a budget alert under **Cost Management + Billing**. A budget alert does not cap spending, so delete resources you no longer need.
- The Azure for Students offer and free account credits have terms and expiration dates. Track remaining credit and expiry in **Cost Management + Billing**.
- Stop or delete the App Service and its App Service plan when finished. Deleting only the Web App may leave the plan behind.
- The F1 tier has quotas and can sleep or be unavailable under load. That is expected for a classroom demo, not a production service.

## Useful commands

```bash
npm run build       # build the Vite frontend
npm start           # start the API in production mode
```
