'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patrons = sequelize.define('Patrons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: {
          msg: 'will only accept letters'
        },
        notEmpty: {
          msg: 'please enter a first name'
      }
    }
  },

    last_name: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: {
          msg: 'will only accept letters'
        },
        notEmpty: {
          msg: 'please enter a last name'
        }
      }
    },

    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'please enter a address'
        }
      }
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'must be a email address'
        },
        notEmpty: {
          msg: 'please enter a email'
        }
      }
    },

    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'please enter a library id'
        }
      }
    },

    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: 'must be an integer'
        },
        notEmpty: {
          msg: 'please enter a zip code'
        }
      }
    }

  }, {timestamps: false, underscored: true});
  Patrons.associate = function(models) {
    // associations can be defined here
    Patrons.hasMany(models.Loans, {foreignKey: 'book_id'})
  };
  return Patrons;
};
