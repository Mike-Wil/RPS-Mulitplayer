    var trainName = 'b'
       var destination = 'b'
       var firstTime = '17:15'
       var frequency = '10'
    //    console.log("firstTime = " + firstTime);
    //    // Format firstTime
    //    // var formatTime = moment.unix(firstTime).format("HH:mm");
    //    // console.log("formatTime = " + formatTime);
    //    // Format frequency to minutes
    //    var freqMin = parseInt(frequency);
    //    console.log("frequency = " + frequency);
    //    // Calculate next arrival
    //    var nextArrival = moment(firstTime, 'HH:mm').add(frequency, 'm').format("HH:mm");
    //    console.log("nextArrival = " + nextArrival);
    //    // Calculate minutes away
    //    var currentTime = moment().format('HH:mm');
    //    console.log(currentTime);
    //    var minutesDiff = moment(currentTime, 'HH:mm').diff(nextArrival, 'minutes');
    //    console.log(minutesDiff);
    //    var minutesAway = minutesDiff.asMinutes();
    //    console.log(minutesAway);
    //    console.log(moment().format('HH:mm'));
    //    // Append to the table
       
       // parse time using 24-hour clock and use UTC to prevent DST issues

       var currDate = moment.utc().format('MM/DD/YYYY');

    //    var start = moment.utc(firstTime, "HH:mm");
var end = moment.utc(currDate + ' 17:25').format("MM/DD/YYYY HH:mm");

// account for crossing over to midnight the next day
//if (end.isBefore(start)) end.add(1, 'day');

// calculate the duration
var d = moment.duration(moment(end).diff(moment()));
console.log(d);
console.log(d.asMinutes());
// subtract the lunch break
//d.subtract(30, 'minutes');

// format a string result
// var s = moment.utc(+d).format('H:mm');
// console.log(s);
       
       
    //    $("#trainTable").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");