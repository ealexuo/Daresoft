using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Daresoft.Core.Models;

namespace Daresoft.Core.Data
{
    public interface ICaseFilesData
    {
        Task<CaseFileModel> GetByIdAsync(int caseFileId);
        Task<CaseFileModel> CreateAsync(CaseFileModel caseFile, int currentUserId);
        Task<CaseFileModel> UpdateAsync(CaseFileModel caseFile, int currentUserId);
        Task<List<CaseFileModel>> GetAllAsync(int offset, int fetch, string searchText);
        Task<bool> DeleteAsync(int caseFileId, int currentUserId);
        Task<bool> UpdateWorkflowAsync(CaseFileWorkflowModel workflow, int currentUserId);
        Task<List<WorkflowTemplateValuesModel>> GetTemplateValuesAsync(int caseFileId);

    }
}
