/**
 * @summary
 * Creates a new task with all specified properties including tags, attachments,
 * responsibles, and reminders
 *
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User creating the task
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Task description
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Task due date
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Task priority (0=Baixa, 1=Média, 2=Alta)
 *
 * @param {NVARCHAR(100)} category
 *   - Required: No
 *   - Description: Task category
 *
 * @param {INT} estimatedTime
 *   - Required: No
 *   - Description: Estimated time in minutes
 *
 * @param {NVARCHAR(MAX)} recurrenceConfig
 *   - Required: No
 *   - Description: JSON recurrence configuration
 *
 * @param {NVARCHAR(MAX)} tags
 *   - Required: No
 *   - Description: JSON array of tags
 *
 * @param {NVARCHAR(MAX)} responsibles
 *   - Required: No
 *   - Description: JSON array of responsible user IDs
 *
 * @param {NVARCHAR(MAX)} reminders
 *   - Required: No
 *   - Description: JSON array of reminder configurations
 *
 * @returns {INT} idTask - Created task identifier
 *
 * @testScenarios
 * - Valid creation with only required fields
 * - Valid creation with all optional fields
 * - Security validation failure with invalid account
 * - Validation failure with empty title
 * - Validation failure with invalid priority
 * - Validation failure with past due date
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = '',
  @dueDate DATE = NULL,
  @priority INTEGER = 1,
  @category NVARCHAR(100) = 'Sem categoria',
  @estimatedTime INTEGER = NULL,
  @recurrenceConfig NVARCHAR(MAX) = NULL,
  @tags NVARCHAR(MAX) = NULL,
  @responsibles NVARCHAR(MAX) = NULL,
  @reminders NVARCHAR(MAX) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @idTask INTEGER;

  /**
   * @validation Required parameter validation
   * @throw {titleRequired}
   */
  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleTooShort}
   */
  IF (LEN(LTRIM(RTRIM(@title))) < 3)
  BEGIN
    ;THROW 51000, 'titleTooShort', 1;
  END;

  /**
   * @validation Priority range validation
   * @throw {invalidPriority}
   */
  IF (@priority < 0 OR @priority > 2)
  BEGIN
    ;THROW 51000, 'invalidPriority', 1;
  END;

  /**
   * @validation Due date validation
   * @throw {dueDateInPast}
   */
  IF (@dueDate IS NOT NULL AND @dueDate < CAST(GETUTCDATE() AS DATE))
  BEGIN
    ;THROW 51000, 'dueDateInPast', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-task-creation} Create main task record
       */
      INSERT INTO [functional].[task] (
        [idAccount],
        [idUser],
        [title],
        [description],
        [dueDate],
        [priority],
        [category],
        [estimatedTime],
        [recurrenceConfig]
      )
      VALUES (
        @idAccount,
        @idUser,
        LTRIM(RTRIM(@title)),
        @description,
        @dueDate,
        @priority,
        @category,
        @estimatedTime,
        @recurrenceConfig
      );

      SET @idTask = SCOPE_IDENTITY();

      /**
       * @rule {fn-task-tags} Insert task tags if provided
       */
      IF (@tags IS NOT NULL)
      BEGIN
        INSERT INTO [functional].[taskTag] ([idAccount], [idTask], [tag])
        SELECT @idAccount, @idTask, [value]
        FROM OPENJSON(@tags);
      END;

      /**
       * @rule {fn-task-responsibles} Insert task responsibles if provided
       */
      IF (@responsibles IS NOT NULL)
      BEGIN
        INSERT INTO [functional].[taskResponsible] ([idAccount], [idTask], [idUser])
        SELECT @idAccount, @idTask, CAST([value] AS INTEGER)
        FROM OPENJSON(@responsibles);
      END;

      /**
       * @rule {fn-task-reminders} Insert task reminders if provided
       */
      IF (@reminders IS NOT NULL)
      BEGIN
        INSERT INTO [functional].[taskReminder] (
          [idAccount],
          [idTask],
          [reminderDateTime],
          [reminderType],
          [minutesBefore]
        )
        SELECT
          @idAccount,
          @idTask,
          CAST(JSON_VALUE([value], '$.reminderDateTime') AS DATETIME2),
          CAST(JSON_VALUE([value], '$.reminderType') AS INTEGER),
          CAST(JSON_VALUE([value], '$.minutesBefore') AS INTEGER)
        FROM OPENJSON(@reminders);
      END;

      /**
       * @output {TaskCreated, 1, 1}
       * @column {INT} idTask - Created task identifier
       */
      SELECT @idTask AS [idTask];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO