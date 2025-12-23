using Daresoft.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface IContactsService
    {
        Task<ContactModel> GetByIdAsync(int contactId);
        Task<ContactModel> CreateAsync(ContactModel contact, int currentUserId);
        Task<ContactModel> UpdateAsync(ContactModel contact, int currentUserId);
        Task<List<ContactModel>> GetAllAsync(int offset, int fetch, string searchText, bool? isSupplier);
        Task<bool> DeleteAsync(int contactId, int currentUserId);
    }
}
