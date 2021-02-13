module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Faq', {
      faq_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      question:{
        type: DataTypes.STRING(100),
        allowNull: true
      },
      answer:{
        type: DataTypes.TEXT,
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
      tableName: 'faq' // THIS LINE HERE
    });
  };
    