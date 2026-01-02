using Daresoft.Core.Models;
using Daresoft.Core.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public class DocumentsService : IDocumentsService
    {
        private readonly IDocumentsData _documentsData;

        public DocumentsService(IDocumentsData documentsData)
        {
            _documentsData = documentsData;            
        }

        public async Task<DocumentModel> CreateAsync(DocumentModel document, int currentUserId)
        {
            return await _documentsData.CreateAsync(document, currentUserId);
        }

        public Task<bool> DeleteAsync(int documentId, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public Task<List<DocumentModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            throw new NotImplementedException();
        }

        public async Task<List<DocumentModel>> GetByCaseFileIdsAsync(List<int> caseFileIds)
        {
            return await _documentsData.GetByCaseFilesIdAsync(caseFileIds);
        }

        public async Task<DocumentModel> GetByIdAsync(int documentId)
        {
            return await _documentsData.GetByIdAsync(documentId);
        }

        public Task<DocumentModel> UpdateAsync(DocumentModel document, int currentUserId)
        {
            throw new NotImplementedException();
        }
    }
}
