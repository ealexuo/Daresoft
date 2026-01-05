using Dapper;
using Daresoft.Core.Data;
using Daresoft.Core.Models;
using Daresoft.Core.Types;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
//using Org.BouncyCastle.Asn1.X509;

namespace Daresoft.Data
{
    public class DocumentsData : IDocumentsData
    {
        private readonly IConnectionProvider connectionProvider;

        public DocumentsData(IConnectionProvider connectionProvider)
        {
            this.connectionProvider = connectionProvider;
        }

        public async Task<DocumentModel> CreateAsync(DocumentModel document, int currentUserId)
        {
            int documentId = 0;

            using (var connection = await connectionProvider.OpenAsync())
            {
                string insertDocumentDataSql = @"            
                INSERT INTO Document
                (
                    CaseFileId
                    ,Name
                    ,Path
                    ,ContentType
                    ,Size                    
                )
                OUTPUT INSERTED.Id
                VALUES(
                    @CaseFileId
                    ,@Name
                    ,@Path
                    ,@ContentType
                    ,@Size                    
                )";               

                using (var trx = connection.BeginTransaction())
                {
                    // Insert document data
                    documentId = connection.QuerySingle<int>(insertDocumentDataSql, new
                    {
                        document.CaseFileId,
                        document.Name,
                        document.Path,
                        document.ContentType,
                        document.Size                        
                    }, trx);                                      

                    trx.Commit();
                }
            }

            return await GetByIdAsync(documentId);
        }

        public Task<bool> DeleteAsync(int documentId, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<DocumentModel>> GetByCaseFilesIdAsync(List<int> caseFileIds)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
                    doc.Id	
	                ,doc.CaseFileId
	                ,doc.Name
	                ,doc.Path
	                ,doc.ContentType
	                ,doc.Size	                
                FROM Document doc                
                WHERE doc.CaseFileId IN @CaseFileIds";

                var result = await connection.QueryAsync<DocumentModel>(sqlQuery, new
                {
                    CaseFileIds = caseFileIds
                });

                return result.ToList();
            }
        }

        public async Task<DocumentModel> GetByIdAsync(int documentId)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);

            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
                    doc.Id	
	                ,doc.CaseFileId
	                ,doc.Name
	                ,doc.Path
	                ,doc.ContentType
	                ,doc.Size	                
                FROM Document doc                
                WHERE doc.Id = @DocumentId";

                var result = await connection.QueryAsync<DocumentModel>(sqlQuery, new
                {
                    DocumentId = documentId
                });

                return result.FirstOrDefault();
            }
        }

        public async Task<DocumentModel> UpdateAsync(DocumentModel document, int currentUserId)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string updateDocumentDataSql = @"            
                UPDATE Document set
                    CaseFileId = @CaseFileId
                    ,Name = @Name
                    ,Path = @Path
                    ,ContentType = @ContentType
                    ,Size = @Size
                WHERE Id = @Id
                ";

                using (var trx = connection.BeginTransaction())
                {
                    await connection.ExecuteAsync(updateDocumentDataSql, new
                    {
                        document.Id,
                        document.CaseFileId,
                        document.Name,
                        document.Path,
                        document.ContentType,
                        document.Size
                    }, trx);
                    
                    trx.Commit();
                }
            }
            return await GetByIdAsync(document.Id);
        }
    }
}