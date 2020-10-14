const util = require("util");
const query = util.promisify(connection.query).bind(connection);

exports.getRuns = async function (req, res) {
  try {
    const matchRuns = await query(
      `select * from matching_runs`
    );
    res.status(200).json(matchRuns);
  } catch (err) {
    res.status(500).send(err);
  }

  // Donors.removeDonorByID(req.params.donorID, function (err, donor) {
  //   if (err) {
  //     res.send(err);
  //   }
  //   res.json(donor);
  // });
};
