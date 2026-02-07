using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class WorkflowTemplateModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; }
    }

    public class WorkflowTemplateSectionModel
    {
        public int Id { get; set; }
        public int WorkflowTemplateId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; }
        public int Order { get; set; }
    }

    public class WorkflowTemplateSectionFieldModel
    {
        public int Id { get; set; }
        public int WorkflowTemplateSectionId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; }
        public int Type { get; set; }
        public int Order { get; set; }
    }

    public class WorkflowTemplateValuesModel
    {
        public int Id { get; set; } // Primary Key

        public int CaseFileId { get; set; } // Foreign Key referencing CaseFile(Id)
        public int WorkflowTemplateId { get; set; } // Foreign Key referencing WorkflowTemplate(Id)
        public int WorkflowTemplateSectionId { get; set; } // Foreign Key referencing WorkflowTemplateSection(Id)
        public int SectionOrder { get; set; } // Field-specific ordering

        public int WorkflowTemplateSectionFieldId { get; set; } // Foreign Key referencing WorkflowTemplateSectionField(Id)

        public int FieldOrder { get; set; } // Field-specific ordering

        public string WorkflowTemplateSectionName { get; set; } // Name of the template section
        public string WorkflowTemplateSectionFieldName { get; set; } // Name of the field in the template section
        public string? WorkflowTemplateSectionFieldDescription { get; set; } // Description (nullable)

        public int Type { get; set; } // Foreign Key referencing WorkflowFieldType(Id)
        public string Value { get; set; } // Value associated with the field (nullable)
    }
}
