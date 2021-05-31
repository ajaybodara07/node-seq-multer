const axios = require('axios');
const CronJob = require('cron').CronJob;

const sequelize = require('../config/db.config');

const setProptyPlaceCord_Distance = new CronJob('00 00 */12 * * *', async () => {
  try {
    // property fetch and add lat/lomg
    const seq = await sequelize();
    let PropNeedCoord = await seq.query(`CALL spPropertiesNeedingGPSCoordinates()`);
    console.log("PropNeedCoord: ", PropNeedCoord.length);
    if (PropNeedCoord.length > 0) {
      await Promise.all(PropNeedCoord.map(async (coordData, index) => {
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${coordData.ZIPCode}&key=${process.env.GOOGLE_KEY}`);
        if (data) {
          await seq.query(`CALL spSavePropertyGPSCoordinates(${coordData.PropertyID},${data.results[0].geometry.location.lng},${data.results[0].geometry.location.lat})`);
        }
      }));
      console.log("await conn close......");
      await seq.close();
    } else {
      console.log("else prop conn close...");
      await seq.close();
    }

    // place fetch and add lat/lomg
    const seq1 = await sequelize();
    let PlaceNeedCoord = await seq1.query(`CALL spPlacesNeedingGPSCoordinates()`);
    console.log("PlaceNeedCoord: ", PlaceNeedCoord.length);
    if (PlaceNeedCoord.length > 0) {
      await Promise.all(PlaceNeedCoord.map(async (coordData, index) => {
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${coordData.ZIPCode}&key=${process.env.GOOGLE_KEY}`);
        if (data) {
          await seq1.query(`CALL spSavePlaceGPSCoordinates(${coordData.PlaceID},${data.results[0].geometry.location.lng},${data.results[0].geometry.location.lat})`);
        }
      }));
      console.log("await conn close......");
      await seq1.close();
    } else {
      console.log("else place conn close......");
      await seq1.close();
    }

    // add lat/long by place
    const seq2 = await sequelize();
    let ListNeedCoord = await seq2.query(`CALL spListItemsNeedingDistances()`);
    if (ListNeedCoord.length > 0) {
      await Promise.all(ListNeedCoord.map(async (coordData, index) => {
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${coordData.ListItemAddress}, ${coordData.ListItemCity}, ${coordData.ListItemState}&destinations=${coordData.PropertyAddress}, ${coordData.PropertyCity}, ${coordData.PropertyState}&key=${process.env.GOOGLE_KEY}`);
        if (data) {
          await seq2.query(`CALL spSaveListItemDistanceFromProperty(${coordData.PropertyID}, ${coordData.ListItemID}, ${parseFloat(data.rows[0].elements[0].distance.text.split(" ")[0])}, null)`);
        }
      }));
      console.log("await conn close......");
      await seq2.close();
    } else {
      console.log("else list conn close......");
      await seq2.close();
    }

    console.log("Job call successfully");
    return;
  } catch (err) {
    console.log("catch Job error: ", err);
    return;
  }
});
const getSMSAndPushNotifications = new CronJob('00 */1 * * * *', async () => {
  console.log(`Job instantiation for getSMSAndPushNotifications: ${new Date().toISOString()}`);
  try {
    const seq = await sequelize();
    let getNotifications = await seq.query(`CALL spAPI_GetSMSAndPushNotifications()`);
    if (getNotifications.length > 0) {
      await Promise.all(getNotifications.map(async (notifyData, index) => {
        await seq.query(`CALL spAPI_MarkSMSAndPushNotificationAsSent('${notifyData.UserId}')`);
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
});

exports.cronJob = () => {
  try {
    setProptyPlaceCord_Distance.start();
    getSMSAndPushNotifications.start();
  } catch (err) {
    console.log("err in cron-job: ", err);
  }
};
