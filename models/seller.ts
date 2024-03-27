'use strict';
import {
  Model
} from 'sequelize';
interface SellerAttributes{
  id: string;
  name: string;
  email:string;
  password: string;
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Seller extends Model <SellerAttributes> implements SellerAttributes {
    id!: string;
    name!: string;
    email!: string;
    password!: string;
    static associate(models: any) {
      Seller.hasMany(models.Transaction);
    }
  }
  Seller.init({
    id:{
      type:DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false
    } 
  }, {
    sequelize,
    modelName: 'Seller',
    timestamps: true
  });
  return Seller;
};