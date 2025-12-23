using Daresoft.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface ICaseFilesService
    {
        Task<CaseFileModel> GetByIdAsync(int contactId);
        Task<CaseFileModel> CreateAsync(CaseFileModel contact, int currentUserId);
        Task<CaseFileModel> UpdateAsync(CaseFileModel contact, int currentUserId);
        Task<List<CaseFileModel>> GetAllAsync(int offset, int fetch, string searchText);
        Task<bool> DeleteAsync(int contactId, int currentUserId);
    }
}
