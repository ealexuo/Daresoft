

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserProfile]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[UserProfile]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Contact]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[Contact]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ContactType]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[ContactType]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Country]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[Country]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CaseFile]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].CaseFile
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Workflow]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].Workflow
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[WorkflowStatus]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].WorkflowStatus
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CaseFileWorkflow]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].CaseFileWorkflow
END


