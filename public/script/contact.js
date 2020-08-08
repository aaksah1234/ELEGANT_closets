        const arr=[];
        var contact=document.getElementById('contact');
        contact.addEventListener('',function(event){
            let index=Math.floor(Math.random()*5);;
            setTimeout(()=>{
                console.log(index);
                contact.style.backgroundImage='url(${arr[index]})';  
            },1000);
            
        })
    
        // Initialize and add the map
        function initMap() {
          // The location of Uluru
          var uluru = {lat: -27.460435, lng: 153.02009};
          // The map, centered at Uluru
          var map = new google.maps.Map(
              document.getElementById('map'), {zoom: 4, center: uluru});
          // The marker, positioned at Uluru
          var marker = new google.maps.Marker({position: uluru, map: map});
        }
        