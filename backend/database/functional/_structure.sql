/**
 * @schema functional
 * Business logic schema for task management system
 */
CREATE SCHEMA [functional];
GO

/**
 * @table task Task management core entity
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(1000) NOT NULL DEFAULT (''),
  [dueDate] DATE NULL,
  [priority] INTEGER NOT NULL DEFAULT (1),
  [category] NVARCHAR(100) NOT NULL DEFAULT ('Sem categoria'),
  [status] INTEGER NOT NULL DEFAULT (0),
  [estimatedTime] INTEGER NULL,
  [recurrenceConfig] NVARCHAR(MAX) NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskTag Task tags for classification
 * @multitenancy true
 * @softDelete false
 * @alias tskTag
 */
CREATE TABLE [functional].[taskTag] (
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [tag] NVARCHAR(20) NOT NULL
);
GO

/**
 * @table taskAttachment Task file attachments
 * @multitenancy true
 * @softDelete false
 * @alias tskAtt
 */
CREATE TABLE [functional].[taskAttachment] (
  [idTaskAttachment] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [fileName] NVARCHAR(255) NOT NULL,
  [fileType] VARCHAR(10) NOT NULL,
  [fileSize] INTEGER NOT NULL,
  [filePath] NVARCHAR(500) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @table taskResponsible Task responsible users
 * @multitenancy true
 * @softDelete false
 * @alias tskResp
 */
CREATE TABLE [functional].[taskResponsible] (
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL
);
GO

/**
 * @table taskReminder Task reminder configuration
 * @multitenancy true
 * @softDelete false
 * @alias tskRem
 */
CREATE TABLE [functional].[taskReminder] (
  [idTaskReminder] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [reminderDateTime] DATETIME2 NOT NULL,
  [reminderType] INTEGER NOT NULL,
  [minutesBefore] INTEGER NULL,
  [sent] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table subtask Task subtasks
 * @multitenancy true
 * @softDelete true
 * @alias sub
 */
CREATE TABLE [functional].[subtask] (
  [idSubtask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(500) NOT NULL DEFAULT (''),
  [status] INTEGER NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskTemplate Task templates for quick creation
 * @multitenancy true
 * @softDelete true
 * @alias tskTpl
 */
CREATE TABLE [functional].[taskTemplate] (
  [idTaskTemplate] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NULL,
  [name] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(500) NOT NULL DEFAULT (''),
  [templateType] INTEGER NOT NULL,
  [templateData] NVARCHAR(MAX) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @primaryKey pkTaskTag
 * @keyType Relationship
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [pkTaskTag] PRIMARY KEY CLUSTERED ([idAccount], [idTask], [tag]);
GO

/**
 * @primaryKey pkTaskAttachment
 * @keyType Object
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [pkTaskAttachment] PRIMARY KEY CLUSTERED ([idTaskAttachment]);
GO

/**
 * @primaryKey pkTaskResponsible
 * @keyType Relationship
 */
ALTER TABLE [functional].[taskResponsible]
ADD CONSTRAINT [pkTaskResponsible] PRIMARY KEY CLUSTERED ([idAccount], [idTask], [idUser]);
GO

/**
 * @primaryKey pkTaskReminder
 * @keyType Object
 */
ALTER TABLE [functional].[taskReminder]
ADD CONSTRAINT [pkTaskReminder] PRIMARY KEY CLUSTERED ([idTaskReminder]);
GO

/**
 * @primaryKey pkSubtask
 * @keyType Object
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [pkSubtask] PRIMARY KEY CLUSTERED ([idSubtask]);
GO

/**
 * @primaryKey pkTaskTemplate
 * @keyType Object
 */
ALTER TABLE [functional].[taskTemplate]
ADD CONSTRAINT [pkTaskTemplate] PRIMARY KEY CLUSTERED ([idTaskTemplate]);
GO

/**
 * @check chkTask_Priority Priority validation
 * @enum {0} Baixa
 * @enum {1} Média
 * @enum {2} Alta
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_Status Status validation
 * @enum {0} A fazer
 * @enum {1} Em andamento
 * @enum {2} Concluída
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Status] CHECK ([status] BETWEEN 0 AND 2);
GO

/**
 * @check chkTaskReminder_Type Reminder type validation
 * @enum {0} Email
 * @enum {1} Notificação
 * @enum {2} SMS
 */
ALTER TABLE [functional].[taskReminder]
ADD CONSTRAINT [chkTaskReminder_Type] CHECK ([reminderType] BETWEEN 0 AND 2);
GO

/**
 * @check chkSubtask_Status Subtask status validation
 * @enum {0} A fazer
 * @enum {1} Em andamento
 * @enum {2} Concluída
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [chkSubtask_Status] CHECK ([status] BETWEEN 0 AND 2);
GO

/**
 * @check chkTaskTemplate_Type Template type validation
 * @enum {0} Pessoal
 * @enum {1} Global
 */
ALTER TABLE [functional].[taskTemplate]
ADD CONSTRAINT [chkTaskTemplate_Type] CHECK ([templateType] BETWEEN 0 AND 1);
GO

/**
 * @index ixTask_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_User
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_User]
ON [functional].[task]([idAccount], [idUser])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_DueDate
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_DueDate]
ON [functional].[task]([idAccount], [dueDate])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Status
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Status]
ON [functional].[task]([idAccount], [status])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTag_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskTag_Account_Task]
ON [functional].[taskTag]([idAccount], [idTask]);
GO

/**
 * @index ixTaskAttachment_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskAttachment_Account_Task]
ON [functional].[taskAttachment]([idAccount], [idTask]);
GO

/**
 * @index ixTaskResponsible_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskResponsible_Account_Task]
ON [functional].[taskResponsible]([idAccount], [idTask]);
GO

/**
 * @index ixTaskReminder_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskReminder_Account_Task]
ON [functional].[taskReminder]([idAccount], [idTask]);
GO

/**
 * @index ixSubtask_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSubtask_Account_Task]
ON [functional].[subtask]([idAccount], [idTask])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_Account
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Account]
ON [functional].[taskTemplate]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_Account_Type
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Account_Type]
ON [functional].[taskTemplate]([idAccount], [templateType])
WHERE [deleted] = 0;
GO