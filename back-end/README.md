# Daresoft Back-End

ASP.NET Core REST API for a case/document management system. Manages case files, tasks, documents, contacts, and users with Azure Blob Storage for file handling and JWT-based authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | .NET 10 |
| Language | C# |
| API Framework | ASP.NET Core (Kestrel) |
| Database | SQL Server + Dapper (raw SQL, no EF migrations) |
| Authentication | JWT Bearer (24h expiry) |
| Password Hashing | PBKDF2-HMAC-SHA256, 10k iterations |
| File Storage | Azure Blob Storage (SAS tokens) |
| Email | MailKit, SendGrid, Gmail (legacy) |
| PDF Generation | itext7 |
| DI Registration | Scrutor (assembly scanning) |
| Testing | xUnit + Moq |
| Containerization | Docker (multi-stage build) |

---

## Solution Structure

```
Daresoft.sln
├── WebApi/                    # Entry point — controllers, Program.cs, config
├── Daresoft.Core/             # Business logic — services and domain models
├── Daresoft.Data/             # Data access — Dapper repositories
├── Daresoft.Integrations/     # External services — Azure Blob Storage
├── Qfile.Core/                # Legacy business logic (Spanish naming)
├── Qfile.Datos/               # Legacy data access
├── Qfile.Integraciones/       # Legacy integrations
└── Qfile.Tests/               # Unit tests
```

### Architecture

Controllers (WebApi) → Services (Daresoft.Core) → Data (Daresoft.Data) → SQL Server

Document operations go through Daresoft.Integrations for Azure Blob SAS URL generation.

---

## Domain Entities

- **UserProfile** — user accounts with roles, credentials, and password change flags
- **Contact** — people or companies; supplier flag distinguishes vendors
- **CaseFile** — main case entity with a case number and workflow state
- **Task** — work items within a case file; assignable, prioritizable, completable
- **Document** — file metadata; binary stored in Azure Blob Storage
- **Workflow / CaseFileWorkflow** — process stages assigned to case files

---

## API Endpoints

All routes are prefixed with `/api/`.

| Resource | Route | Methods |
|---|---|---|
| Auth | `/authentication/signin` | POST |
| Auth | `/authentication/password` | PUT |
| Users | `/users` | GET, POST, PUT |
| Users | `/users/{userId}` | DELETE |
| Contacts | `/contacts` | GET (paginated + filters), POST, PUT |
| Contacts | `/contacts/{contactId}` | GET, DELETE |
| Case Files | `/casefiles` | GET, POST, PUT |
| Case Files | `/casefiles/{caseFileId}` | GET, DELETE |
| Case Files | `/casefiles/workflows` | PUT (batch workflow update) |
| Tasks | `/tasks` | GET, POST, PUT |
| Tasks | `/tasks/{taskId}` | GET, DELETE |
| Documents | `/documents/read-url/{documentId}` | GET (SAS read URL) |
| Documents | `/documents/upload-url/{documentId}` | GET (SAS upload URL) |
| Workflows | `/workflows` | GET, POST, PUT |
| Health | `/health` | GET |

All endpoints except `/authentication/signin` require a valid JWT Bearer token.

---

## Configuration

Configuration files live in `WebApi/appconfig/` (not the project root).

- `appsettings.json` — base config with empty placeholders (safe to commit)
- `appsettings.Development.json` — local dev overrides (SQL connection, JWT secret, CORS origins)

```json
{
  "ConnectionStrings": {
    "SQLConnection": ""
  },
  "ApplicationSettings": {
    "JWT_Secret": "",
    "Client_URLs": ""
  }
}
```

### CORS

Allowed origins are configured via `ApplicationSettings:Client_URLs` as a comma-separated list:

```
http://localhost:4200,http://localhost:3000
```

Set multiple production origins the same way, separated by commas.

---

## Running Locally

### Prerequisites

- .NET 10 SDK
- SQL Server instance
- Azure Storage account (or Azurite for local emulation)

### Steps

```powershell
# Restore dependencies
dotnet restore

# Run (uses appsettings.Development.json automatically)
dotnet run --project WebApi
```

API will be available at `http://localhost:5000`.

Local dev credentials are configured in `WebApi/appconfig/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "SQLConnection": "Data Source=localhost;Initial Catalog=daresoft_test;User Id=dev;Password=sql;"
  },
  "ApplicationSettings": {
    "JWT_Secret": "<your-local-secret>",
    "Client_URLs": "http://localhost:4200,http://localhost:3000"
  }
}
```

---

## Docker

```powershell
# Build
docker build -t daresoft-backend .

# Run
docker run -p 8080:8080 `
  -e PORT=8080 `
  -e AzureBlobStorageConnectionString="<connection-string>" `
  -e ConnectionStrings__SQLConnection="<sql-connection-string>" `
  -e ApplicationSettings__JWT_Secret="<secret>" `
  -e ApplicationSettings__Client_URLs="<frontend-url>" `
  daresoft-backend
```

The container listens on the port defined by the `PORT` environment variable (defaults to `8080`).

---

## Azure App Service Deployment

### Required Azure Resources

| Resource | Purpose |
|---|---|
| App Service (Windows) | Hosts the API |
| App Service Plan | Compute — minimum B1 for production |
| Azure SQL Database | Application database |
| Azure Storage Account | Document storage (Blob) |

### App Service Configuration

In **App Service → Settings → Environment variables**, set the following:

| Key | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__SQLConnection` | Azure SQL connection string (ADO.NET format) |
| `ApplicationSettings__JWT_Secret` | A strong random secret (min 32 characters) |
| `ApplicationSettings__Client_URLs` | Frontend URL(s), comma-separated |
| `AzureBlobStorageConnectionString` | Azure Blob Storage connection string |

> The `__` double-underscore maps env vars to nested JSON config keys in ASP.NET Core.

The frontend URL can be found in **Storage Account → Endpoints → Static website**.

The SQL connection string can be found in **SQL Database → Connection strings → ADO.NET**. Replace the `{your_password}` placeholder with your actual credentials.

### SQL Server Firewall

In **Azure SQL Server → Networking**, enable **"Allow Azure services and resources to access this server"** so the App Service can reach the database.

### Hosting Model

The app runs as **OutOfProcess** (Kestrel behind IIS) as defined in `WebApi/web.config`. This is required — in-process hosting causes startup timeouts on Windows App Service with this configuration.

### Publishing and Deploying

```powershell
# Build and publish
dotnet publish WebApi/WebApi.csproj -c Release -o ./publish

# Zip the output
Compress-Archive -Path ./publish/* -DestinationPath ./publish.zip -Force

# Deploy via Azure CLI
az webapp deployment source config-zip --resource-group RG_Daresoft --name daresoft --src ./publish.zip
```

### Keeping the Database Alive

The Azure SQL database uses the **Serverless** tier which auto-pauses after 1 hour of inactivity. The `/health` endpoint runs a SQL query (`SELECT 1`) on every call, so pinging it regularly prevents the database from pausing.

**UptimeRobot** (uptimerobot.com) is configured to ping the health endpoint every 5 minutes. To set it up on a new environment:

1. Log in to [uptimerobot.com](https://uptimerobot.com)
2. Click **Add New Monitor**
3. Set:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Daresoft API
   - **URL:** `https://<your-app>.azurewebsites.net/health`
   - **Monitoring Interval:** 5 minutes
4. Click **Create Monitor**

This also sends an email alert if the endpoint goes down.

---

### Verifying the Deployment

```
GET https://<your-app>.azurewebsites.net/health
```

Should return `Healthy`. Then verify authentication:

```
POST https://<your-app>.azurewebsites.net/api/authentication/signin
```

---

## Testing

```powershell
dotnet test Qfile.Tests/
```

---

## Checklist: Preparing an ASP.NET Core App for Windows Azure App Service

Use this as a guide when deploying a similar project to Windows Azure App Service for the first time.

### 1. Port Binding — `Program.cs`

Windows App Service uses IIS + ANCM to manage port binding. The app must not hardcode a port or override it unconditionally.

- Add `.UseIISIntegration()` to the `WebHostBuilder`
- Only apply `.UseUrls()` when the `PORT` env var is explicitly set (for Docker/Linux use):

```csharp
var port = Environment.GetEnvironmentVariable("PORT");
var builder = new WebHostBuilder()
    .UseKestrel()
    .UseIISIntegration()
    .UseContentRoot(Directory.GetCurrentDirectory())
    ...
    .UseStartup<Startup>();

if (!string.IsNullOrEmpty(port))
    builder.UseUrls($"http://*:{port}");

return builder.Build();
```

### 2. Hosting Model — `web.config`

Create a `web.config` in the WebApi project root with `hostingModel="OutOfProcess"`. In-process hosting can cause 120-second startup timeouts on Windows App Service.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet"
                  arguments=".\WebApi.dll"
                  stdoutLogEnabled="false"
                  stdoutLogFile="\\?\%home%\LogFiles\stdout"
                  hostingModel="OutOfProcess" />
    </system.webServer>
  </location>
</configuration>
```

> Set `stdoutLogEnabled="true"` temporarily if the app fails to start — logs will appear in Kudu under `LogFiles/`. Disable it again after diagnosing.

### 3. Configuration — Secrets and Environment Variables

- `appsettings.json` should contain only empty placeholders — no credentials
- `appsettings.Development.json` holds local dev values
- All production values are set as environment variables in **App Service → Settings → Environment variables**
- Use `__` (double underscore) to map nested config keys: `ApplicationSettings__JWT_Secret`

Check that these are all set in Azure before starting the app:

| Key | Description |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | Set to `Production` |
| `ConnectionStrings__SQLConnection` | Azure SQL connection string |
| `ApplicationSettings__JWT_Secret` | Strong random string, min 32 characters |
| `ApplicationSettings__Client_URLs` | Frontend URL(s), comma-separated |
| `AzureBlobStorageConnectionString` | Azure Blob Storage connection string |

### 4. Config Files Included in Publish Output — `.csproj`

If config files live in a custom folder (e.g. `appconfig/`) instead of the project root, verify they are copied to the publish output. Add this to the `.csproj` if missing:

```xml
<ItemGroup>
  <Content Update="appconfig\**\*">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
  </Content>
</ItemGroup>
```

> Use `Update` not `Include` — the SDK already includes content files by default and `Include` will cause a duplicate items build error.

### 5. CORS — `Startup.cs` + Azure Portal

- Do not combine `WithOrigins(...)` and `AllowAnyOrigin()` — this is contradictory and a security issue
- Drive allowed origins from config so they can be changed per environment without code changes:

```csharp
var allowedOrigins = (Configuration["ApplicationSettings:Client_URLs"] ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins, builder =>
    {
        builder.WithOrigins(allowedOrigins)
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

**Important — also add the frontend URL in the Azure portal:** Go to **App Service → API → CORS** and add the frontend origin (e.g. `https://yourapp.z13.web.core.windows.net`). Azure's platform-level CORS handles preflight requests before they reach the app and is the reliable layer for production. The code-level CORS above handles local development. Both are needed.

### 6. Packages That Make Outbound Network Calls on Startup

Check for any packages that connect to external services at startup (e.g. error tracking, telemetry, feature flags). On restricted App Service tiers (F1/Free) these will cause startup to hang for exactly 120 seconds before ANCM kills the process.

- **Exceptionless** (`Exceptionless.AspNetCore`) — connects to `collector.exceptionless.io` on startup. Remove if unused; requires B1 or higher if kept.
- Apply the same scrutiny to any similar monitoring/observability package.

### 7. SQL Server Firewall

In **Azure SQL Server → Networking**, enable **"Allow Azure services and resources to access this server"**, or add the App Service outbound IPs manually (found in **App Service → Properties → Outbound IP addresses**). Without this the app will start but all database calls will fail.

---

## Notes

- The codebase contains two parallel module families: modern **Daresoft.*** and legacy **Qfile.*** (Spanish naming convention). New features should target the Daresoft.* modules.
- There is no migration framework — schema changes require manual SQL scripts.
- Azure Blob SAS tokens are short-lived (1 minute) for both read and upload operations.
- Document paths follow the pattern: `/company/case-files/{caseFileId}/workflows/{workflowId}/...`
- **Exceptionless** is not currently included. If re-added (`Exceptionless.AspNetCore` package + `app.UseExceptionless(Configuration)`), it will attempt to reach `collector.exceptionless.io` on startup. On the F1 (Free) App Service tier this causes a 120-second startup hang due to outbound network restrictions. Exceptionless requires B1 or higher to work reliably.
