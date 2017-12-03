module.exports = function () {

  this.search = function (select, userEntry, sort, from, to) {
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017/mydb";
    MongoClient.connect(url, function (err, db) {

      if (err) throw err;

      if (select === "ID") {
        db.collection("Reports").find({ $and: [{ "ID": userEntry }, { "Day": { $gte: from, $lte: to } }] }).sort({ [sort]: 1 }).toArray(function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });

        db.collection("Reports").aggregate([{ $match: { ID: userEntry, Day: { $gte: from, $lte: to } } }, { $group: { _id: "$status", noOfDays: { $sum: 1 } } }], function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      } else if (select === "Department") {

        db.collection("Reports").find({ $and: [{ "Department": userEntry }, { "Day": { $gte: from, $lte: to } }] }).sort({ [sort]: 1 }).toArray(function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });

        db.collection("Reports").aggregate([{ $match: { Department: userEntry, Day: { $gte: from, $lte: to } } }, { $group: { _id: "$status", noOfEmployees: { $sum: 1 } } }], function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      } else {
        db.collection("Reports").find({ "Day": { $gte: from, $lte: to } }).sort({ [sort]: 1 }).toArray(function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });

        db.collection("Reports").aggregate([{ $match: { Day: { $gte: from, $lte: to } } }, { $group: { _id: "$status", noOfEmployees: { $sum: 1 } } }], function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      }
    });
  };
}
