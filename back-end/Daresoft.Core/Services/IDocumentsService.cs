using Daresoft.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface IDocumentsService
    {
        Task<DocumentModel> GetByIdAsync(int documentId);
        Task<DocumentModel> CreateAsync(DocumentModel document, int currentUserId);
        Task<DocumentModel> UpdateAsync(DocumentModel document, int currentUserId);
        Task<List<DocumentModel>> GetAllAsync(int offset, int fetch, string searchText);
        Task<List<DocumentModel>> GetByCaseFileIdsAsync(List<int> caseFileIds);
        Task<bool> DeleteAsync(int documentId, int currentUserId);
    }
}
