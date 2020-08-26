const express=require('express');
const cartRouter=express.Router();
const conn=require('../config/connection');
const authenticate=require('../authenticate');
const util=require('util');


module.exports=cartRouter;

const query = util.promisify(conn.query).bind(conn);

//see cart
cartRouter.get('/',authenticate,async(req,res,next)=>{
    var products=[];
    try{
        let result= await query('SELECT * FROM cart WHERE user_id=?',[req.user.id]);
        console.log(result);
        for(var i=0;i<result.length;i++){
            (async(element)=>{
                try{
                    let result1 =await query('SELECT * FROM item WHERE id=?',[element.item_id]);
                    console.log(result1);
                    products.push({item:result1[0],quan:element.quantity});   
                }
                catch(err){
                    next(err);
                }
            })(i);
        }
        
        // result.forEach(async(element)=>{
        //     let result1 =await query('SELECT * FROM item WHERE id=?',[element.item_id]);
        //     console.log(result1);
        //     products.push({item:result1[0],quan:element.quantity});          
        // });
        console.log(products);
        res.render('shop/cart',{items:products,name:req.user.name.split(' ')[0].toUpperCase()});       
    }
    catch(err){
       next(err);
    }
});
