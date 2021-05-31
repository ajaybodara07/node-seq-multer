const sequelize = require('../config/db.config');

exports.getGroup = async (req, res) => {
    try {
        const seq = await sequelize();
        let groupList = await seq.query(`CALL spGroups('${req.params.bookingId}')`);
        await seq.close();
        if (groupList.length > 0) {
            res.status(200).send({ status: true, message: "Group list get successfully", data: groupList });
        } else {
            return res.status(404).send({
                status: false,
                message: `Group list not found`
            });
        }
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message || "Some error occurred while getting Group list"
        });
    }
};

exports.addUpdateUserInfo = async (req, res) => {
    try {
        const seq = await sequelize();
        let groupList = await seq.query(`set @NewExistingUserID_ = 0; CALL spAddUpdateUserInfo(${req.body.UserID},'${req.body.FirstName}',
      '${req.body.LastName}','${req.body.Email}',${req.body.RegistrationStatus},${req.body.Active},'${req.body.Password}'
      ,'${req.body.Phone}','${req.body.ImageURL}','${req.body.Units}','${req.body.DeviceChecksum}', @NewExistingUserID_); select @NewExistingUserID_;`);
        await seq.close();
        if (groupList.length > 0) {
            res.status(200).send({ status: true, message: "Add/Update group User successfully", data: groupList[0] });
        } else {
            return res.status(404).send({
                status: false,
                message: `Group list not found`
            });
        }
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message || "Some error occurred while getting Group list"
        });
    }
};

exports.addRemoveUsersToBookings = async (req, res) => {
    try {
        const seq = await sequelize();
        await seq.query(`CALL spAddRemoveUsersToBookings(${req.body.BookingID},${req.body.UserID},
      '${req.body.Action}',${req.body.UserRoleID},${req.body.AddedByUserID})`);
        await seq.close();
        return res.status(200).send({ status: true, message: "Add/Remove Users To Booking successfully" });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message || "Some error occurred while getting Group list"
        });
    }
};
