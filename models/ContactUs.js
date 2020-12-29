module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ContactUs', {
      contact_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      logo:{
        type: DataTypes.STRING(255),
        allowNull: true
      },      
      description:{
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
      location :{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      email :{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      mobile :{
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
      tableName: 'contact_us' // THIS LINE HERE
    });
  };
    