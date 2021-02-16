module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Blog', {
      blog_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title:{
        type: DataTypes.STRING(150),
        allowNull: true
      },
      description:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      content:{
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
      tableName: 'blog' // THIS LINE HERE
    });
  };
    