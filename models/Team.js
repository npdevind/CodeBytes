module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Team', {
      team_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      team_title:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      name:{
        type: DataTypes.STRING(255),
        allowNull: true
      },   
      dp:{
        type: DataTypes.STRING(255),
        allowNull: true
      },   
      position:{
        type: DataTypes.STRING(255),
        allowNull: true
      },    
      twitter_id :{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      fb_id :{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      insta_id :{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      linkdin_id :{
        type: DataTypes.STRING(50),
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
      tableName: 'team' // THIS LINE HERE
    });
  };
    