/**
 * @summary
 * Lists tasks for an account with optional filtering by status, priority,
 * category, and due date
 *
 * @procedure spTaskList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idUser
 *   - Required: No
 *   - Description: Filter by user
 *
 * @param {INT} status
 *   - Required: No
 *   - Description: Filter by status
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Filter by priority
 *
 * @param {NVARCHAR(100)} category
 *   - Required: No
 *   - Description: Filter by category
 *
 * @param {DATE} dueDateFrom
 *   - Required: No
 *   - Description: Filter by due date from
 *
 * @param {DATE} dueDateTo
 *   - Required: No
 *   - Description: Filter by due date to
 *
 * @testScenarios
 * - List all tasks for account
 * - Filter by status
 * - Filter by priority
 * - Filter by category
 * - Filter by due date range
 * - Filter by user
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskList]
  @idAccount INTEGER,
  @idUser INTEGER = NULL,
  @status INTEGER = NULL,
  @priority INTEGER = NULL,
  @category NVARCHAR(100) = NULL,
  @dueDateFrom DATE = NULL,
  @dueDateTo DATE = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @output {TaskList, n, n}
   * @column {INT} idTask - Task identifier
   * @column {INT} idUser - User who created the task
   * @column {NVARCHAR} title - Task title
   * @column {NVARCHAR} description - Task description
   * @column {DATE} dueDate - Task due date
   * @column {INT} priority - Task priority
   * @column {NVARCHAR} category - Task category
   * @column {INT} status - Task status
   * @column {INT} estimatedTime - Estimated time in minutes
   * @column {DATETIME2} dateCreated - Creation date
   * @column {INT} tagCount - Number of tags
   * @column {INT} attachmentCount - Number of attachments
   * @column {INT} responsibleCount - Number of responsibles
   * @column {INT} subtaskCount - Number of subtasks
   * @column {INT} completedSubtaskCount - Number of completed subtasks
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
    [tsk].[dateCreated],
    (
      SELECT COUNT(*)
      FROM [functional].[taskTag] [tskTag]
      WHERE [tskTag].[idAccount] = [tsk].[idAccount]
        AND [tskTag].[idTask] = [tsk].[idTask]
    ) AS [tagCount],
    (
      SELECT COUNT(*)
      FROM [functional].[taskAttachment] [tskAtt]
      WHERE [tskAtt].[idAccount] = [tsk].[idAccount]
        AND [tskAtt].[idTask] = [tsk].[idTask]
    ) AS [attachmentCount],
    (
      SELECT COUNT(*)
      FROM [functional].[taskResponsible] [tskResp]
      WHERE [tskResp].[idAccount] = [tsk].[idAccount]
        AND [tskResp].[idTask] = [tsk].[idTask]
    ) AS [responsibleCount],
    (
      SELECT COUNT(*)
      FROM [functional].[subtask] [sub]
      WHERE [sub].[idAccount] = [tsk].[idAccount]
        AND [sub].[idTask] = [tsk].[idTask]
        AND [sub].[deleted] = 0
    ) AS [subtaskCount],
    (
      SELECT COUNT(*)
      FROM [functional].[subtask] [sub]
      WHERE [sub].[idAccount] = [tsk].[idAccount]
        AND [sub].[idTask] = [tsk].[idTask]
        AND [sub].[status] = 2
        AND [sub].[deleted] = 0
    ) AS [completedSubtaskCount]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idAccount] = @idAccount
    AND [tsk].[deleted] = 0
    AND ((@idUser IS NULL) OR ([tsk].[idUser] = @idUser))
    AND ((@status IS NULL) OR ([tsk].[status] = @status))
    AND ((@priority IS NULL) OR ([tsk].[priority] = @priority))
    AND ((@category IS NULL) OR ([tsk].[category] = @category))
    AND ((@dueDateFrom IS NULL) OR ([tsk].[dueDate] >= @dueDateFrom))
    AND ((@dueDateTo IS NULL) OR ([tsk].[dueDate] <= @dueDateTo))
  ORDER BY
    [tsk].[dueDate] ASC,
    [tsk].[priority] DESC,
    [tsk].[dateCreated] DESC;
END;
GO