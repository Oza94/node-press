
var mongoose    = require('mongoose'),
    Schema        = mongoose.Schema,
    logger        = require('winston'),
    crypto        = require('crypto');

/**
 * @description defining a user model
 */
var userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
});

/**
 * virtual password attribute
 */
userSchema.virtual('password')
  .set(function (password) {
    'use strict';

    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    'use strict';

    return this._password;
  });

var validatePresenceOf = function (value) {
  return value && value.length;
};

userSchema.path('username').validate(function (username) {
  if (!username) {
    return false;
  }

  return username.length;
}, "username can't be blank");

userSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length;
}, "password can't be blank");

userSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next();
  }

  if (!validatePresenceOf(this.password)) {
    return next(new Error('incorrect password'));
  }

  next();
});

userSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())).toString();
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password) {
      return '';
    }
    return crypto.createHmac('sha256', this.salt).update(password).digest('base64');
  }
};

mongoose.model('User', userSchema);