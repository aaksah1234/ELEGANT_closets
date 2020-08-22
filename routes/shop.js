const express=require('express');
const shopRouter=express.Router();
const conn=require('../config/connection');

module.exports=shopRouter;

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

shopRouter.get('/cart',(req,res,next)=>{
    conn.query('SELECT * FROM cart WHERE user_id=?',[req.user.id],(err,result)=>{
        if(err){
            next(err);
        }
        else{
            res.send({cart: result});
        }
    });
});

shopRouter.post('/cart',(req,res,next)=>{
    //var item_quan=3,item_id=1,user_id=1;
    req.user.id=3;
    conn.query('SELECT avail_quantity FROM item WHERE id=?',[req.body.item_id],(err,result)=>{
        if(err){
            next(err);
        }
        else if(result.avail_quantity<req.body.quan){
            res.status(401).send('available quantity is less than demanded !!!');
        }
        else{
                conn.query('INSERT INTO cart (user_id,item_id,quantity) VALUES ?',[req.user.id,req.body.item_id,req.body.quan],(err,result1)=>{
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

shopRouter.delete('/cart',(req,res,next)=>{
    conn.query('DELETE FROM cart WHERE user_id = ? AND item_id = ?',[req.user.id,req.body.item_id],function(err,result){
        if(err){
            next(err);
        }
        else{
            res.status(204).send('deleted item from cart !!!');
        }
    });
});

shopRouter.get('/buy/:item_id',(req,res,next)=>{
    conn.query('SELECT * FROM item WHERE id=?',[req.params.item_id],(err,result)=>{
        if(err){
            next(err);
        }
        else{
            console.log(result);
            res.render('shop/item',{item:result[0]});
        }
    });
});

shopRouter.post('/buy',(req,res,next)=>{
    conn.query('SELECT avail_quantity FROM item WHERE id=?',[req.body.item_id],(err,result)=>{
        if(err){

            next(err);
        }
        else{
            conn.query('UPDATE item SET avail_quantity = ? WHERE id=?',[(result[0].avail_quantity-req.body.quan),req.body.item_id],(err,result1)=>{
                if(err){
                    next(err);
                }
                else{
                    //render bill with item details & price from req.body
                    res.status(200).send('user bought & available quantity decreased by 1 !!');
                }
            });
        }
    });
});

shopRouter.put('/cart/buy',(req,res,next)=>{
    let sum=0;
    conn.query('SELECT * FROM cart WHERE user_id = ?',[req.user.id],function(err,result){
        if(err){
            next(err);
        }
        else if(!result.length()){
            res.status(404).send('nothing in cart !!!');
        }
        else{
            result.forEach(element => {
                conn.query('SELECT * FROM item WHERE id = ?',[element.item_id],function(err1,result1){
                    if(err1){
                        next(err);
                    }
                    else{
                        var pres_quan=result1.avail_quantity;
                        if(element.quantity>pres_quantity){
                            res.status(403).send('demanded quantity is greater than available !!!');
                        }
                        else{
                            sum+=result1.price;
                            conn.query('UPDATE item SET avail_quantity = ?',[pres_quan-element.quantity],function(err,result2){
                                if(err){
                                    next(err);
                                }
                                else{
                                    //bill with total amount of cart.
                                    res.status(200).send('cart items summed up & each item\'s available quantity is updated!!!');
                                }
                            });
                        }
                    }
                });    
                
            });

        }
    });
});
