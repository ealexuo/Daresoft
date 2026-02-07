
/*

Database: daresoft_test

Audit columns:	
	CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
	UpdatedByUserId INT NOT NULL

*/

/* Country table */
CREATE TABLE Country (
	Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Country PRIMARY KEY CLUSTERED,
	Name NVARCHAR(100) NOT NULL,
	TwoLetterAbbreviation NCHAR(4) NOT NULL
);

/* ContactType table */
CREATE TABLE ContactType(
	Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ContactType PRIMARY KEY CLUSTERED,
	Name nvarchar(50) NOT NULL,
);

/* Contact table */
CREATE TABLE Contact(
	Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Contact PRIMARY KEY CLUSTERED,
	Salutation nvarchar(50) NULL,
	Name nvarchar(100) NOT NULL,
	MiddleName nvarchar(100) NOT NULL,
	LastName nvarchar(100) NOT NULL,
	OtherName nvarchar(100) NOT NULL,
	Title nvarchar(50) NULL,
	HomeAddressLine1 nvarchar(100) NULL,
	HomeAddressLine2 nvarchar(100) NULL,
	HomeCity nvarchar(50) NULL,
	HomeState nvarchar(50) NULL,
	HomePostalCode nvarchar(20) NULL,
	CountryId int NULL,
	WorkAddressLine1 nvarchar(100) NULL,
	WorkAddressLine2 nvarchar(500) NULL,
	WorkCity nvarchar(50) NULL,
	WorkState nvarchar(50) NULL,
	WorkPostalCode nvarchar(20) NULL,
	WorkCountry nvarchar(100) NULL,
	WorkEmail nvarchar(100) NULL,
	HomeEmail nvarchar(100) NULL,
	HomePhone nvarchar(40) NULL,
	WorkPhone nvarchar(40) NULL,
	WorkPhoneExt nvarchar(10) NULL,	
	MobilePhone nvarchar(40) NULL,
	CompanyId int NULL,
	ContactTypeId int NOT NULL,
	Notes text NULL,
	PreferredAddress int NULL,
	CompanyName nvarchar(150) NULL,
	Website nvarchar(150) NULL,
	PrimaryContactId int NULL,
	IsSupplier bit NOT NULL,
	IsDeleted BIT NOT NULL,
	CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
	UpdatedByUserId INT NOT NULL
);

ALTER TABLE Contact WITH CHECK ADD CONSTRAINT FK_Contact_Contact FOREIGN KEY(CompanyId)
REFERENCES Contact (Id)
GO

ALTER TABLE Contact WITH CHECK ADD CONSTRAINT FK_Contact_Contact_PrimaryContact FOREIGN KEY(PrimaryContactId)
REFERENCES Contact (Id)
GO

ALTER TABLE Contact WITH CHECK ADD CONSTRAINT FK_Contact_ContactType FOREIGN KEY(ContactTypeId)
REFERENCES ContactType (Id)
GO

ALTER TABLE Contact WITH CHECK ADD CONSTRAINT FK_Contact_Country FOREIGN KEY(CountryId)
REFERENCES Country (Id)
GO


/* User table */
CREATE TABLE UserProfile (
    Id INT PRIMARY KEY IDENTITY NOT NULL,
    UserName NVARCHAR(50) NOT NULL,    
    PasswordHash NVARCHAR(255) NOT NULL,
	ContactId INT NOT NULL,
    Color NVARCHAR(7) NULL,
    ProfilePicture NVARCHAR(MAX) NULL,
    ProfilePictureContentType NVARCHAR(10) NULL,
	RoleId TINYINT NOT NULL DEFAULT 2,
    IsActive BIT NOT NULL,
	IsPasswordChangeRequired BIT NOT NULL,
	IsDeleted BIT NOT NULL,
	CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
    UpdatedByUserId INT NOT NULL
);

ALTER TABLE UserProfile WITH CHECK ADD CONSTRAINT FK_User_Contact FOREIGN KEY(ContactId)
REFERENCES Contact (Id)
GO

/* -------------------------------------------------------------

WORKFLOW

----------------------------------------------------------------*/

/* Case File table */
CREATE TABLE dbo.CaseFile
(
    Id INT PRIMARY KEY IDENTITY NOT NULL,
    CaseNumber NVARCHAR(50) NOT NULL, -- PROV-0001-2025    
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
	Url NVARCHAR(2048) NULL,
    SupplierContactId INT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
	UpdatedByUserId INT NOT NULL

	CONSTRAINT FK_CaseFile_Supplier
        FOREIGN KEY (SupplierContactId) REFERENCES dbo.Contact(Id)
);

/* Workflow */
CREATE TABLE dbo.Workflow
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL, -- complete name
    Code NVARCHAR(50) NULL, -- abreviation 
    Description NVARCHAR(500) NULL,
	Color NVARCHAR(7) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
	UpdatedByUserId INT NOT NULL
);


/* Status */
CREATE TABLE dbo.WorkflowStatus
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
	Description NVARCHAR(250) NULL
);

/* Transitions -- Not necessary for now */
--CREATE TABLE dbo.WorkflowTransition
--(
--    Id INT IDENTITY(1,1) PRIMARY KEY,
--	WorkflowId INT NOT NULL,
--	FromStatusId INT NOT NULL,
--	ToStatusId INT NOT NULL,    
--);

/* CaseFile Workflow  */
CREATE TABLE dbo.CaseFileWorkflow
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseFileId INT NOT NULL,
    WorkflowId INT NOT NULL,
	WorkFlowStatusId INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NULL,
	Notes NVARCHAR(MAX) NULL,
	CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
	UpdatedByUserId INT NOT NULL

    CONSTRAINT FK_CaseFileWorkflow_CaseFile
        FOREIGN KEY (CaseFileId) REFERENCES dbo.CaseFile(Id),

    CONSTRAINT FK_CaseFileWorkflow_Workflow
        FOREIGN KEY (WorkflowId) REFERENCES dbo.Workflow(Id),

	CONSTRAINT FK_CaseFileWorkflow_WorkflowStatus
        FOREIGN KEY (WorkflowStatusId) REFERENCES dbo.WorkflowStatus(Id),

    CONSTRAINT UQ_CaseFileWorkflow UNIQUE (CaseFileId, WorkflowId)
);

/* CaseFile Workflow History */
CREATE TABLE dbo.CaseFileWorkflowHistory
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseFileWorkflowId INT NOT NULL,    
	WorkFlowStatusId INT NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NULL,
	Notes NVARCHAR(MAX) NULL,
	CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
	UpdatedByUserId INT NOT NULL

	CONSTRAINT FK_CaseFileWorkflowHistory_CaseFileWorkflow
        FOREIGN KEY (CaseFileWorkflowId) REFERENCES dbo.CaseFileWorkflow(Id),

	CONSTRAINT FK_CaseFileWorkflowHistory_WorkflowStatus
        FOREIGN KEY (WorkflowStatusId) REFERENCES dbo.WorkflowStatus(Id)
);


--/* CaseFile Progress */
--CREATE TABLE dbo.CaseFileWorkflowProgress
--(
--    Id INT IDENTITY(1,1) PRIMARY KEY,
--    CaseFileWorkflowId INT NOT NULL,
--    StepId INT NOT NULL,
--    StatusId INT NOT NULL,
--    CreatedDate DATETIME NOT NULL,
--	LastModifiedDate DATETIME NOT NULL DEFAULT SYSDATETIME(),	
--	CreatedByUserId INT NOT NULL,
--	UpdatedByUserId INT NOT NULL

--    CONSTRAINT FK_Progress_CaseFileWorkflow
--        FOREIGN KEY (CaseFileWorkflowId) REFERENCES dbo.CaseFileWorkflow(Id),

--    CONSTRAINT FK_Progress_Step
--        FOREIGN KEY (StepId) REFERENCES dbo.WorkflowStep(Id),

--    CONSTRAINT FK_Progress_Status
--        FOREIGN KEY (StatusId) REFERENCES dbo.Status(Id)
--);

/* CaseFile Workflow History */
--CREATE TABLE dbo.CaseFileWorkflowHistory
--(
--    Id INT IDENTITY(1,1) PRIMARY KEY,
--    CaseFileWorkflowId INT NOT NULL,
--    StepId INT NOT NULL,
--    StatusId INT NOT NULL,    
--	CreatedDate DATETIME NOT NULL DEFAULT SYSDATETIME(),
--	LastModifiedDate DATETIME NOT NULL DEFAULT SYSDATETIME(),	
--	CreatedByUserId INT NOT NULL,
--	UpdatedByUserId INT NOT NULL

--    CONSTRAINT FK_History_CaseFileWorkflow
--        FOREIGN KEY (CaseFileWorkflowId) REFERENCES dbo.CaseFileWorkflow(Id)
--);


/* ----------------------------------------
Tasks 
------------------------------------------*/

/* CaseFile Task */
CREATE TABLE dbo.Task
(
    Id INT IDENTITY PRIMARY KEY,

    CaseFileId INT NULL,
	WorkflowId INT NULL,

    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,

    AssignedToUserId INT NULL,

    Priority TINYINT NOT NULL,   -- 1=Low, 2=Medium, 3=High
	EntryDate DATE NOT NULL,
    DueDate DATE NULL,

	Reviewer NVARCHAR(255) NULL,

    IsCompleted BIT NOT NULL DEFAULT 0,
    CompletedDate DATE NULL,

	CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
	UpdatedByUserId INT NOT NULL

    CONSTRAINT FK_Task_CaseFile
        FOREIGN KEY (CaseFileId) REFERENCES dbo.CaseFile(Id)
);

/* CaseFile Task History */
--CREATE TABLE dbo.TaskHistory
--(
--    Id INT IDENTITY PRIMARY KEY,
--    TaskId INT NOT NULL,
    
--    OldStatusId INT NULL,
--    NewStatusId INT NULL,

--    Notes NVARCHAR(500) NULL,

--	CreatedDate DATETIME NOT NULL,
--	LastModifiedDate DATETIME NOT NULL,	
--	CreatedByUserId INT NOT NULL,
--	UpdatedByUserId INT NOT NULL
--);

/* Documents */

CREATE TABLE dbo.Document
(
    Id INT IDENTITY PRIMARY KEY,
    CaseFileId INT NOT NULL,
	Name NVARCHAR(255) NOT NULL,
	Path NVARCHAR(MAX) NOT NULL,
	ContentType NVARCHAR(100) NOT NULL,
	Size INT NOT NULL,

    CONSTRAINT FK_Document_CaseFile
        FOREIGN KEY (CaseFileId) REFERENCES dbo.CaseFile(Id)
);

/* Workflow Template Section Fields */
CREATE TABLE WorkflowFieldType
(
    Id INT IDENTITY PRIMARY KEY,    
    Name NVARCHAR(255) NOT NULL,    
);

INSERT INTO WorkflowFieldType (Name)
VALUES('Text'), ('Number'), ('Date'), ('File');


/* Workflow Templates */
CREATE TABLE WorkflowTemplate
(
    Id INT IDENTITY PRIMARY KEY,
	WorkflowId INT NOT NULL REFERENCES Workflow(Id),
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL
);

INSERT INTO WorkflowTemplate (Name, Description)
VALUES('Proceso Farmaceuticos', 'Proceso Farmaceuticos');

/* Workflow Template Sections */
CREATE TABLE WorkflowTemplateSection
(
    Id INT IDENTITY PRIMARY KEY,
    WorkflowTemplateId INT NOT NULL REFERENCES WorkflowTemplate(Id),
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
	[Order] INT NOT NULL
);

INSERT INTO WorkflowTemplateSection (WorkflowTemplateId, Name, Description, [Order])
VALUES
(1, 'Ministerio de Salud (MOH)', 'Ministerio de Salud (MOH)', 1),
(1, 'Laboratorio Nacional de Salud (LNS)', 'Laboratorio Nacional de Salud (LNS)', 2);

/* Workflow Template Section Fields */
CREATE TABLE WorkflowTemplateSectionField
(
    Id INT IDENTITY PRIMARY KEY,
    WorkflowTemplateSectionId INT NOT NULL REFERENCES WorkflowTemplateSection(Id),
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
	Type INT NOT NULL REFERENCES WorkflowFieldType(Id),
	[Order] INT NOT NULL
);

INSERT INTO WorkflowTemplateSectionField (WorkflowTemplateSectionId, Name, Description, Type, [Order])
VALUES
(1, 'Número de entrada SIAD', 'Número de entrada SIAD', 2, 1), -- Number
(1, 'Llave', 'Llave', 1, 2), -- Text
(1, 'Fecha de ingreso', 'Fecha de ingreso', 3, 3), -- Date
(1, 'Documento de ingreso', 'Document de ingreso', 3, 4), -- File
(2, 'Número de entrada SIAD', 'Número de entrada SIAD', 2, 1), -- Number
(2, 'Llave', 'Llave', 1, 2), -- Text
(2, 'Fecha de ingreso', 'Fecha de ingreso', 3, 3), -- Date
(2, 'Documento de ingreso', 'Document de ingreso', 3, 4); -- File

select * from WorkflowTemplateSectionField

-- drop table WorkflowTemplateSectionField

/* Workflow Template Section Fields */
CREATE TABLE WorkflowTemplateSectionFieldValue
(
    Id INT IDENTITY PRIMARY KEY,
	CaseFileId INT NOT NULL REFERENCES CaseFile(Id),
	WorkflowTemplateId INT NOT NULL REFERENCES WorkflowTemplate(Id),
    WorkflowTemplateSectionId INT NOT NULL REFERENCES WorkflowTemplateSection(Id),
	SectionOrder INT NOT NULL,
	WorkflowTemplateSectionFieldId INT NOT NULL REFERENCES WorkflowTemplateSectionField(Id),
	FieldOrder INT NOT NULL,
	WorkflowTemplateSectionName NVARCHAR(255) NOT NULL,
	WorkflowTemplateSectionFieldName NVARCHAR(255) NOT NULL,
	WorkflowTemplateSectionFieldDescription NVARCHAR(MAX) NULL,
	Type INT NOT NULL REFERENCES WorkflowFieldType(Id),	
	Value NVARCHAR(MAX) NULL
);

-- drop table WorkflowTemplateSectionFieldValue
select * from WorkflowTemplateSectionFieldValue


begin tran
INSERT INTO WorkflowTemplateSectionFieldValue 
(
	CaseFileId, WorkflowTemplateId, WorkflowTemplateSectionId, 
	WorkflowTemplateSectionFieldId, [Order], WorkflowTemplateSectionName, 
	WorkflowTemplateSectionFieldName, WorkflowTemplateSectionFieldDescription, Type, 
	Value
)
SELECT 
	cf.Id AS CaseFileId
	,wftp.Id AS WorkflowTemplateId
	,wftps.Id AS WorkflowTemplateSectionId
	,wftpsf.Id AS WorkflowTemplateSectionFieldId
	,wftpsf.[Order]
	,wftps.Name AS WorkflowTemplateSectionName
	,wftpsf.Name AS WorkflowTemplateSectionFieldName
	,wftpsf.Description AS WorkflowTemplateSectionFieldDescription
	,wftpsf.Type
	,'' -- here goes the value
FROM CaseFile cf
JOIN CaseFileWorkflow cfwf ON cf.Id = cfwf.CaseFileId
JOIN WorkflowTemplate wftp ON cfwf.WorkflowId = wftp.WorkflowId
JOIN WorkflowTemplateSection wftps ON wftps.WorkflowTemplateId = wftp.Id
JOIN WorkflowTemplateSectionField wftpsf ON wftpsf.WorkflowTemplateSectionId = wftps.Id
ORDER BY wftps.[Order], wftpsf.[Order]
rollback






select * from Workflow
UPDATE Workflow set Name = 'Proceso Farmaceuticos', Code = 'PF', Description = 'Proceso Farmaceuticos'


select * from WorkflowStatus

/*
delete from CaseFileWorkflowHistory
delete from Document
delete from CaseFileWorkflow
delete from CaseFile
*/

select * from CaseFile
select * from CaseFileWorkflow
select * from WorkflowTemplateSectionFieldValue

select * from WorkflowTemplate


SELECT 
    val.Id
	,val.CaseFileId
	,val.WorkflowTemplateId
	,val.WorkflowTemplateSectionId
	,val.WorkflowTemplateSectionFieldId
	,val.[Order]
	,val.WorkflowTemplateSectionFieldName
	,val.WorkflowTemplateSectionFieldName
	,val.WorkflowTemplateSectionFieldDescription
	,val.Type 
	,val.Value
FROM WorkflowTemplateSectionFieldValue val
WHERE CaseFileId = 14
ORDER BY val.WorkflowTemplateSectionId, val.WorkflowTemplateSectionFieldId