using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Daresoft.Core.Models;

namespace Daresoft.Core.Data
{
    public interface IDocumentsData
    {
        Task<DocumentModel> GetByIdAsync(int documentId);
        Task<List<DocumentModel>> GetByCaseFilesIdAsync(List<int> caseFileIds);
        Task<DocumentModel> CreateAsync(DocumentModel document, int currentUserId);
        Task<DocumentModel> UpdateAsync(DocumentModel document, int currentUserId);
        Task<bool> DeleteAsync(int document, int currentUserId);
    }
}
