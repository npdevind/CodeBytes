module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Developer', {
      dev_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name:{
        type: DataTypes.STRING(100),
        allowNull: true
      },
      position:{
        type: DataTypes.STRING(100),
        allowNull: true
      },
      image:{
        type : DataTypes.STRING(100),
        allowNull: true
      },
      status:{
        type: DataTypes.ENUM('Yes','No','Blocked'),
        defaultValue: 'No',
        allowNull: false
      },
      createdBy: {
        type: DataTypes.STRING(255),
        allowNull:true
      },
      updatedBy:{
        type: DataTypes.STRING(255),
        allowNull:true
      } 
    },{
      tableName: 'developer' // THIS LINE HERE
    });
  };
    