const db = require("../Models");
const Model = db.logs;


exports.logQuery = (req, res, next) => {
    let userid = req.authedID || "API";
    try {
        let record = {
          Action:req.method,
          User:userid,
          Source:"test",
          Data:req.url.substring(0,100)
        }
        Model.create(record);
        next();
    } catch (err) {
      let a = err;
      // res.status(500).send({
      //   message: `Error logging query`
      // });
    }
  };
  exports.prune = () => {
    console.log('prunning logs');
    db.sequelize
    .query('DELETE FROM logs WHERE createdAt < NOW() - interval 1 month')
    .then(v=>console.log("done"));
    };
