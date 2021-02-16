module.exports = function(sequelize, DataTypes) {
    return sequelize.define('BlogCategory', {
      blg_cat_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      dev_id:{
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      blog_id:{
        type: DataTypes.INTEGER(11),
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
      tableName: 'blog_category' // THIS LINE HERE
    });
  };
    