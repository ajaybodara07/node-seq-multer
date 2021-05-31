const axios = require('axios');

const sequelize = require('../config/db.config');

exports.getUpcomingStay = async (req, res) => {
  try {
    const seq = await sequelize();
    let upcomingStay = await seq.query(`CALL spUpcomingStay('${req.params.userId}')`);
    await seq.close();
    if (upcomingStay.length > 0) {
      return res.status(200).send({ status: true, message: "Upcoming stay get successfully", data: upcomingStay });
    } else {
      return res.status(404).send({
        status: false,
        message: `Upcoming stay not found `
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting Upcoming stay"
    });
  }
};

exports.getUpcomingStayFeed = async (req, res) => {
  try {
    const seq = await sequelize();
    let upcomingStayFeed = await seq.query(`CALL spUpcomingStayFEED('${req.params.propertyId}')`);
    await seq.close();
    if (upcomingStayFeed.length > 0) {
      return res.status(200).send({ status: true, message: "Upcoming stay feed get successfully", data: upcomingStayFeed });
    } else {
      return res.status(404).send({
        status: false,
        message: `Upcoming stay feed not found`
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting Upcoming stay feed"
    });
  }
};

// here listId is getting from the list of getUpcomingStayFeed() method 
exports.getUpcomingStayGuideItems = async (req, res) => {
  try {
    const seq = await sequelize();
    let upcomingStayGuide = await seq.query(`CALL spUpcomingStayGuideItems('${req.params.propertyId}')`);
    await seq.close();
    if (upcomingStayGuide.length > 0) {
      res.status(200).send({ status: true, message: "Upcoming stay Guide Items get successfully", data: upcomingStayGuide });
    } else {
      return res.status(404).send({
        status: false,
        message: `Upcoming stay Guide Items not found`
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting Upcoming stay feed details"
    });
  }
};

// here listId is getting from the list of getUpcomingStayFeedDetails() method 
exports.getUpcomingStayListItems = async (req, res) => {
  try {
    const seq = await sequelize();
    let upcomingStayFeed = await seq.query(`CALL spUpcomingStayListItems('${req.params.marketId}','${req.params.bookingId}')`);
    await seq.close();
    if (upcomingStayFeed.length > 0) {
      const groupBy = (xs, key) => {
        return xs.reduce((rv, x) => {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      res.status(200).send({ status: true, message: "Upcoming stay feed list item get successfully", data: groupBy(upcomingStayFeed, 'ListType') });
    } else {
      return res.status(404).send({
        status: false,
        message: `Upcoming stay feed list item not found`
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting Upcoming stay feed list item"
    });
  }
};

exports.getUpcomingStayWeather = async (req, res) => {
  try {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${req.params.zipCode}&appid=${process.env.OPENWEATHER_KEY}&units=metric`);
    let weatherData = {
      temp: data.main.temp,
      city: `${data.name}, ${data.sys.country}`,
      weather: data.weather[0].main,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    }
    res.status(200).send({ status: true, message: "Upcoming stay weather successfully", data: weatherData });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting Upcoming stay weather"
    });
  }
};

exports.createOSTicket = async (req, res) => {
  try {
    axios({
      method: "post",
      url: `http://34.209.77.30/osTicket/upload/api/http.php/tickets.json`,
      data: {
        "alert": true,
        "autorespond": true,
        "source": "API",
        ...req.body,
      },
      headers: { "x-api-key": process.env.osTicket_KEY },
    })
      .then(function (response) {
        res.status(200).send({ status: true, message: "Ticket created successfully", data: `You have created ticket with this refrence number #${response.data}, please followup your query with this reference number` });
      })
      .catch(function (err) {
        console.log(err);
        return res.status(500).send({
          status: false,
          message: err.message || "Some error occurred while getting Upcoming stay weather"
        });
      });

  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while getting Upcoming stay weather"
    });
  }
};
