module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Service', {
      service_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      service_title:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      logo:{
        type: DataTypes.STRING(255),
        allowNull: true
      },   
      // name:{
      //   type: DataTypes.STRING(255),
      //   allowNull: true
      // },
      url:{
        type: DataTypes.STRING(100),
        allowNull: true
      },    
      description:{
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
      tableName: 'service' // THIS LINE HERE
    });
  };
    