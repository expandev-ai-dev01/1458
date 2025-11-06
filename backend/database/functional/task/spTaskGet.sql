/**
 * @summary
 * Retrieves complete task details including tags, attachments, responsibles,
 * reminders, and subtasks
 *
 * @procedure spTaskGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier
 *
 * @testScenarios
 * - Valid retrieval with all related data
 * - Task not found
 * - Task from different account
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskGet]
  @idAccount INTEGER,
  @idTask INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Task existence validation
   * @throw {taskDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[task] [tsk]
    WHERE [tsk].[idTask] = @idTask
      AND [tsk].[idAccount] = @idAccount
      AND [tsk].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'taskDoesntExist', 1;
  END;

  /**
   * @output {TaskDetail, 1, n}
   * @column {INT} idTask - Task identifier
   * @column {INT} idUser - User who created the task
   * @column {NVARCHAR} title - Task title
   * @column {NVARCHAR} description - Task description
   * @column {DATE} dueDate - Task due date
   * @column {INT} priority - Task priority
   * @column {NVARCHAR} category - Task category
   * @column {INT} status - Task status
   * @column {INT} estimatedTime - Estimated time in minutes
   * @column {NVARCHAR} recurrenceConfig - JSON recurrence configuration
   * @column {DATETIME2} dateCreated - Creation date
   * @column {DATETIME2} dateModified - Last modification date
   */
  SELECT
    [tsk].[idTask],
    [tsk].[idUser],
    [tsk].[title],
    [tsk].[description],
    [tsk].[dueDate],
    [tsk].[priority],
    [tsk].[category],
    [tsk].[status],
    [tsk].[estimatedTime],
    [tsk].[recurrenceConfig],
    [tsk].[dateCreated],
    [tsk].[dateModified]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idTask] = @idTask
    AND [tsk].[idAccount] = @idAccount
    AND [tsk].[deleted] = 0;

  /**
   * @output {TaskTags, n, n}
   * @column {NVARCHAR} tag - Tag name
   */
  SELECT [tskTag].[tag]
  FROM [functional].[taskTag] [tskTag]
  WHERE [tskTag].[idTask] = @idTask
    AND [tskTag].[idAccount] = @idAccount;

  /**
   * @output {TaskAttachments, n, n}
   * @column {INT} idTaskAttachment - Attachment identifier
   * @column {NVARCHAR} fileName - File name
   * @column {VARCHAR} fileType - File type
   * @column {INT} fileSize - File size in bytes
   * @column {NVARCHAR} filePath - File path
   * @column {DATETIME2} dateCreated - Upload date
   */
  SELECT
    [tskAtt].[idTaskAttachment],
    [tskAtt].[fileName],
    [tskAtt].[fileType],
    [tskAtt].[fileSize],
    [tskAtt].[filePath],
    [tskAtt].[dateCreated]
  FROM [functional].[taskAttachment] [tskAtt]
  WHERE [tskAtt].[idTask] = @idTask
    AND [tskAtt].[idAccount] = @idAccount;

  /**
   * @output {TaskResponsibles, n, n}
   * @column {INT} idUser - Responsible user identifier
   */
  SELECT [tskResp].[idUser]
  FROM [functional].[taskResponsible] [tskResp]
  WHERE [tskResp].[idTask] = @idTask
    AND [tskResp].[idAccount] = @idAccount;

  /**
   * @output {TaskReminders, n, n}
   * @column {INT} idTaskReminder - Reminder identifier
   * @column {DATETIME2} reminderDateTime - Reminder date and time
   * @column {INT} reminderType - Reminder type
   * @column {INT} minutesBefore - Minutes before due date
   * @column {BIT} sent - Whether reminder was sent
   */
  SELECT
    [tskRem].[idTaskReminder],
    [tskRem].[reminderDateTime],
    [tskRem].[reminderType],
    [tskRem].[minutesBefore],
    [tskRem].[sent]
  FROM [functional].[taskReminder] [tskRem]
  WHERE [tskRem].[idTask] = @idTask
    AND [tskRem].[idAccount] = @idAccount;

  /**
   * @output {Subtasks, n, n}
   * @column {INT} idSubtask - Subtask identifier
   * @column {NVARCHAR} title - Subtask title
   * @column {NVARCHAR} description - Subtask description
   * @column {INT} status - Subtask status
   * @column {DATETIME2} dateCreated - Creation date
   */
  SELECT
    [sub].[idSubtask],
    [sub].[title],
    [sub].[description],
    [sub].[status],
    [sub].[dateCreated]
  FROM [functional].[subtask] [sub]
  WHERE [sub].[idTask] = @idTask
    AND [sub].[idAccount] = @idAccount
    AND [sub].[deleted] = 0
  ORDER BY [sub].[dateCreated] ASC;
END;
GO