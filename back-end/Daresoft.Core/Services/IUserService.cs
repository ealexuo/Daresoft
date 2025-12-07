using Daresoft.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface IUserService
    {
        Task<UserModel> GetByUserNameAsync(string nombreUsuario);
        Task<UserModel> GetByIdAsync(int idUsuario);
        Task<int> CreateAsync(UserModel usuario, int idUsuarioRegistro);
        Task<int> UpdateAsync(UserModel usuario);
        Task<List<UserModel>> GetAllAsync(int pagina, int cantidad, string buscarTexto);
        Task<bool> DeleteAsync(int idUsuario);        
    }
}
