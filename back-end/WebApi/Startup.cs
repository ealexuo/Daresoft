using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebApi.Models;
using Qfile.Core.Servicios;
using Qfile.Core.Datos;
using Qfile.Datos;
using Exceptionless;
using Daresoft.Core.Services;
using Daresoft.Core.Data;
using Daresoft.Data;

namespace WebApi
{
    public class Startup
    {
        public IConfiguration Configuration { get; private set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Scan(scan => scan
              .FromAssembliesOf(typeof(Daresoft.Data.ConnectionProviderSQLServer), typeof(UsuarioServicio))
              .AddClasses()
              .AsImplementedInterfaces());


            // IoC container ----------------------------------------------------------

            // servicios
            services.AddTransient<ITestServicio, TestServicio>();
            services.AddTransient<IUsuarioServicio, UsuarioServicio>();
            services.AddTransient<ICorreoElectronicoServicio, CorreoElectronicoGmailServicio>();

            services.AddTransient<IAuthenticationService, AuthenticationService>(); // daresoft
            services.AddTransient<IEncryptPasswordService, EncryptPasswordService>(); // daresoft
            services.AddTransient<IUsersService, UsersService>(); // daresoft
            services.AddTransient<IContactsService, ContactsService>(); // daresoft
            services.AddTransient<ICaseFilesService, CaseFilesService>(); // daresoft
            services.AddTransient<ITasksService, TasksService>(); // daresoft
            services.AddTransient<IDocumentsService, DocumentsService>(); // daresoft
            services.AddTransient<IWorkflowsService, WorkflowsService>(); // daresoft


            // datos
            services.AddTransient<ITestDatos, TestDatos>();
            services.AddTransient<IUsuarioDatos, UsuarioDatos>();

            services.AddTransient<IUsersData, UsersData>(); // daresoft
            services.AddTransient<IContactsData, ContactsData>(); // daresoft
            services.AddTransient<ICaseFilesData, CaseFilesData>(); // daresoft
            services.AddTransient<ITasksData, TasksData>(); // daresoft
            services.AddTransient<IDocumentsData, DocumentsData>(); // daresoft
            services.AddTransient<IWorkflowsData, WorkflowsData>(); // daresoft



            // appSettings
            //services.Configure<ApplicationSettingsModelo>(Configuration.GetSection("ApplicationSettings"));
            services.Configure<ApplicationSettingsModel>(Configuration.GetSection("ApplicationSettings"));

            // Cors -------------------------------------------------------------------
            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins,
                builder =>
                {
                    builder.WithOrigins(Configuration["ApplicationSettings:Client_URL"], "http://localhost:3000")
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                });
            });

            services.AddHealthChecks();

            services.AddControllers();

            // JWT --------------------------------------------------------------------
            var key = Encoding.UTF8.GetBytes(Configuration["ApplicationSettings:JWT_Secret"]);

            services.AddAuthentication(a =>
            {
                a.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                a.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                a.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(j =>
            {
                j.RequireHttpsMetadata = false;
                j.SaveToken = false;
                j.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };
            });

            

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //app.UseExceptionless(Configuration);
            //app.UseExceptionless("j7YjK9i2Jz6hTineXkdZugQvEXYrHVmI5Tl3E8fm");
    

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(MyAllowSpecificOrigins);

            app.UseAuthentication(); 
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/health");
            });

        }
    }
}
