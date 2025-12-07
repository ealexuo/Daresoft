using System.Data;
using System.Threading.Tasks;

namespace Daresoft.Core.Data
{
    public interface IConnectionProvider
    {
        Task<IDbConnection> OpenAsync();
    }
}
