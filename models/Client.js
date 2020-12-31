module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Client', {
      client_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      image:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      name:{
        type: DataTypes.STRING(255),
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
      tableName: 'client' // THIS LINE HERE
    });
  };
    