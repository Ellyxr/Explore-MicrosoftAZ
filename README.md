# Azure Student Starter
## Start on Section 2!

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
3. Under **Deployment details**, choose **GitHub**, authorize GitHub, and select this repository and the `main` branch. Click Review + Create, then click Basics.
4. In **Build details**, set:
   - **Build Presets**: `(detected)`
   - **App location**: `/client`
   - **Api location**: leave blank
   - **Output location**: `dist`
5. Create the Static Web App. Azure adds a GitHub Actions workflow. This repository also includes `.github/workflows/deploy-client.yml`; Go home. Click Static Web Apps, then your created app.

 > Jump to Section 4 before proceeding, and go back here after getting your API URL upon completing Section 4 | Step 6.

6. In the Static Web App, open **Settings > Environment Variables**, add `VITE_API_BASE_URL` with the full API URL, for example `https://YOUR-APP.azurewebsites.net`, and save.
7. Because Vite environment variables are compiled into static files, also add a GitHub repository secret named `VITE_API_BASE_URL` with that same URL. The included workflow uses the secret during the build.

> Open Github > Go to your repository > Click Settings > Under Security and Quality section, click Secrets and Variables > Add new secret 
>> Name: VITE_API_BASE_URL
>>  
>> Secret: Your API URL from Section 4!
>
>> Name: AZURE_STATIC_WEB_APPS_API_TOKEN
>
>> Secret: In your static web app > Overview > Click Manage Deployment Token > Copy and paste here

>> Sidenote: You might need to check your Static web url again on azure and update your secreat at some point.

8. Go back to your code editor and type in the terminal:
> git fetch ; git pull 

Then create a small change and push it to `main` or rerun the client workflow from the GitHub **Actions** tab. Open the generated `https://YOUR-STATIC-APP.azurestaticapps.net` URL.

> How to push:
>> git add .
>
>> git commit -m "Your msg here"
>
>> git push
>
>> Before proceeding, go to Section 4 | Step 7

9. Click **Call /api/hello**. If the browser reports a CORS error, update the App Service `CORS_ORIGINS` value to the exact Static Web Apps URL, save, and restart the API.

## 4. Deploy the Express API to App Service Free

1. Select **Create a resource**, search for **Web App**, and select **Create**.
2. Select your Azure subscription and create a new resource group, such as `rg-azure-student-starter`.
3. Enter a globally unique app name, such as `yourname-student-api`. The API URL will be `https://yourname-student-api.azurewebsites.net`.
4. Set **Publish** to **Code**, **Runtime stack** to **Node 22 LTS**, and choose **Japan East**.

> Specifically, you can see the available regions you can deploy on by: Home > Search Policy > Search Assignments > Click "Allowed Resource.." >  See parameter value

5. For **Linux Plan**, create a new plan and open its pricing tier. Select **F1 (Free)**, then verify the summary says **Free** before selecting it.
6. Select **Review + create**, verify the estimated cost is `0`, then create the app.

> If you were not able to get ur API URL. Go Home > Resource > Click your app > Copy Default Domain. 

> Go back to Section 3 | Step 5

7. In the Web App, open **Settings > Environment Variables** and add:


   - `CORS_ORIGINS` = `Use your frontend URL from static web app`
   - `SCM_DO_BUILD_DURING_DEPLOYMENT` = `true`
   - `WEBSITE_NODE_DEFAULT_VERSION` = `22`


8. Select **Save**, then open **Configuration > Stack settings**. Set **Startup Command** to `npm start`, save, and restart the app.
9. Open **Deployment Center**, choose **GitHub**, authorize GitHub, select the repository and `main` branch. 

10. In the app's **Overview**, select **Download publish profile** and add its complete contents to a GitHub repository secret named `AZUREAPPSERVICE_PUBLISHPROFILE`. Also add `AZURE_WEBAPP_NAME` with the Web App name. The workflow at `.github/workflows/deploy-server.yml` then deploys the `server` folder on pushes to `main`.

> If you cannot download publish profile > Go to Settings > Click Configuration > check "SCM Basic Auth..." and try step 9 again

11. Test the API in a browser: `https://YOUR-APP.azurewebsites.net/api/hello`. It should return JSON.

The backend uses `CORS_ORIGINS` as a comma-separated allowlist. For the first deployment, use exactly the Static Web Apps hostname. Do not add a trailing slash.

## Ideal End Result
[![image-2026-09-06-205548570.png](https://i.postimg.cc/d14zs7P4/image-2026-09-06-205548570.png)](https://postimg.cc/xJNsg1dz)

If you see this, **GREAT JOB!** Now you know how to deploy a website on Microsoft Azure!

## Troubleshooting

### The API URL says `Cannot GET /`

That is expected. The Express server does not define a route for `/`. Test these routes instead:

```text
https://YOUR-APP.azurewebsites.net/health
https://YOUR-APP.azurewebsites.net/api/hello
```

The first should return `{"status":"ok"}`. Open the React frontend from its Static Web Apps URL, not from the API URL.

### The frontend tries `localhost:3000`

The production frontend was built without the Azure API URL. In GitHub, open **Settings > Secrets and variables > Actions** and create or update the repository secret named `VITE_API_BASE_URL`. Its value should be the complete App Service URL, including `https://` and without a trailing slash.

Then rerun **Actions > Deploy client to Azure Static Web Apps** on the `main` branch and hard-refresh the browser. The `client/.env.example` value may remain `http://localhost:3000`; that file is only a local-development template.

### The browser reports a CORS error

Set the App Service application setting `CORS_ORIGINS` to the exact Static Web Apps frontend URL:

```text
CORS_ORIGINS=https://YOUR-STATIC-APP.azurestaticapps.net
```

Include `https://` and do not add a trailing slash. `CORS_ORIGINS` is the frontend URL; `VITE_API_BASE_URL` is the backend URL. Save the setting and restart the App Service.

### The API returns `503 Service Unavailable`

This means the App Service process is not running. Check **App Service > Configuration > General settings**:

```text
Startup command: npm start
Runtime stack: Node 22 LTS
```

Also confirm `SCM_DO_BUILD_DURING_DEPLOYMENT` is `true`, save the settings, and restart the app. Test `/health` directly before testing the frontend.

### The app reports `ContainerStartupFailure`

The deployed server package must contain these files at its application root:

```text
package.json
src/index.js
```

For the included GitHub Actions workflow, confirm the App Service deployment step uses:

```yaml
package: ./server
```

The workflow must deploy the `server` folder, not only the repository root or the `client` folder.

### Log Stream says `No instances found` or returns `403 Site Disabled`

Azure has no running App Service instance. Check **App Service > Overview** and select **Start** if the app is stopped. Check the linked App Service plan is active and still uses `F1 Free`. Check the **Activity log** for subscription, quota, policy, or provisioning errors.

If the site remains disabled, create a new resource group and retry in another region allowed by your subscription. Never switch to a paid tier just to bypass this error.

### Azure says no available instances or blocks the region

The subscription policy and App Service capacity are separate from your application. A region can be allowed but temporarily lack capacity for your plan. Try a new resource group, wait and retry, or choose another region from Azure's allowed-region list. Before creating the resource, verify the pricing tier is `F1 Free` and the estimated cost is `$0`.

### GitHub Actions cannot find `main`

Push the branch and at least one commit to GitHub:

```bash
git branch -M main
git push -u origin main
```

Refresh Azure's GitHub connection and confirm you have write access to the repository. The repository must contain the workflow files under `.github/workflows/`.

### Static Web Apps deployment says `deployment_token was not provided`

Create the repository secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`. Get the value from the Static Web App's **Overview > Manage deployment token** page. Do not put the token in the README, source code, or chat.

### App Service deployment says `Site Disabled (403)` or no deployment is found

First make sure the App Service is running. Then confirm these GitHub repository secrets exist with the exact names:

```text
AZURE_WEBAPP_NAME
AZUREAPPSERVICE_PUBLISHPROFILE
```

The publish profile is sensitive deployment information. Do not commit it or share its contents. If Basic Authentication is disabled, temporarily enable **SCM Basic Auth Publishing Credentials** under **Configuration > General settings**, download a new profile, update the GitHub secret, and disable Basic Authentication again after deployment.

### The API deployment succeeds but the app still shows an old version

Open GitHub **Actions** and confirm the latest workflow run succeeded. Restart the App Service, then test `/health` and `/api/hello` directly. For the frontend, rerun its workflow after changing `VITE_API_BASE_URL`, because Vite embeds that value during the build.

### I did everything but it still says Error 503

You might need to check if you have met your status quota on Overview. By this point, you can choose to scale up your Resource group to B1 just to see if it works, and downgrade to a free plan after confirming.

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
