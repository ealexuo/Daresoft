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
            string connectionString = Environment.GetEnvironmentVariable("AzureBlobStorageConnectionString", EnvironmentVariableTarget.Machine);
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
    }
}
