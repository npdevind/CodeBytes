module.exports = function(sequelize, DataTypes) {
    return sequelize.define('AboutUs', {
      aboutus_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      introduction:{
        type: DataTypes.TEXT,
        allowNull:true
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
      tableName: 'aboutus'
    });
  };
    