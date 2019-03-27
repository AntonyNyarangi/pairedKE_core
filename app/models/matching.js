module.exports = {
  bloodGroup: async function(donorBloodGroup) {
    let recipientBloodGroups = getRecipientBloodGroups(donorBloodGroup);
    // let patients = [];

    await connection.query(
      `select * from patients where bloodType = ?`,
      donorBloodGroup,
      function(err, res) {
        if (err) throw err;
        patients = res;
        console.log(patients);
        return patients;
      }
    );
  }
};

function getRecipientBloodGroups(donorBloodGroup) {
  switch (donorBloodGroup) {
    case "A":
      recipientBloodGroups = ["A", "AB"];
      break;
    case "B":
      recipientBloodGroups = ["B", "AB"];
      break;
    case "AB":
      recipientBloodGroups = ["AB"];
      break;
    case "O":
      recipientBloodGroups = ["A", "B", "AB", "O"];
      break;
  }
}
