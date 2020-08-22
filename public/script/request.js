var submit = document.getElementById('submit');
var quan= document.getElementById('quan');

const putRequest = ()=>{
    console.log('yess reached here !!!');
    let url="/";
    let data = JSON.stringify({quan:quan.value});
    try{
        const response = await fetch(url,{
            method:"PUT",
            body:data,
            header:{
                'Content-Type':'application/json'
            }
        });
        if(response.ok){
            const jsonResponse=response.json();
            document.write(jsonResponse);
        } 
    }
     catch(err){
         throw err;
     }
};

submit.addEventListener('click',function(event){
    putRequest();
});