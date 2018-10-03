'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loans = sequelize.define('Loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },

    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'please enter a book'
        }
      }
    },

    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'please enter a patron'
        }
      }
    },

    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'please enter date'
        },
        notEmpty: {
          msg: 'please enter a date'
        }
      }
    },

    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'please enter date'
        },
        notEmpty: {
          msg: 'please enter a date'
        }
      }
    },

    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'please enter date'
        },
        notEmpty: {
          msg: 'please enter a date'
        }
      }
    }

  }, {timestamps: false, underscored: true});
  Loans.associate = function(models) {
    // associations can be defined here
    Loans.belongsTo(models.Books, {foreignKey: 'book_id'})
    Loans.belongsTo(models.Patrons, {foreignKey: 'patron_id'})
  };
  return Loans;
};
