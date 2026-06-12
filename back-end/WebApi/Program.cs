using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var port = Environment.GetEnvironmentVariable("PORT");

            var builder = new WebHostBuilder()
                  .UseKestrel()
                  .UseIISIntegration()
                  .UseContentRoot(Directory.GetCurrentDirectory())
                  .ConfigureAppConfiguration((hostingContext, config) =>
                  {
                      var env = hostingContext.HostingEnvironment;

                    // Busca el folder espec�fico de configuraci�n
                    var appConfigFolder = Path.Combine(env.ContentRootPath, "appconfig");

                    //carga el archivo de configuraci�n espec�fico
                    config.AddJsonFile(Path.Combine(appConfigFolder, "appsettings.json"), optional: true)
                          .AddJsonFile(Path.Combine(appConfigFolder, $"appsettings.{env.EnvironmentName}.json"), optional: true);

                      config.AddEnvironmentVariables();

                  })
                  .ConfigureLogging((hostingContext, logging) =>
                  {
                      logging.ClearProviders();
                      logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                      logging.AddConsole();
                      logging.AddDebug();
                  })
                  .UseDefaultServiceProvider((ctx, opts) =>
                  {
                      opts.ValidateScopes = ctx.HostingEnvironment.IsDevelopment();
                  })
                  .UseStartup<Startup>();

            if (!string.IsNullOrEmpty(port))
                builder.UseUrls($"http://*:{port}");

            return builder.Build();
        }
    }
}
