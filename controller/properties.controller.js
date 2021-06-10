const axios = require('axios');

const sequelize = require('../config/db.config');

exports.cronJob = async (req, res) => {
  try {
    // property fetch and add lat/lomg
    const seq = await sequelize();
    let PropNeedCoord = await seq.query(`CALL spPropertiesNeedingGPSCoordinates()`);
    if (PropNeedCoord.length > 0) {
      await Promise.all(PropNeedCoord.map(async (coordData, index) => {
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${coordData.ZIPCode}&key=${process.env.GOOGLE_KEY}`);
        if (data) {
          await seq.query(`CALL spSavePropertyGPSCoordinates(${coordData.PropertyID},${data.results[0].geometry.location.lng},${data.results[0].geometry.location.lat})`);
        }
      }));
      await seq.close();
    } else {
      await seq.close();
    }

    // place fetch and add lat/lomg
    const seq1 = await sequelize();
    let PlaceNeedCoord = await seq1.query(`CALL spPlacesNeedingGPSCoordinates()`);
    if (PlaceNeedCoord.length > 0) {
      await Promise.all(PlaceNeedCoord.map(async (coordData, index) => {
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${coordData.ZIPCode}&key=${process.env.GOOGLE_KEY}`);
        if (data) {
          await seq1.query(`CALL spSavePlaceGPSCoordinates(${coordData.PlaceID},${data.results[0].geometry.location.lng},${data.results[0].geometry.location.lat})`);
        }
      }));
      await seq1.close();
    } else {
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
      await seq2.close();
    } else {
      await seq2.close();
    }

    return res.status(200).send({
      status: true,
      message: "Job call successfully"
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting Upcoming stay"
    });
  }
};
