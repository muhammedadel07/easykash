'use strict';
import {
  Model
} from 'sequelize';
interface TransactionAttributes {
  id: number,
  title: string,
  image: string,
  price: number,
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Transaction extends Model<TransactionAttributes> implements TransactionAttributes {
    id!:number;
    title!: string;
    image!: string;
    price!: number;
    static associate(models: any) {
      Transaction.belongsTo(models.Seller);
    }
  }
  Transaction.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      autoIncrement:true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};