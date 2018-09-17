'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loans = sequelize.define('Loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {timestamps: false, underscored: true});
  Loans.associate = function(models) {
    // associations can be defined here
  };
  return Loans;
};
