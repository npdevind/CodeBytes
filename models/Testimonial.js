module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Testimonial', {
      testimonial_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name:{
        type: DataTypes.STRING(255),
        allowNull: true
      },   
      dp:{
        type: DataTypes.STRING(255),
        allowNull: true
      },      
      profession :{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      intro :{
        type: DataTypes.TEXT,
        allowNull: true
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
      tableName: 'testimonial' 
    });
  };
    