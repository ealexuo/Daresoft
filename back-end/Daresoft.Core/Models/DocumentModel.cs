using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class DocumentModel
    {
        public int Id { get; set; }
        public int CaseFileId { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public string ContentType { get; set; }
        public int Size { get; set; }
        public string? UploadLink { get; set; }
    }
}
