// Generated by CoffeeScript 1.7.1
var onDeviceReady;

document.addEventListener("deviceready", onDeviceReady, false);

onDeviceReady = function() {
  var db;
  applican_init();
  db = null;
  alert(console.log);
  console.log("Ready");
  applican.openDatabase('taskDB', function(d) {
    db = d;
    return db.exec("CREATE TABLE IF NOT EXISTS TASKS (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)", function(s) {
      console.log("Table create successful");
      return db.query("SELECT id, task FROM TASKS", function(result) {
        if (applican.config.debug) {
          return true;
        }
        return $.each(result.rows, function(i, row) {
          var html;
          html = "<tr>\n  <td><input type=\"checkbox\" class=\"task\" value=\"" + row.id + "\" /></td>\n  <td>" + row.task + "</td>\n</tr>";
          return $("#tasks table tbody").append(html);
        });
      }, function(e) {
        return console.log("SELECT failed.");
      });
    }, function(e) {
      return console.log("Table create failed.");
    });
  }, function(e) {
    return console.log("Open database fail");
  });
  $(".form-task").on('submit', function(e) {
    var name, sql_safe_name;
    e.preventDefault();
    if ($("#task").val() === "") {
      return false;
    }
    name = $("#task").val();
    sql_safe_name = name.replace("'", "''");
    db.exec("INSERT INTO TASKS (task) values ('" + sql_safe_name + "')", function(result) {
      console.log("INSERT successful.");
      return db.query("SELECT id, task FROM TASKS ORDER BY id desc LIMIT 1", function(rows) {
        var html, row;
        if (applican.config.debug) {
          row = {
            id: 1,
            task: name
          };
        } else {
          row = rows.rows[0];
        }
        html = "<tr>\n  <td><input type=\"checkbox\" class=\"task\" value=\"" + row.id + "\" /></td>\n  <td>" + row.task + "</td>\n</tr>";
        return $("#tasks table tbody").append(html);
      }, function(e) {
        console.log("SELECT failed.");
        return alert(e);
      });
    });
    return e.target.reset();
  });
  return $("#tasks table").on('click', '.task', function(e) {
    e.preventDefault();
    return db.exec("DELETE FROM TASKS WHERE id = " + ($(e.target).val()), function(s) {
      return $(e.target).parents("tr").remove();
    });
  });
};

onDeviceReady();
