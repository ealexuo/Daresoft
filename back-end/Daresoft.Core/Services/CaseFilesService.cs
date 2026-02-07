using Daresoft.Core.Models;
using Daresoft.Core.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public class CaseFilesService : ICaseFilesService
    {
        private readonly ICaseFilesData _caseFilesData;

        public CaseFilesService(ICaseFilesData caseFilesData)
        {
            _caseFilesData = caseFilesData;            
        }

        public async Task<CaseFileModel> CreateAsync(CaseFileModel caseFile, int currentUserId)
        {
            return await _caseFilesData.CreateAsync(caseFile, currentUserId);
        }

        public async Task<bool> DeleteAsync(int caseFileId, int currentUserId)
        {
            return await _caseFilesData.DeleteAsync(caseFileId, currentUserId);
        }

        public async Task<List<CaseFileModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            return await _caseFilesData.GetAllAsync(offset, fetch, searchText);
        }

        public async Task<CaseFileModel> GetByIdAsync(int caseFileId)
        {
            return await _caseFilesData.GetByIdAsync(caseFileId);
        }

        public async Task<CaseFileModel> UpdateAsync(CaseFileModel caseFile, int currentUserId)
        {
            return await _caseFilesData.UpdateAsync(caseFile, currentUserId);
        }

        public async Task<bool> UpdateWorkflowAsync(CaseFileWorkflowModel workflow, int currentUserId)
        {
            return await _caseFilesData.UpdateWorkflowAsync(workflow, currentUserId);
        }

        public async Task<List<WorkflowTemplateValuesModel>> GetTemplateValuesAsync(int caseFileId)
        {
            return await _caseFilesData.GetTemplateValuesAsync(caseFileId);
        }

    }
}
