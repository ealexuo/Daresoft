
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
    ExternalIdentifier NVARCHAR(100) NULL,
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
--CREATE TABLE dbo.CaseFileWorkflowHistory
--(
--    Id INT IDENTITY(1,1) PRIMARY KEY,
--    CaseFileWorkflowId INT NOT NULL,    
--	WorkFlowStatusId INT NOT NULL,
--    StartDate DATETIME NOT NULL,
--    EndDate DATETIME NULL,
--	Notes NVARCHAR(MAX),
--	CreatedDate DATETIME NOT NULL,
--	LastModifiedDate DATETIME NOT NULL,	
--	CreatedByUserId INT NOT NULL,
--	UpdatedByUserId INT NOT NULL

--	CONSTRAINT FK_CaseFileWorkflowHistory_CaseFileWorkflow
--        FOREIGN KEY (CaseFileWorkflowId) REFERENCES dbo.CaseFileWorkflow(Id),

--	CONSTRAINT FK_CaseFileWorkflow_WorkflowStatus
--        FOREIGN KEY (WorkflowStatusId) REFERENCES dbo.WorkflowStatus(Id)
--);


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

