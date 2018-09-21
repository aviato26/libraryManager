'use strict';
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      genre: DataTypes.STRING,
      first_published: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      underscored: true
    })
  Books.associate = function(models) {
    // associations can be defined here
  };
  return Books;
};
