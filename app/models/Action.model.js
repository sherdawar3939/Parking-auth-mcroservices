'use strict'

module.exports = function (sequelize, DataTypes) {
  let Action = sequelize.define('Action',
    {
      title: {
        type: DataTypes.STRING(20)
      },
      identifier: {
        type: DataTypes.STRING(20)
      }
    }, {
      associate: function (models) {
        Action.belongsToMany(models.Module, {
          through: 'ModuleAction',
          foreignKey: 'ActionId'
        })
      }
    }
  )
  return Action
}
