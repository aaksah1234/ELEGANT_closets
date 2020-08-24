const express=require('express');
const shopRouter=express.Router();
const conn=require('../config/connection');
let authenticate=require('../authenticate');

module.exports=shopRouter;


// get all accessories
shopRouter.get('/',(req,res,next)=>{
    conn.query('SELECT * FROM item',function(err,items){
        if(err){
            next(err);
        }
        else{
            res.render('shop/shop',{items:items});
        }
    });
});


//see individual item
shopRouter.get('/buy/:item_id',(req,res,next)=>{
    conn.query('SELECT * FROM item WHERE id=?',[req.params.item_id],(err,result)=>{
        if(err){
            next(err);
        }
        else{
            //console.log(result);
            res.render('shop/item',{item:result[0]});
        }
    });
});

//buy individual item
shopRouter.post('/buy',authenticate,(req,res,next)=>{
    conn.query('SELECT * FROM item WHERE id=?',[req.body.item_id],(err,result)=>{
        if(err){
            next(err);
        }
        else if(result[0].avail_quantity<req.body.quan){
            res.status(403).send('available quantity is less than demanded !!!');
        }
        else{
            conn.query('UPDATE item SET avail_quantity = ? WHERE id=?',[(result[0].avail_quantity-req.body.quan),req.body.item_id],(err,result1)=>{
                if(err){
                    next(err);
                }
                else{
                    var products=[];
                    products.push({item:result[0],quan:req.body.quan});
                    //render bill with item details & price from req.body
                    res.render('shop/bill',{items:products,tot:((req.body.quan)*(result[0].price))});
                    //res.status(200).send('user bought & available quantity decreased by 1 !!');
                }
            });
        }
    });
});

//see cart
shopRouter.get('/cart',authenticate,async(req,res,next)=>{
    var products=[];
    try{
        let result= await conn.query('SELECT * FROM cart WHERE user_id=?',[req.user.id]);
        result.forEach(async(element)=>{
            let result1 =await conn.query('SELECT * FROM item WHERE id=?',[element.item_id]);
            products.push({item:result1[0],quan:element.quantity});          
        });
        res.render('shop/cart',{items:products,name:req.user.name.split(' ')[0].toUpperCase()});       
    }
    catch(err){
        throw err;
    }
});
        

//add to cart
shopRouter.post('/cart',authenticate,(req,res,next)=>{
    
    conn.query('SELECT avail_quantity FROM item WHERE id=?',[req.body.item_id],(err,result)=>{
        if(err){
            next(err);
        }
        else if(result.avail_quantity<req.body.quan){
            res.status(403).send('available quantity is less than demanded !!!');
        }
        else{
                conn.query('INSERT INTO cart (user_id,item_id,quantity) VALUES (?,?,?)',[req.user.id,req.body.item_id,req.body.quan],(err,result1)=>{
                    if(err){
                        next(err);
                    }
                    else{
                        conn.query('SELECT * FROM cart WHERE id=?',[result1.insertId],(err,row)=>{
                            if(err)next(err);
                            res.status(201).send({cartItem:row});
                        });
                    }
                }); 
        }
    });
});


//delete from cart
shopRouter.delete('/cart/:item_id',authenticate,(req,res,next)=>{
    conn.query('DELETE FROM cart WHERE user_id = ? AND item_id = ?',[req.user.id,req.params.item_id],function(err,result){
        if(err){
            next(err);
        }
        else{
            res.status(204).send('deleted item from cart !!!');
        }
    });
});


//buy complete cart
shopRouter.post('/cart/buy',authenticate,(req,res,next)=>{
    let sum=0;
    conn.query('SELECT * FROM cart WHERE user_id = ?',[req.user.id],function(err,result){
        if(err){
            next(err);
        }
        else if(!result.length()){
            res.status(404).send('nothing in cart !!!');
        }
        else{
            var products=[];
            result.forEach(element => {
                conn.query('SELECT * FROM item WHERE id = ?',[element.item_id],function(err1,result1){
                    if(err1){
                        next(err);
                    }
                    else{
                        sum+=((result1.price)*(element.quantity));
                        products.push({item:result1,quan:element.quantity});
                        conn.query('UPDATE item SET avail_quantity = ?',[pres_quan-element.quantity],function(err,result2){
                            if(err){
                                    next(err);
                            }
                        });
                    
                    }
                });        
            });
            //res.render('shop/bill',{items:products,tot:sum});
            setTimeout(()=>{
                res.status(200).send('cart items summed up & each item\'s available quantity is updated!!!');
            },0);
            
        }
    });
});
