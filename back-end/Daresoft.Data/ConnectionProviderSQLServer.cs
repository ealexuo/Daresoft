using Daresoft.Core.Data;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace Daresoft.Data
{
    public class ConnectionProviderSQLServer : IConnectionProvider
    {
        private readonly IConfiguration configuration;

        public ConnectionProviderSQLServer(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public async Task<IDbConnection> OpenAsync()
        {
            var connection = new SqlConnection(configuration.GetConnectionString("SQLConnection"));
            await connection.OpenAsync();
            return connection;
        }
    }
}