module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Admin', {
      admin_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      username:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      name:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      email:{
        type: DataTypes.STRING(255),
        allowNull: false,
        unique:true
      },
      password:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      image:{
        type: DataTypes.STRING(255),
        allowNull:true
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
      tableName: 'admin' // THIS LINE HERE
    });
  };
    