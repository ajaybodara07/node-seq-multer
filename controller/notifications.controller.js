const sequelize = require('../config/db.config');

exports.getAppRefreshNotifications = async (req, res) => {
  try {
    const seq = await sequelize();
    let appRefNot = await seq.query(`CALL spAppRefreshNotifications('${req.params.propertyId}', '${req.params.userId}')`);
    await seq.close();
    if (appRefNot.length > 0) {
      res.status(200).send({ status: true, message: "App refresh notifications list get successfully", data: appRefNot[0] });
    } else {
      return res.status(404).send({
        status: false,
        message: `App refresh notifications list not found`
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting App refresh notifications list"
    });
  }
};

exports.getClearAppRefreshNotifications = async (req, res) => {
  try {
    const seq = await sequelize();
    let appRefNot = await seq.query(`CALL spClearAppRefreshNotifications('${req.params.propertyId}', '${req.params.userId}')`);
    await seq.close();
    if (appRefNot && appRefNot.length > 0) {
      res.status(200).send({ status: true, message: "Clear App refresh notifications list get successfully", data: appRefNot });
    } else {
      return res.status(404).send({
        status: false,
        message: `Clear App refresh notifications list not found`
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting Clear App refresh notifications list"
    });
  }
};

exports.getNewNotifications = async (req, res) => {
  try {
    const seq = await sequelize();
    let getNotifications = await seq.query(`CALL spGetNewNotifications('${req.params.userId}','${req.params.retrieveAllNotifications}')`);
    await seq.close();
    if (getNotifications.length > 0) {
      return res.status(200).send({ status: true, message: "get notifications successfully", data: getNotifications });
    } else {
      return res.status(404).send({
        status: false,
        message: `Notifications not found `
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting notifications"
    });
  }
};

exports.setClearNewNotifications = async (req, res) => {
  try {
    const seq = await sequelize();
    await seq.query(`CALL spClearNewNotifications('${req.params.userId}')`);
    await seq.close();
    return res.status(200).send({ status: true, message: "clear notifications successfully" });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting notifications"
    });
  }
};

exports.setMarkNotificationsAsRead = async (req, res) => {
  try {
    const seq = await sequelize();
    let setNotifications = await seq.query(`CALL spMarkNotificationsAsRead('${req.body.userId}','${req.body.notificationsList}')`);
    await seq.close();
    return res.status(200).send({ status: true, message: "Notifications mark successfully", data: setNotifications });

  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting notifications"
    });
  }
};

exports.getSMSAndPushNotifications = async (req, res) => {
  try {
    const seq = await sequelize();
    let getNotifications = await seq.query(`CALL spAPI_GetSMSAndPushNotifications()`);
    if (getNotifications.length > 0) {
      await Promise.all(getNotifications.map(async (notifyData, index) => {
        await seq2.query(`CALL spAPI_MarkSMSAndPushNotificationAsSent('${notifyData.UserId}')`);
      }));
      console.log('if conn close...');
      await seq.close();
    } else {
      console.log('else conn close...');
      await seq.close();
    }
  } catch (err) {
    console.log("catch error: ", err);
  }
};