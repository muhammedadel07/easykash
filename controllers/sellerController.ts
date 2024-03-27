import {Request,Response,NextFunction} from 'express';
import sequelize from 'sequelize';
import db from '../models';

const getSummaryTransaction = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const sellerId = req.query.seller_id;
        const date_range: any = req.query.date_range;
        let start: any;
        let end: any;
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
        const seller = await db.Seller.findByPk(sellerId);
        const createdAtObj = await db.Transaction.findAll({
            where : 
            {
                SellerId : seller.id,
                ...dateData
            },
            attributes:[[sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d'), 'createdAt']],            
        });
        const createdAtList = createdAtObj.map((item: any) => item.createdAt);
        const distinctCreatedAt = createdAtList.filter((item: any,index: any,arr: any) => {
            return arr.indexOf(item) === index;
            });
        let list_total_date: any = [];
        let listDays: any = [];
        for (let index = 0; index < distinctCreatedAt.length; index++) {
            list_total_date = await db.Transaction.findAll({
                attributes: [[sequelize.fn('sum', sequelize.col('price')), 'total_amount'],['createdAt','date']],
                where :
                {
                    SellerId : seller.id,
                    createdAt:{
                        [sequelize.Op.between] : [`${distinctCreatedAt[index]} 00:00:00`,`${distinctCreatedAt[index]} 23:59:00`]
                    }
                },
                raw: true,
            });
            console.log(list_total_date);
            listDays = [...listDays,{
                total_amount:list_total_date[0].total_amount,
                date:list_total_date[0].date,
                seller_id: seller.id,
                seller_name: seller.name
            }]
            
        }
        return res.status(200).json({
            data: {
                days: 
                [
                    ...listDays
                ]
            }
        })
    } catch (err) {
        next(err);
    }
}

const AddSeller = async(req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    try {
        const seller = await db.Seller.build({
            name,
            password,
            email
        });
        seller.save();
        return res.status(200).json({message:"data inserted"})
    } catch (err) {
        next(err);
    }
}

export default {
    AddSeller,
    getSummaryTransaction
};