require('dotenv').config();
import express ,{ Request,Response,NextFunction }  from 'express';
import db from './models';
import bodyParser from 'body-parser';
import cors from 'cors';
import sellerRoutes from './routes/sellerRoutes';
import transactionRoutes from './routes/transactionRoutes';

const port = process.env.PORT || 3000
const app = express();

/*const allowedOrigins = ['http://localhost:9090','http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};
*/ 
//app.use(cors(options));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/sellers',sellerRoutes);
app.use('/transactions',transactionRoutes);

app.use((error: TypeError, req: Request, res: Response, next: NextFunction) => {
    return res.json({
      error : {
        message : error.message,
      }
    });
  });

db.sequelize.sync().then(() => {
    app.listen(port,() => {
        console.log(`server runnin on ${port}`);
    })
});