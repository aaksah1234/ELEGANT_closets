var events;

fetch('/book/getEvents')
.then((resp) => resp.json()) // Transform the data into json
.then(function (data) {
  events = function () {
    return data;
  }
            $(function() {
              //loadEvents();
              showTodaysDate();
              initializeCalendar();
              getCalendars();
              initializeRightCalendar();
              initializeLeftCalendar();
              disableEnter();
            });
  });

/* --------------------------initialize calendar-------------------------- */
var initializeCalendar = function() {
  $('.calendar').fullCalendar({
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      // create events
      events: events(),
      defaultTimedEventDuration: '01:00:00',
      forceEventDuration: true,
      eventBackgroundColor: '#008080',
      editable: false,
      height: screen.height - 160,
      timezone: 'India/Kolkata',
    });
}

/*--------------------------calendar variables--------------------------*/
var getCalendars = function() {
  $cal = $('.calendar');
  $cal1 = $('#calendar1');
  $cal2 = $('#calendar2');
}

/* -------------------manage cal2 (right pane)------------------- */
var initializeRightCalendar = function()  {
  $cal2.fullCalendar('changeView', 'agendaDay');

  $cal2.fullCalendar('option', {
    slotEventOverlap: false,
    allDaySlot: false,
    header: {
      right: 'prev,next today'
    },
    selectable: true,
    selectHelper: true,
    select: function(start, end) {
        newEvent(start);
    },
    eventClick: function(calEvent, jsEvent, view) {
        editEvent(calEvent);
    },
  });
}

/* -------------------manage cal1 (left pane)------------------- */
var initializeLeftCalendar = function() {
  $cal1.fullCalendar('option', {
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek'
      },
      navLinks: false,
      dayClick: function(date) {
          cal2GoTo(date);
      },
      eventClick: function(calEvent) {
          cal2GoTo(calEvent.start);
      }
  });
}

/* -------------------moves right pane to date------------------- */
var cal2GoTo = function(date) {
  $cal2.fullCalendar('gotoDate', date);
}


// var loadEvents = function() {
//   $.getScript("/script/events.js", function(){
//   });
// }

var newEvent = function(start) {
  $('select#title').val("");
  $('#newEvent').modal('show');
  $('#submit').unbind();
  $('#submit').on('click', function() {
  var title = $('select#title').val();
  if (title) {
    var eventData = {
        title: title,
        start: start
    };

    var currdate=new Date();

    if(start<currdate){
      alert("Select date on or after current date !!!");
      $('#newEvent').modal('hide');
    }
    else{
      fetch('/book/newMeet',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({datetime : start , category : title})
      })
      .then((response)=>{
        if(response.ok){
            $cal.fullCalendar('renderEvent', eventData, true);
            $('#newEvent').modal('hide');
        }
        // else{
        //   throw new Error("Request Failed !!!");
        // }
      },error=>{
        console.log(error.message);
      })
      }
    }
  
  else {
    alert("Title can't be blank. Please try again.")
  }
  });
}

//edit meeting

var editEvent = function(calEvent) {
  console.log(calEvent);
  $('select#editTitle').val(calEvent.title);
  $('#editEvent').modal('show');


  //edit event
  $('#update').unbind();
  $('#update').on('click', function() {
    fetch(`/book/getmeeter/${calEvent.id}`)
    //.then((resp) => resp.json()) // Transform the data into json
    .then(function (response) {
          if(response.ok){
                var title = $('select#editTitle').val();
                $('#editEvent').modal('hide');
                if (title) {
                  calEvent.title = title;
                  console.log(calEvent);
                } else {
                alert("Title can't be blank. Please try again.")
                }
                fetch('/book/updateMeet',{
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: JSON.stringify({meetId:calEvent.id , title:calEvent.title})
                })
                .then((response)=>{
                  if(response.ok){
                      $cal.fullCalendar('updateEvent', calEvent);
                      $cal.fullCalendar('renderEvent', eventData, true);
                      $('#newEvent').modal('hide');
                  }
                  // else{
                  //   throw new Error("Request Failed !!!");
                  // }
                },error=>{
                  console.log(error.message);
                })


          }
          else{
            alert('You can update only your own data!!!');
            $('#editEvent').modal('hide');
          }
      });
  });


  //delete meeting
  $('#delete').on('click', function() {
    $('#delete').unbind();
    if (calEvent._id.includes("_fc")){
      $cal1.fullCalendar('removeEvents', [getCal1Id(calEvent._id)]);
      $cal2.fullCalendar('removeEvents', [calEvent._id]);
    } else {
      $cal.fullCalendar('removeEvents', [calEvent._id]);
    }
    $('#editEvent').modal('hide');
  });
}

/* --------------------------load date in navbar-------------------------- */
var showTodaysDate = function() {
  n =  new Date();
  y = n.getFullYear();
  m = n.getMonth() + 1;
  d = n.getDate();
  $("#todaysDate").html("Today is " + m + "/" + d + "/" + y);
};

/* full calendar gives newly created given different ids in month/week view
    and day view. create/edit event in day (right) view, so correct for
    id change to update in month/week (left)
  */
var getCal1Id = function(cal2Id) {
  var num = cal2Id.replace('_fc', '') - 1;
  var id = "_fc" + num;
  return id;
}

var disableEnter = function() {
  $('body').bind("keypress", function(e) {
      if (e.keyCode == 13) {
          e.preventDefault();
          return false;
      }
  });
}
