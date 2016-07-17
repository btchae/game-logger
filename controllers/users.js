var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  },
  {
    classMethods: generateHash: function(passwword) {
      return bcrypt.hashSync(password, bcrypt.SaltSync(8), null);
    },
    {
      instanceMethods: {
        validPassword: function(password) {
          return bcrypt.compareSync(password, this.password);
        }
      },
      getterMethods: {
        someValue: function() {
          return this.someValue;
        }
      },
      setterMethods: {
        someValue: function(value) {
          this.someValue = value;
        }
      }
    }
  });
}