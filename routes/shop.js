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
            if(req.user){
                conn.query('SELECT COUNT(*) AS count FROM cart WHERE user_id=?',[req.user.id],function(err,result){
                    if(err){
                        next(err);
                    }
                    else{
                        res.render('shop/shop',{items:items,count:result[0].count});
                    }
                });
            }
            else{
                res.render('shop/shop',{items:items,count:0});
            }
           
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
            res.render('shop/item',{item:result[0],message:req.flash('error')});
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
             req.flash('error','available quantity less than demanded !!!');
             res.redirect(`/shop/buy/${req.body.item_id}`);
            //res.status(403).send('available quantity less than demanded !!!');
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
    var products=[],tot=0;
       conn.query('SELECT * FROM cart WHERE user_id=?',[req.user.id],function(err,result){
           if(err){
               next(err);
           }
           result.forEach((element)=>{
               conn.query('SELECT * FROM item WHERE id=?',[element.item_id],function(err1,result1){
                   if(err1){
                       next(err1);
                   }
                   tot=tot+((result1[0].price)*(element.quantity));
                   products.push({item:result1[0],quan:element.quantity});
               });
           });
       });

       setTimeout(()=>{
        res.render('shop/cart',{items:products,name:req.user.name.split(' ')[0].toUpperCase(),message:req.flash('message'),tot:tot}); 
       },1000);
});
      

//add to cart
shopRouter.post('/cart',authenticate,(req,res,next)=>{
    
    conn.query('SELECT avail_quantity FROM item WHERE id=?',[req.body.item_id],(err,result)=>{
        if(err){
            next(err);
        }
        else if(result[0].avail_quantity<req.body.quan){
            req.flash('error','available quantity less than demanded !!!');
            res.redirect(`/shop/buy/${req.body.item_id}`);
           // res.status(403).send('available quantity is less than demanded !!!');
        }
        else{
                conn.query('SELECT * FROM cart WHERE item_id=?',[req.body.item_id],function(err2,result2){
                    if(err2){
                        next(err2);
                    }
                    else{
                        if(result2.length==0){
                            conn.query('INSERT INTO cart (user_id,item_id,quantity) VALUES (?,?,?)',[req.user.id,req.body.item_id,req.body.quan],(err,result1)=>{
                                if(err){
                                    next(err);
                                }
                                else{
                                    // conn.query('SELECT * FROM cart WHERE id=?',[result1.insertId],(err,row)=>{
                                    //     if(err)next(err);
                                    //     res.status(201).send({cartItem:row});
                                    // });
                                    res.redirect('/shop/cart');
                                }
                            }); 
                        }
                        else{
                            conn.query('SELECT quantity FROM cart WHERE item_id=?',[req.body.item_id],function(err3,result3){
                                if(err3){
                                    next(err3);
                                }
                                else{
                                    conn.query('UPDATE cart SET quantity=? WHERE item_id=?',[(result3[0].quantity+parseInt(req.body.quan)),req.body.item_id],function(err4,result4){
                                        if(err4){
                                            next(err4);
                                        }
                                        else{
                                            // conn.query('SELECT * FROM cart WHERE item_id=?',[req.body.item_id],(err5,row)=>{
                                            //     if(err5)next(err5);
                                            //     res.status(200).send({cartItem:row});
                                            // });
                                            res.redirect('/shop/cart');
                                        }
                                    });
                                }
                            });
                        }
                    }
                });        
        }
    });
});


//delete from cart
shopRouter.get('/cart/:item_id',authenticate,(req,res,next)=>{
    conn.query('DELETE FROM cart WHERE user_id = ? AND item_id = ?',[req.user.id,req.params.item_id],function(err,result){
        if(err){
            next(err);
        }
        else{
            res.redirect('/shop/cart');
            /* give alert */
            //res.status(200).send('deleted item from cart !!!');
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
        else if(!result.length){
            req.flash('message','nothing in cart !!!');
            res.redirect('/shop/cart');
           // res.status(404).send('nothing in cart !!!');
        }
        else{
            var products=[];
            result.forEach(element => {
                conn.query('SELECT * FROM item WHERE id = ?',[element.item_id],function(err1,result1){
                    if(err1){
                        next(err);
                    }
                    else{
                        sum+=((result1[0].price)*(element.quantity));
                        products.push({item:result1[0],quan:element.quantity});
                        conn.query('UPDATE item SET avail_quantity = ? WHERE id=?',[(result1[0].avail_quantity-element.quantity),element.item_id],function(err,result2){
                            if(err){
                                    next(err);
                            }
                        });
                    
                    }
                });        
            });

            conn.query('DELETE FROM cart',function(err,result){
                if(err){
                    next(err);
                }
               // console.log("cart emptied !!!");
            });
            
            setTimeout(()=>{
                // res.status(200).send('cart items summed up & each item\'s available quantity is updated!!!');
                res.render('shop/bill',{items:products,tot:sum});
            },1000);
            
        }
    });
});
