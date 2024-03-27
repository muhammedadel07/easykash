import {Request,Response,NextFunction} from 'express';
import db from '../models';
import sequelize from "sequelize";

const getTransactionSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = req.query.page || 0;
        const per_page = req.query.per_page || 0;
        const SellerId = req.query.seller_id;
        let date_range:any = req.query.date_range;
        let start:any;
        let end:any;
        let dateData: any;
        if(date_range){
            [start,end] = date_range.split('_')
        }
        if(start && end){
            dateData = {
                createdAt :{
                    [sequelize.Op.between]:[new Date(start), new Date(end)]
                }
             }
        }
        console.log(start,end)

        const skip: number = (+page - 1) * +per_page + 1;
        const totalTransactionSeller = await db.Transaction.count({
            where : 
            {
                SellerId : SellerId
            }
        })
        const transaction = await db.Transaction.findAll({
            limit: +per_page,
            offset: skip,
            attributes:
            {
                exclude: 
                [
                    'createdAt',
                    'SellerId'
                ]
            },
            where:
            {
                ...dateData,
                SellerId: SellerId
            }
        });
        return res.status(200).json({
            data : 
            {
                transaction: transaction,
                paging:
                {
                    total: totalTransactionSeller,
                    current_page: page,
                    per_page: per_page 
                }
            }
            
        })

    } catch (err) {
        next(err);
    }
}

const AddTransaction = async(req: Request, res: Response, next: NextFunction) => {
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const SellerId = req.query.seller_id;
    try {
        const transaction = await db.Transaction.build({
            title,
            image,
            price,
            SellerId
        });
        transaction.save();
        return res.status(200).json({
            message:"transaction procsseded"
        })
    } catch (err) {
        next(err);
    }
}

export default {
    AddTransaction,
    getTransactionSeller
};