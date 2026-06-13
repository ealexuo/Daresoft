# Daresoft Back-End — Claude Code Guide

## Project Overview

ASP.NET Core (.NET 10) REST API for a case/document management system. The solution has two parallel module families:
- **Daresoft.*** — modern modules (C#, netstandard2.1). New features go here.
- **Qfile.*** — legacy modules with Spanish naming conventions. Do not add new features here.

Entry point: `WebApi/` — controllers, `Program.cs`, `Startup.cs`, config.

---

## Common Commands

### Build
```powershell
dotnet build
```

### Run Locally
```powershell
dotnet run --project WebApi
```
API starts at `http://localhost:5000`. Uses `WebApi/appconfig/appsettings.Development.json` automatically.

### Test
```powershell
dotnet test Qfile.Tests/
```

### Publish
```powershell
dotnet publish WebApi/WebApi.csproj -c Release -o ./publish
```

### Deploy to Azure
```powershell
dotnet publish WebApi/WebApi.csproj -c Release -o ./publish
Compress-Archive -Path ./publish/* -DestinationPath ./publish.zip -Force
az webapp deployment source config-zip --resource-group RG_Daresoft --name daresoft --src ./publish.zip
```

---

## Architecture

```
Controllers (WebApi)
    → Services (Daresoft.Core/Services)
        → Data (Daresoft.Data)
            → SQL Server via Dapper
```

- No Entity Framework — all SQL is written by hand in `Daresoft.Data/`
- No migrations — schema changes require manual SQL scripts
- Document files stored in Azure Blob Storage; only metadata in SQL
- Azure Blob access uses short-lived SAS tokens (1 minute expiry)

---

## Configuration

Config files live in `WebApi/appconfig/` — **not** the project root.

- `appsettings.json` — empty placeholders only, safe to commit
- `appsettings.Development.json` — local dev values (SQL, JWT secret, CORS origins)

Local dev connection string and JWT secret are in `appsettings.Development.json`.

For production, all values are set as Azure App Service environment variables using `__` double-underscore notation:
- `ConnectionStrings__SQLConnection`
- `ApplicationSettings__JWT_Secret`
- `ApplicationSettings__Client_URLs`
- `AzureBlobStorageConnectionString`

---

## Key Files

| File | Purpose |
|---|---|
| `WebApi/Program.cs` | Host builder — Kestrel, IIS integration, config loading |
| `WebApi/Startup.cs` | DI registration, CORS, JWT, middleware pipeline |
| `WebApi/appconfig/appsettings.json` | Base config (placeholders) |
| `WebApi/appconfig/appsettings.Development.json` | Local dev config |
| `WebApi/web.config` | IIS hosting model (OutOfProcess — do not change) |
| `WebApi/WebApi.csproj` | Package references, appconfig copy rule |
| `Daresoft.Core/Services/` | Business logic interfaces and implementations |
| `Daresoft.Data/` | Dapper repositories |
| `Daresoft.Integrations/` | Azure Blob Storage SAS token generation |

---

## Adding a New Feature (Pattern)

When adding a new resource (e.g. `Invoice`):

1. **Model** — add to `Daresoft.Core/Models/`
2. **Data interface** — add `IInvoicesData` to `Daresoft.Core/Data/`
3. **Data implementation** — add `InvoicesData` to `Daresoft.Data/` using Dapper
4. **Service interface** — add `IInvoicesService` to `Daresoft.Core/Services/`
5. **Service implementation** — add `InvoicesService` to `Daresoft.Core/Services/`
6. **Register in DI** — add `AddTransient` calls for both in `Startup.cs`
7. **Controller** — add `InvoicesController` to `WebApi/Controllers/`

All controllers require `[Authorize]` — the JWT user ID is extracted from claims:
```csharp
var identity = HttpContext.User.Identity as ClaimsIdentity;
int currentUserId = int.Parse(identity.FindFirst("UserId").Value);
```

---

## Important Rules

- **Never use `AllowAnyOrigin()` in CORS** — always use `WithOrigins()` driven by `ApplicationSettings:Client_URLs`
- **Never hardcode secrets** — credentials belong in `appsettings.Development.json` (local) or Azure env vars (production)
- **Never change `hostingModel` in `web.config`** — `OutOfProcess` is required; in-process causes startup timeouts on Windows App Service
- **Do not add packages that make outbound network calls on startup** without verifying they work on the target App Service tier — this caused a 120-second startup hang with Exceptionless on F1
- **New features go in Daresoft.* projects** — do not extend Qfile.*

---

## Azure Resources

| Resource | Name |
|---|---|
| App Service | daresoft |
| Resource Group | RG_Daresoft |
| SQL Server | daresoft-sql-server-001.database.windows.net |
| Database | arael |
| Storage Account | daresoft |
| Blob Container | daresoft-test |

The SQL database is on the **Serverless** tier and auto-pauses after 1 hour of inactivity. UptimeRobot pings `/health` every 5 minutes to keep it alive — the health endpoint includes a SQL check (`SELECT 1`).

---

## Debugging Azure Issues

**Enable stdout logging** (temporarily) for startup crashes:
In `WebApi/web.config` set `stdoutLogEnabled="true"`, redeploy, then check logs in Kudu:
`https://daresoft.scm.azurewebsites.net` → Debug console → `LogFiles/`

Remember to set it back to `false` after diagnosing.

**View live logs:**
Azure portal → daresoft App Service → Monitoring → Log stream
