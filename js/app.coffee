document.addEventListener("deviceready", onDeviceReady, false);
onDeviceReady = ->
  applican_init()
  db = null
  alert(console.log)
  console.log("Ready")
  applican.openDatabase 'taskDB', (d) ->
    db = d
    db.exec """
    CREATE TABLE IF NOT EXISTS TASKS (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)
    """, (s) ->
      console.log "Table create successful"
      db.query """
      SELECT id, task FROM TASKS
      """,
      (result) ->
        return true if applican.config.debug
        $.each result.rows, (i, row) ->
          html = """
          <tr>
            <td><input type=\"checkbox\" class=\"task\" value=\"#{row.id}\" /></td>
            <td>#{row.task}</td>
          </tr>
          """
          $("#tasks table tbody").append html
      , (e) ->
        console.log "SELECT failed."
    , (e) ->
      console.log "Table create failed."
  , (e) ->
    console.log "Open database fail"
  $(".form-task").on 'submit', (e) ->
    e.preventDefault()
    return false if $("#task").val() == ""
    name = $("#task").val()
    sql_safe_name = name.replace("'", "''")
    db.exec """
    INSERT INTO TASKS (task) values ('#{sql_safe_name}')
    """, (result) ->
      console.log "INSERT successful."
      db.query """
      SELECT id, task FROM TASKS ORDER BY id desc LIMIT 1
      """, (rows) ->
        if applican.config.debug
          row = id: 1, task: name
        else
          row = rows.rows[0]
        html = """
        <tr>
          <td><input type=\"checkbox\" class=\"task\" value=\"#{row.id}\" /></td>
          <td>#{row.task}</td>
        </tr>
        """
        $("#tasks table tbody").append html
      , (e) ->
         console.log "SELECT failed."
         alert e
    e.target.reset()
  $("#tasks table").on 'click', '.task', (e) ->
    e.preventDefault()
    db.exec """
    DELETE FROM TASKS WHERE id = #{$(e.target).val()}
    """, (s) ->
      $(e.target).parents("tr").remove()
onDeviceReady()
