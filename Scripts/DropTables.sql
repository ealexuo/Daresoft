-- Drop tables in order to prevent foreign key constraint issues
-- Child tables (with foreign keys) are dropped first, then parent tables, then lookup tables

-- Drop history and dependent tables first
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CaseFileWorkflowHistory]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[CaseFileWorkflowHistory]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TaskHistory]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[TaskHistory]
END

-- Drop tables with foreign keys to CaseFile
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CaseFileWorkflow]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[CaseFileWorkflow]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Task]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[Task]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Document]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[Document]
END

-- Drop parent tables
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CaseFile]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[CaseFile]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Contact]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[Contact]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Workflow]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[Workflow]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserProfile]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[UserProfile]
END

-- Drop lookup/reference tables last
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[WorkflowStatus]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[WorkflowStatus]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ContactType]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[ContactType]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Country]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[Country]
END

