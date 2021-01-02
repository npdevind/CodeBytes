module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Portfolio', {
      portfolio_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      type:{
        type: DataTypes.ENUM('APP','CARD','WEB'),
        allowNull: true
      },
      name:{
        type: DataTypes.STRING(100),
        allowNull: true
      },
      screen_shot:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      url:{
        type: DataTypes.STRING(100),
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
      tableName: 'portfolio' // THIS LINE HERE
    });
  };
    