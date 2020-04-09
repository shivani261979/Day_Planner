    // moment().toString();      //  returns   'Wed Apr 08 2020 22:35:57 GMT-0400'
    //  moment().toDate()     // returns   'Wed Apr 08 2020 22:35:57 GMT-0400 (Eastern Daylight Time)'
//    var curDate = moment().format("MMMM YYYY")

const desiredDateFormat = "dddd, MMM DD YYYY";

var showingDate;



$( document ).ready(function() {
    startApp();
});

function startApp(){

    var todaysDate = moment().format("dddd, MMM DD YYYY")

    updateUiForDate(todaysDate);

}

function updateUiForDate(desiredDate){

    showingDate = desiredDate;
    
    $('#showingDate').text(showingDate);

    populatePlanner();

    updateColorCodingOfCalendarRow();
}

function updateColorCodingOfCalendarRow(){

    var pageDate = moment(showingDate, desiredDateFormat);
    var todaysDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0); // to compare midnight with midnight 

    var allEventsForCurDate = $('.event');

    console.log("todaysDate: " + todaysDate + " \n  pageDate: " + pageDate + "\n");

    if ( todaysDate > pageDate ){         // color code them all past date

        console.log("--------  color code as past events   -------- ")

        for(var x=0; x < allEventsForCurDate.length; x++){

            var ele = allEventsForCurDate[x];

            $(ele).addClass('pastEvent').removeClass('currentEvent').removeClass('futureEvent');

        }

    }  else if(todaysDate < pageDate) {              
        console.log("--------  color code as future events   -------- ")

        for(var x=0; x < allEventsForCurDate.length; x++){
            
            var ele = allEventsForCurDate[x];

            $(ele).addClass('futureEvent').removeClass('currentEvent').removeClass('pastEvent');
        }
    }
    else{
                    // get hour
        var curHour = moment().format('HH');

        console.log("current hour - " + curHour);

        for(var x=0; x < allEventsForCurDate.length; x++){

            var ele = allEventsForCurDate[x];

                // add 9 to x because our business hours starts at 9 am and will have index position 0 in elements array.
            if(curHour > (x + 9) ){
                // color code for past
                $(ele).addClass('pastEvent').removeClass('currentEvent').removeClass('futureEvent');
            } else if (curHour == (x+ 9) ){

                $(ele).addClass('currentEvent').removeClass('pastEvent').removeClass('futureEvent');
                // color code for active hour
            } else {

                $(ele).addClass('futureEvent').removeClass('currentEvent').removeClass('pastEvent');
                // color code for future
            }

        }

    }

    
}

function populatePlanner(){

    var allEventsForCurDate = $('.event');

    console.log("populatePlanner will use storage: ", localStorage);

    for( var x=0; x < allEventsForCurDate.length; x++){

        var ele = allEventsForCurDate[x];

        var classnames = $(ele).attr("class").split(' ');
        var key = getKey(showingDate, classnames[0]);
        var val = localStorage.getItem(key);

        console.log("key : " + key + ",   holds value: " + val + " classnames[0]: " + classnames[0]);
        var taId = getIdForTextareaForButtonWithClass(classnames[0]);
        $(taId).text(val);
    }
}

function saveEvent(ele){

    console.log('button clicked: ' + ele);
    var classnames = $(ele).attr("class").split(' ');
    console.log("clicked button has classes : ", classnames);

    var match = getIdForTextareaForButtonWithClass(classnames[0]);
    var eventDesc = $(match).val(); // fetch value from textarea

    if(eventDesc){
        var key = getKey(showingDate, classnames[0]);
        localStorage.setItem(key, eventDesc);
        showMessage("Event was successfully created.", 1500);
    } else {
        showMessage("Cannot save an empty Event", 1500);
    }

}

function showPreviousDate(){
                                // pass dateString and format coz dateString is NOT in ISO format
    var previousDate = moment(showingDate, desiredDateFormat).subtract(1,'days').format(desiredDateFormat);

    updateUiForDate(previousDate);
}


function showNextDate(){
                            // pass dateString and format coz dateString is NOT in ISO format
    var nextDate = moment(showingDate, desiredDateFormat).add(1,'days').format(desiredDateFormat);

    updateUiForDate(nextDate);
}





// localStorage.clear();




/*     helper methods to get consistent values for keys     */


function getKey(inDate, slot){

    var key = inDate + "---" + slot;
    return key;
}

function getIdForTextareaForButtonWithClass(name){
    return '#' + name + "_ta";
}


function showMessage(statusMsg, delayInMs){

    $('.floating-message').html(statusMsg).fadeIn(250).delay(delayInMs).fadeOut(250);
}


