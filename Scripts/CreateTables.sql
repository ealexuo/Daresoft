
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

/* Case File table */
CREATE TABLE dbo.CaseFile
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseNumber NVARCHAR(50) NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CreatedBy INT NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CustomNumber NVARCHAR(100), -- PROV-0001-2025
    SupplierId INT NULL
);

/* Workflow */
CREATE TABLE dbo.Workflow
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(50) NULL,
    Description NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

/* Workflow Steps */
CREATE TABLE dbo.WorkflowSteps
(
    StepId INT IDENTITY(1,1) PRIMARY KEY,
    WorkflowId INT NOT NULL,
    StepName NVARCHAR(100) NOT NULL,
    StepOrder INT NOT NULL,
    IsTerminal BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_WorkflowSteps_Workflows
        FOREIGN KEY (WorkflowId) REFERENCES dbo.Workflows(WorkflowId)
);

/* Status */
/*
Pending

In Progress

Completed

Cancelled

On Hold
*/
CREATE TABLE dbo.Statuses
(
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    IsFinal BIT NOT NULL DEFAULT 0
);

/* CaseFile Workflow  */
CREATE TABLE dbo.CaseFileWorkflow
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseFileId INT NOT NULL,
    WorkflowId INT NOT NULL,
    StartDate DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    EndDate DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    ExternalIdentifier NVARCHAR(100) NULL
    CONSTRAINT FK_CaseFileWorkflows_CaseFiles
        FOREIGN KEY (CaseFileId) REFERENCES dbo.CaseFiles(CaseFileId),

    CONSTRAINT FK_CaseFileWorkflows_Workflows
        FOREIGN KEY (WorkflowId) REFERENCES dbo.Workflows(WorkflowId)
);


/* CaseFile Progress */
CREATE TABLE dbo.CaseFileWorkflowProgress
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseFileWorkflowId INT NOT NULL,
    StepId INT NOT NULL,
    StatusId INT NOT NULL,
    LastUpdated DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedBy INT NOT NULL,

    CONSTRAINT FK_Progress_CaseFileWorkflow
        FOREIGN KEY (CaseFileWorkflowId) REFERENCES dbo.CaseFileWorkflows(CaseFileWorkflowId),

    CONSTRAINT FK_Progress_Step
        FOREIGN KEY (StepId) REFERENCES dbo.WorkflowSteps(StepId),

    CONSTRAINT FK_Progress_Status
        FOREIGN KEY (StatusId) REFERENCES dbo.Statuses(StatusId)
);

/* CaseFile Workflow History */
CREATE TABLE dbo.CaseFileWorkflowHistory
(
    HistoryId INT IDENTITY(1,1) PRIMARY KEY,
    CaseFileWorkflowId INT NOT NULL,
    StepId INT NOT NULL,
    StatusId INT NOT NULL,
    ChangedDate DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ChangedBy INT NOT NULL,
    Notes NVARCHAR(1000) NULL,

    CONSTRAINT FK_History_CaseFileWorkflow
        FOREIGN KEY (CaseFileWorkflowId) REFERENCES dbo.CaseFileWorkflows(CaseFileWorkflowId)
);

