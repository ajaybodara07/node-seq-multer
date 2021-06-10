const Joi = require('joi');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const authyClient = require('authy-client').Client;
const authy = new authyClient({ key: process.env.TFA_API_KEY });

const db = require("../model");
const sequelize = require('../config/db.config');
const { mailSend, smsSend } = require('../helper/mail');

const Users = db.Users;

const schema = Joi.object({
  Email: Joi.string().min(6).email({ tlds: { allow: false } }),
  Password: Joi.string().min(6),
  FirstName: Joi.string().min(3),
  LastName: Joi.string().min(3),
  Phone: Joi.string().min(6).max(15)
});

exports.registorUser = (req, res) => {
  try {
    var ciphertext = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString();
    const { error, value } = schema.validate({
      Email: req.body.email,
      Password: ciphertext
    });
    if (error) throw error;
    if (req.body.isInvite) {
      Users.create({ ...value, RegistrationStatus: 1 }).then(data => {
        mailSend({
          email: data[0].Email,
          sub: 'Registration in invission app!',
          html: '<strong>and easy to do anywhere, even with Node.js</strong>'
        });
        return res.status(200).send({ status: true, message: "User registor successfully" });
      }).catch(err => {
        return res.status(500).send({
          status: false,
          message:
            err.message || "Some error occurred while adding the invited user"
        });
      });
    } else {
      Users.findAll({
        where: { Email: req.body.email },
        attributes: { exclude: ['Password'] }
      }).then(async data => {
        if (data.length > 0) {
          // Update Users in the database
          delete value.Email
          const authyRes = await authy.registerUser({
            countryCode: req.body.country_code,
            email: req.body.email,
            phone: data[0].Phone
          });
          if (authyRes.success === true) {
            Users.update({
              ...value,
              RegistrationStatus: 1,
              AuthyId: authyRes.user.id,
              CountryCode: req.body.country_code
            }, {
              where: { Email: req.body.email }
            }).then(updateData => {
              mailSend({
                email: data[0].Email,
                sub: 'Registration in wandarhome app',
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="format-detection" content="telephone=no"><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;"><meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" /><title>Render Health | Confirmation Email - Patient Portal</title><link href="https://fonts.googleapis.com/css?family=Poppins:400,700&display=swap" rel="stylesheet"><style type="text/css">#outlook a{padding:0}body{width:100% !important;-webkit-text;size-adjust:100%;-ms-text-size-adjust:100%;margin:0;padding:0}.ReadMsgBody{width:100%}.ExternalClass{width:100%}.backgroundTable{margin:0 auto;padding:0;width:100%;!important}table td{border-collapse:collapse}.ExternalClass *{line-height:115%}</style><style type="text/css">@media only screen and (max-width: 600px){.col{display:block !important;text-align:center !important;width:100% !important;box-sizing:border-box !important;-webkit-box-sizing:border-box !important}.leftAlign{text-align:left !important}.bottomPadding{padding:0 0 20px 0 !important}.removePadding{padding:0 !important}.fullWidth{width:100% !important}.font20{font-size:20px !important}.width25{width:25px !important}.headerPadding{padding:20 25px !important}.signaturePadding{padding:0 25px 50px 25px !important}.hide{display:none !important}.unblockImage{display:inline !important}.contentPadding{padding:0 30px 60px !important}.titleFont{font-size:30px !important;line-height:40px !important}}</style></head><body style="padding:0; margin:0"><table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0" width="100%"><tr><td align="center" valign="top"><table cellpadding="0" cellspacing="0" border="0" width="600" class="fullWidth" align="center"><tr><td><table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="233C4B" style="background-color: #233C4B"><tr><td style="padding: 20px 20px 10px 20px;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td width="33.3%"> &nbsp;</td><td width="33.3%" style="vertical-align: middle; text-align: center;" valign="middle"> <a href="#" style="text-decoration: none;"> <img src="https://i.imgur.com/HuqBe3W.png" border="0" alt="wonderhome" /> </a></td><td width="33.3%" style="vertical-align: middle;" valign="middle"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td><table cellpadding="0" cellspacing="0" border="0" align="right"><tr><td style="padding-bottom: 20px; text-align: center;"> <a href="#" style="text-decoration: none;"> <img src="https://i.ibb.co/T0DdDcP/facebook.png" border="0" alt="Facebook" /> </a></td></tr><tr><td style="padding-bottom: 20px; text-align: center;"> <a href="#" style="text-decoration: none;"> <img src="https://i.ibb.co/K2x19xt/twitter.png" border="0" alt="Twitter" /> </a></td></tr><tr><td style="padding-bottom: 0px; text-align: center;"> <a href="#" style="text-decoration: none;"> <img src="https://i.ibb.co/GtxFCJ6/instagram.png" border="0" alt="Instagram" /> </a></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td> <img src="https://i.ibb.co/qYK4VVL/shape.png" border="0" alt="Rounded Shape" width="100%" style="display: block;" /></td></tr></table><table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="ffffff" style="background-color: #ffffff"><tr><td class="contentPadding" style="padding: 0 13px;"><table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: 'Poppins', Arial, Helvetica, sans-serif; font-size: 14px;"><tr><td class="titleFont" style="text-align: center; color: #000000; font-weight: normal; line-height: 50px; mso-line-height-rule: exactly; font-size: 40px; padding-bottom: 20px;"> <span style="color: #01BBAE;">Registration mail</span><br /></td></tr><tr><td style="color: #777777; font-weight: normal; line-height: 21px; mso-line-height-rule: exactly; padding-bottom: 20px;"> <span style="text-align: left;">Hello </span>,<br /><div>Welcome to wonderhome app, you have successfully done your signup in our app, Now you need to do a login into over app and you can findout your all the booking and group related thing in our app</br> Thanks</div><br /></td></tr></table></td></tr><tr><table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="233C4B" style="background-color: #233C4B"><tr><td style="padding: 20px;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td><table cellpadding="0" cellspacing="0" border="0" align="center"><tr><td style="padding-right: 20px; text-align: center;"> <a href="#" style="text-decoration: none;"> <img src="https://i.ibb.co/T0DdDcP/facebook.png" border="0" alt="Facebook" /> </a></td><td style="padding-right: 20px; text-align: center;"> <a href="#" style="text-decoration: none;"> <img src="https://i.ibb.co/K2x19xt/twitter.png" border="0" alt="Twitter" /> </a></td><td style="padding-right: 0px; text-align: center;"> <a href="#" style="text-decoration: none;"> <img src="https://i.ibb.co/GtxFCJ6/instagram.png" border="0" alt="Instagram" /> </a></td></tr></table></td></tr></table></td></tr></table></tr><tr><td class="contentPadding" style="padding: 0 30px 50px;"><table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: 'Poppins', Arial, Helvetica, sans-serif; font-size: 14px;margin-top: 10px"><tr><td style="text-align: center; color: #777777; font-weight: normal; line-height: 21px; mso-line-height-rule: exactly; padding-bottom: 20px;"> © Wonderhomeapp,<br /> 311 Sundance Cir, Palm Desert, California 92211-3218, United States<br /> <small>If you have any questions or concerns, please email us at david@wanderhome.com</small></td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>`
              });
              smsSend({
                phone: data[0].Phone,
                msgBody: "You have successfully done the regisration process into Invision app, please login into app to see upcomming booking"
              });
              return res.status(200).send({ status: true, message: "User registor successfully" });
            }).catch(err => {
              return res.status(500).send({
                status: false,
                message: err.message || "Some error occurred while creating the Users."
              });
            });
          } else {
            return res.status(400).send({
              status: false,
              message: `Getting error while registor user with Twilio authy`
            });
          }
        } else {
          return res.status(404).send({
            status: false,
            message: `User not found with ${req.body.email}`
          });
        }
      }).catch(err => {
        return res.status(500).send({
          status: false,
          message: err.message || "Some error occurred while retrieving Users."
        });
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while creating the Users."
    });
  }
};

exports.sendTFA_OTP = (req, res) => {
  try {
    const phone = req.body.phone;
    const token = req.body.token;
    Users.findAll({
      where: { Phone: phone },
      attributes: { exclude: ['Password'] }
    }).then(data => {
      if (data.length > 0) {
        if (token) {
          authy.verifyToken({ authyId: data[0].AuthyId, token: token }, function (err, tokenRes) {
            if (err) {
              setTimeout(() => {
                return res.status(401).send({
                  status: false,
                  message: err.message || "Some error occurred while Verify Token"
                });
              }, 500);
            }
            if (tokenRes && tokenRes.success) {
              return res.status(200).send({ status: true, message: "Verify user successfully" });
            }
          });
        } else {
          authy.requestSms({ authyId: data[0].AuthyId }, { force: true }, function (err, smsRes) {
            if (err) {
              console.log('ERROR requestSms', err);
              setTimeout(() => {
                return res.status(401).send({
                  status: false,
                  message: "Some error occurred while requesting Token"
                });
              }, 500);
            } else {
              return res.status(200).send({ status: true, message: "OTP send successfully" });
            }
          });
        }
      } else {
        return res.status(404).send({
          status: false,
          message: `User not found with ${phone}`
        });
      }
    }).catch(err => {
      return res.status(500).send({
        status: false,
        message: "Error retrieving User with email=" + phone
      });
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while creating the Users."
    });
  }
};

exports.getUser = (req, res) => {
  try {
    const email = req.params.email;
    Users.findAll({
      where: { Email: email },
      attributes: { exclude: ['Password'] }
    }).then(data => {
      if (data.length > 0) {
        return res.status(200).send({ status: true, message: "User get successfully", data: data[0] });
      } else {
        return res.status(404).send({
          status: false,
          message: `User not found with ${email}`
        });
      }
    }).catch(err => {
      return res.status(500).send({
        status: false,
        message: "Error retrieving User with email=" + email
      });
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while creating the Users."
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const seq = await sequelize();
    let userData = await seq.query(`CALL spUserAuth('${email}')`);
    await seq.close();
    if (userData.length > 0) {
      if (userData[0].RegistrationStatus !== 1) {
        return res.status(401).send({
          status: false,
          message: `First you need to registor with password into our app`
        });
      } else {
        var bytes = CryptoJS.AES.decrypt(userData[0].Password, process.env.PASS_SECRET);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (originalText === req.body.password) {
          const token = jwt.sign({ email: req.body.email }, process.env.TOKEN_SECRET);
          const checkSum = genrateCheckSum(req.body.DeviceFootprint, 5);
          let isTFA = true;
          userData[0].DeviceChecksums && userData[0].DeviceChecksums.split(",").map(chunk => {
            if (chunk.indexOf(checkSum.replace(/'/g, '_').replace(/,/g, '!')) != -1) {
              isTFA = false
            }
          })
          return res.status(200).send({ status: true, message: "User get successfully", token, isTFA: isTFA, user: userData.map(({ Password, ...keepAttrs }) => keepAttrs) });
        } else {
          return res.status(401).send({
            status: false,
            message: `Please enter corrent password`
          });
        }
      }
    } else {
      return res.status(404).send({
        status: false,
        message: `User not found with ${email}`
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while creating the Users."
    });
  }
};

exports.userLoginHistory = async (req, res) => {
  try {
    const UserID = req.body.UserID;
    const LoginType = req.body.LoginType;
    const Success = req.body.Success;
    const IPAddress = req.body.IPAddress;
    const UUID = req.body.uuid;
    const DeviceFootprint = req.body.DeviceFootprint;
    const Longitude = req.body.Longitude;
    const Latitude = req.body.Latitude;
    const checkSum = genrateCheckSum(req.body.DeviceFootprint, 5);
    const seq = await sequelize();
    let userData = await seq.query(`CALL spUsers_LoginHistory_Insert(${UserID}, ${LoginType}, ${Success}, '${IPAddress}', '${UUID}', "${DeviceFootprint}", ${Longitude}, ${Latitude}, '${checkSum.replace(/'/g, '_').replace(/,/g, '!')}')`);
    return res.status(200).send({ status: true, message: "User Login history added successfully", data: userData });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message
    });
  }
};

const genrateCheckSum = (string, times) => {
  let repeatedString = "";
  let range = 8;
  while (times > 0) {
    range += range
    repeatedString += string.substr(range + 5, 2);
    times--;
  }
  return repeatedString;
}

exports.getAllUsers = (req, res) => {
  try {
    Users.findAll({ attributes: { exclude: ['Password'] } }).then(data => {
      return res.status(200).send({ status: true, message: "User retrieving successfully", data });
    }).catch(err => {
      return res.status(500).send({
        status: false,
        message: err.message || "Some error occurred while retrieving Users."
      });
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while retrieving Users."
    });
  }
};

exports.updateUser = (req, res) => {
  try {
    jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).send({
          status: false,
          message: err.message || "Some error occurred while retrieving Users."
        });
      } else {
        const email = req.body.email;
        const { error, value } = schema.validate({
          FirstName: req.body.firstName,
          LastName: req.body.lastName,
          Phone: req.body.phone
        });
        if (error) throw error;
        delete value.Email;
        const file = req.file;
        fs.unlinkSync(file.path)
        Users.update(value, { where: { Email: email } }).then((num, err) => {
          if (num == 1) {
            return res.status(200).send({
              status: true,
              message: "Users was updated successfully."
            });
          } else {
            return res.status(400).send({
              status: false,
              message: `Please pass diffrent value in payload with email=${email}`
            });
          }
        }).catch(err => {
          fs.unlinkSync(file.path)
          return res.status(500).send({
            status: false,
            message: "Error updating User with email=" + email
          });
        });
      }
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message || "Some error occurred while update Users."
    });
  }
};

exports.deleteUser = (req, res) => {
  const email = req.params.email;
  Users.destroy({ where: { Email: email } }).then(num => {
    if (num == 1) {
      return res.send({
        status: true,
        message: "User was deleted successfully!"
      });
    } else {
      return res.send({
        status: false,
        message: `Cannot delete User with email=${email}. Maybe User was not found!`
      });
    }
  }).catch(err => {
    return res.status(500).send({
      status: false,
      message: "Could not delete User with email=" + email
    });
  });
};
