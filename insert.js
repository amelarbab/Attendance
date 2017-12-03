module.exports = function () {
  this.insert = function () {

    const MongoClient = require('mongodb').MongoClient;
    const fs = require('fs');

    var maximum = '11:00:00';//must be inserted by user
    var formalTime = '08:15:00';//must be inserted by user
    var lastDay;
    var IDs = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],

    }
    var byUser = {// must be inserted by user
      0: { Department: "Service", Name: "Unknown" },
      1: { Department: "Management", Name: "Nimir" },
      2: { Department: "Management", Name: "Mohanned" },
      3: { Department: "IT", Name: "Arwa" },
      4: { Department: "IT", Name: "Unknown" },
      5: { Department: "Service", Name: "Tawfeeg" }
    }



    fs.readFile('/home/amel/Documents/test.txt', function (err, data) {
      if (err) throw err;

      var array = data.toString().split("\n");

      const url = "mongodb://localhost:27017/mydb";
      MongoClient.connect(url, function (err, db) {

        if (err) throw err;

        for (var i = 0; i < array.length; i++) {
          let id, day, time;

          id = Number(array[i].substring(8, 9));
          day = array[i].substring(10, 20);
          time = array[i].substring(21, 29);

          if (i === 0) lastDay = day;

          if (day !== lastDay) {
            let status;

            for (var k in IDs) {
              if (IDs[k].length === 0) {
                status = "Absent";
              }
              else {
                if (IDs[k][0] <= formalTime) {
                  status = "on time";
                }
                else if (IDs[k][0] <= maximum) {
                  status = "late";
                }
                else {
                  status = "missed";
                }
              }

              var myobj = { ID: Number(k), Name: byUser[k]["Name"], Department: byUser[k]["Department"], Day: lastDay, time: IDs[k], status: status };

              db.collection("Reports").insertOne(myobj, function (err, res) {
                if (err) throw err;
                db.close();

              });
            }

            lastDay = day;

            for (var k in IDs) {
              IDs[k] = [];
            }
          }

          IDs[id].push(time);
        }

      });

    });

  };
}








