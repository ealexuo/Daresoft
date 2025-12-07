using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface IEncryptPasswordService
    {
        string HashPassword(string password);

        bool VerifyHashedPassword(string hashedPassword, string providedPassword);
    }
}
