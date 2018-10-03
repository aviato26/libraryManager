'use strict';
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'please enter a title'
          }
        }
      },
      author: {
        type: DataTypes.STRING,
        validate: {
          isAlpha: {
            msg: 'will only accept letters'
          },
          notEmpty: {
            msg: 'please enter a author'
          }
        }
      },
      genre: {
        type: DataTypes.STRING,
        validate: {
          isAlpha: {
            msg: 'will only accept letters'
          },
          notEmpty: {
            msg: 'please enter a genre'
          }
        }
      },

      first_published: {
        type: DataTypes.INTEGER
      }
    },
    {
      timestamps: false,
      underscored: true
    })
  Books.associate = function(models) {
    // associations can be defined here
    Books.hasMany(models.Loans, {
      foreignKey: 'book_id'
    })
  };
  return Books;
};
