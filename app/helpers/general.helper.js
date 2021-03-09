/**
 * Created by Saleh on 07/02/2019.
 */
'use strict'

var PromiseReturns = require('bluebird')
var StandardError = require('standard-error')
var _ = require('lodash')
var fs = require('fs')
var nodemailer = require('nodemailer')
// Check if user has permission or not
function checkIfUserHasPermission (permissionName, permissionsArray) {
  for (let i = 0; i < permissionsArray.length; i++) {
    if (permissionName === permissionsArray[i].moduleName) {
      return true
    }
  }
  return false
}

function rejectPromise (message, code = null) {
  winston.error(message)
  return new PromiseReturns(function (resolve, reject) {
    reject(new StandardError({
      status: 'Error',
      message: message,
      statusCode: code
    }))
  })
}

function catchException (err) {
  winston.error(err)
  return rejectPromise(err.message, err.statusCode)
}

function putS3Object (s3, params) {
  return new PromiseReturns(function (resolve, reject) {
    s3.putObject(params, function (err) {
      if (err) {
        return rejectPromiseReturns(reject, err)
      }
      resolve()
    })
  })
}

function uploadImageToS3 (imageFile) {
  return new PromiseReturns(function (resolve) {
    if (imageFile) {
      var file = imageFile
      var fileName = file.originalname
      var filePath = config.s3.host_name + config.s3.bucket + '/' + config.s3.paths.original + fileName
      var s3Key = config.s3.paths.original + fileName

      AWS.config.update(config.s3.credentials)
      var s3 = new AWS.S3({ params: { Bucket: config.s3.bucket } })
      var params = {
        Key: s3Key,
        Body: fs.createReadStream(file.path),
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'application/octet-stream'
      }
      var obj = {
        s3: s3,
        params: params,
        filePath: filePath
      }
      return resolve(obj)
    } else {
      resolve(null)
    }
  })
}
const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({

    service: 'gmail',
    // host: 'smtp.mailtrap.io',
    // port: 2525,
    auth: {
      user: 'hamzaaslam769@gmail.com',
      pass: 'lion1356192'
    }
    // Activate in gmail "less secure app" option
  })
  // define email option
  const mailOption = {
    from: '<hamzaaslam769@gmail.com>',
    to: options.email,
    subject: 'Please confirm your account',
    text: options.message,
    html: `<h1>Email Confirmation</h1>
    <h2>Hello ${options.userName}</h2>
    <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
    <a href=http://localhost:4200/auth/verify/${options.code}/${options.email}> Click here</a>
    </div>`
  }
  // 3 actually send the email
  await transporter.sendMail(mailOption)
}
module.exports = {
  checkIfUserHasPermission,
  rejectPromise,
  catchException,
  putS3Object,
  uploadImageToS3,
  sendEmail

}
