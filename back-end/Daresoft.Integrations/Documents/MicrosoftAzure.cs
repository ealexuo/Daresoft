using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Daresoft.Integrations.Documents
{
    public class MicrosoftAzure : IDocumentsIntegration
    {
        private BlobServiceClient _blobServiceClient;

        public MicrosoftAzure()
        {
            string connectionString = Environment.GetEnvironmentVariable("AzureBlobStorageConnectionString");
            _blobServiceClient = new BlobServiceClient(connectionString);
        }

        public string GetReadURL(string documentPath)
        {
            BlobContainerClient container = _blobServiceClient.GetBlobContainerClient("daresoft-test");
            BlobClient blob = container.GetBlobClient(documentPath);

            var readURI = blob.GenerateSasUri(
                    BlobSasPermissions.Read,
                    DateTimeOffset.UtcNow.AddMinutes(1)
                );

            return readURI.ToString();
        }

        public string GetUploadURL(string documentPath)
        {
            BlobContainerClient container = _blobServiceClient.GetBlobContainerClient("daresoft-test");
            BlobClient blob = container.GetBlobClient(documentPath);

            BlobSasBuilder sasBuilder = new BlobSasBuilder()
            {
                BlobContainerName = container.Name,
                BlobName = documentPath,
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(1)
            };

            // Grant 'Write' and 'Create' permissions for the upload operation            
            sasBuilder.SetPermissions(BlobSasPermissions.Write | BlobSasPermissions.Create);

            // Generate the SAS token
            string sasToken = blob.GenerateSasUri(sasBuilder).Query;

            // The URL format is: https://<account_name>.blob.core.windows.net/<container_name>/<blob_name>?<sas_token>
            string uploadUrl = $"{blob.Uri.AbsoluteUri}{sasToken}";

            return uploadUrl;
        }
    }
}
