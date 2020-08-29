# ELEGANT_closets


A full stack website for interior design/ architecture firm.

The website is developed using Nodejs, Express & MySQL.


For deployed version :  visit   


This website incorporates :
- A complete portfolio of the firm including overview of the firm & the projects accomplished in 3 categories served viz. Residential, Workspace & Interior Design.

- It allows users to purchase accessories & upholstery from the available stock of the firm, filtered on price range.

- It allows users to book consultation meetings for residential,workspace & interior designs via a calender UI that shows users all the available slots on current date & marks the booked events with blue tags on respective tags
    (Integration with google calender is under work.)

- A proficiently working user authentication system, made using passport.js local strategy.
    (Use of jwt is under work).

- It also allows users to send message (emails) from the website itself to the firm.




## Accessories & Upholstery Purchase

1. User can see the price, color, available quantity & image of all items sold by the firm.
2. User can filter the search using price range. (backend functioning is under work)
3. Users can add items to cart, buy individual items, buy complete cart.
4. Users are provided with bill with all required info about items purchased.


## Consultation meetings

-  User can book consultation meetings for all 3 specified categories.

### Usage


- To create a new appointment

1. Click on a day within the month or week view calendar on the left pane.
2. The day will load in the right day agenda view on the right.
3. Within the right day agenda, click on any 1 hour time slot to create an appointment.
4. Input the appointment title and then click create.


- View or delete an existing appointment

1. Click on day of existing appointment within the month or week view calendar on the left pane. Or navigate to day within day view.
2. The day of the appointment will load on the right day view.
3. Click on the appointment you want to delete.
4. A modal will appear. You can delete the event.






