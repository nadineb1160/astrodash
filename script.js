// Once document is loaded
var resp = "";
var bday, astrosign, czodiac, keyword, sentiment;

$(document).ready(function () {
  var horoscope = "cancer";

  var tsign = "";

  // Variables for API search
  var compatibility, mood, color, lucky_num, lucky_time;

  var month, day, year, date;

  $("#bday-submit").on("click", function (event) {
    event.preventDefault();

    month = $("#bday-month").val();
    day = $("#bday-day").val();
    year = $("#bday-year").val();

    date = year + "-" + month + "-" + day;

    bday = moment(date, "YYYY-MM-DD", true);

    if (!bday.isValid()) {
      alert("Date entered is not valid!");
    }

    console.log("bday = " + bday);

    // Get Western Zodiac
    astrosign = getZodiac(bday);
    console.log("astrosign=" + astrosign);

    // Get Chinese Zodiac
    czodiac = chineseZodiac(bday);
    console.log("czodiac=" + czodiac);

    getHoroscope(astrosign, getDataBoth);
    // resp now contains the horoscope
    // keyword now has the keyword from horoscope
    // sentiment now has sentiment from horoscope
    //

    $("#horoscopeName").text("Astrological sign " + astrosign);
    $("#and").attr("style", "display: block");
    $("#zodiacName").text("Year of the " + czodiac);

    timerSet(date);
    console.log(resp);
    horoscopeSet(resp);

    getGiphyImages(czodiac);
    getQuotes(keyword);

  });

  function getZodiac(indate) {
    var tdate = moment(indate); // any date will be converted

    console.log(tdate.calendar())
    // console.log(tdate);
    var day = tdate.date();
    var month = tdate.month() + 1;

    console.log(month + " // " + day)

    // Capricorn - Dec 22 - Jan 19
    if (
      (month == 12 && day >= 22) ||
      (month == 1 && day <= 19)
    ) {
      return "Capricorn";
    }
    // Aquarius - Jan 20 - Feb 18
    else if (
      (month == 1 && day >= 20) ||
      (month == 2 && day <= 18)
    ) {
      return "Aquarius";
    }
    // Pisces - Feb 19 - March 20
    else if (
      (month == 2 && day >= 19) ||
      (month == 3 && day <= 20)
    ) {
      return "Pisces";
    }
    // Aries - March 21 - April 19
    else if (
      (month == 3 && day >= 21) ||
      (month == 4 && day <= 19)
    ) {
      return "Aries";
    }
    // Taurus - April 20 - May 20
    else if (
      (month == 4 && day >= 20) ||
      (month == 5 && day <= 20)
    ) {
      return "Taurus";
    }
    // Gemini - May 21 - June 20
    else if (
      (month == 5 && day >= 21) ||
      (month == 6 && day <= 20)
    ) {
      return "Gemini";
    }
    // Cancer - June 21 - July 22
    else if (
      (month == 6 && day >= 21) ||
      (month == 7 && day <= 22)
    ) {
      return "Cancer";
    }
    // Leo - July 23 - Aug 22
    else if (
      (month == 7 && day >= 23) ||
      (month == 8 && day <= 22)
    ) {
      return "Leo";
    }
    // Virgo - Aug 23 - Sept 22
    else if (
      (month == 8 && day >= 23) ||
      (month == 9 && day <= 22)
    ) {
      return "Virgo";
    }
    // Libra - Sept 23 - Oct 22
    else if (
      (month == 9 && day >= 23) ||
      (month == 10 && day <= 22)
    ) {
      return "Libra";
    }
    // Scorpio - October 23 - November 21
    else if (
      (month == 10 && day >= 23) ||
      (month == 11 && day <= 21)
    ) {
      return "Scorpio";
    }
    // Sagittarius - November 22 - December 21
    else if (
      (month == 11 && day >= 22) ||
      (month == 12 && day <= 21)
    ) {
      return "Sagittarius";
    }
  }

  function chineseZodiac(indate) {
    // using moment.js and moment-lunar.js

    var zodiacTable = [
      "Monkey",
      "Rooster",
      "Dog",
      "Pig",
      "Rat",
      "Ox",
      "Tiger",
      "Rabbit",
      "Dragon",
      "Snake",
      "Horse",
      "Goat"
    ];

    //convert date into lunar date
    var tlunar2 = moment(indate)
      .lunar()
      .format("YYYY-MM-DD");

    console.log("Test " + indate + " into lunar is " + tlunar2);

    var tlunarYear = moment(tlunar2).year();

    tsign = zodiacTable[tlunarYear % 12];

    console.log("tsign = " + tsign);

    return tsign;

    // 1924 = Rat
    // 1920 % 12 = 0
  }

  // callback function for horoscope call
  function getDataBoth() {
    keyword = getKeyword();
    sentiment = getSentiment();
  }

  function getSentiment() {
    console.log("resp2 = " + resp);
    token = "8921d8d3e0274f0997aa91de967aca75";

    queryURL3 =
      "https://api.dandelion.eu/datatxt/sent/v1/?text=" +
      encodeURI(resp) +
      "&token=" +
      token;
    console.log(queryURL3);
    $.ajax({
      type: "POST",
      url: queryURL3,
      dataType: "json"
    }).then(function (response) {
      //   console.log(response);
      console.log(response.sentiment.type);
      return response.sentiment.type;
    });
  }

  function getKeyword(options, callback) {
    console.log("resp2 = " + resp);
    token = "8921d8d3e0274f0997aa91de967aca75";

    queryURL2 =
      "https://api.dandelion.eu/datatxt/nex/v1/?text=" +
      encodeURI(resp) +
      "&min_confidence=0.5" +
      // "&top_entities=1"+
      "&token=" +
      token;

    console.log(queryURL2);
    $.ajax({
      type: "POST",
      url: queryURL2,
      dataType: "json"
    }).then(function (response) {
      //   console.log(response);
      // console.log(reponse.description);
      var arr = response.annotations;
      // sample reply  arr[x]   (useful spot,title, label)
      // start: 191
      // end: 196
      // spot: "happy"
      // confidence: 0.5371
      // id: 169409
      // title: "Happiness"
      // uri: "http://en.wikipedia.org/wiki/Happiness"
      // label: "Happiness"

      //  concat version
      //concat = ""
      // for (var i=0; i<arr.length;i++) {
      //     concat = concat + arr[i].label
      // }
      // random version
      var rand = Math.floor(Math.random() * arr.length);
      console.log(arr[rand].label);
      return arr[rand].label;
      // callback();
    });
  }

  function getHoroscope(horoscope, callback) {
    // var queryURL = "https://ohmanda.com/api/horoscope/" + horoscope + "/";

    // var queryURL = "https://cors-anywhere.herokuapp.com/https://sandipbgt.com/theastrologer/api/horoscope/"+horoscope+"/today/"
    // var res;

    var sign = horoscope.toLowerCase();
    var queryURL = "https://aztro.sameerkumar.website?sign=" + sign + "&day=today";

    $.ajax({
      type: "POST",
      url: queryURL,
      dataType: "json"
    }).then(function (response) {
      // options = response.description;
      resp = response.description;
      console.log(resp);
      console.log(response);
      // console.log(response.description);
      // console.log("options="+options)
      // console.log("resp="+resp)

      compatibility = response.compatibility;
      mood = response.mood;
      color = response.color;
      lucky_num = response.lucky_number;
      lucky_time = response.lucky_time;


      callback();
    });
  }

  // Set horoscope API info
  function horoscopeSet(resp) {
    console.log("resp=" + resp);
    $("#horoscope1").text(resp);
  }

  // Date had format YYYY-MM-DD
  function timerSet(date) {

    // Get current day
    var currentDay = moment().format("YYYY-MM-DD");
    console.log(currentDay);

    currentDay = currentDay.split("-");
    console.log("Current Day: ")
    console.log(currentDay);
    var yearCurrent = currentDay[0];
    var monthCurrent = currentDay[1];
    var dayCurrent = currentDay[2];

    // split data to change date
    date = date.split("-");
    var yearBday = date[0];
    var monthBday = date[1];
    var dayBday = date[2];

    var yearNextBday;

    // Bday month has not occured this year
    if (monthBday > monthCurrent) {
      yearNextBday = yearCurrent;
    }

    // Currently in bday month
    else if (monthBday === monthCurrent) {

      // Bday coming this month
      if (dayBday > dayCurrent) {
        yearNextBday = yearCurrent;
      }
      // Bday has occured this year or is today
      else {
        // Bday today
        if (dayBday === dayCurrent) {
          console.log("It's your bday");
          // alert it's your bday
        }
        // Countdown till next
        yearNextBday = parseInt(yearCurrent) + 1;
      }

    }

    // Bday month has already passed
    else {
      yearNextBday = parseInt(yearCurrent) + 1;
    }

    // Change bday year to next bday year
    date = yearNextBday + "-" + monthBday + "-" + dayBday;

    // console.log(date);

    date += "T00:00:00+00:00";
    console.log(date);
    $("#bday-countdown").attr("uk-countdown", "date: " + date);
    $("#bday-countdown").attr("style", "display:block");

  }

  // call it with the sign
  // getHoroscope(inSign,getDataBoth);
  // getDataBoth is callback that calls both keyword and sentiment 

  //test Chinese Zodiac, should work with ANY date (even in the future)
  //  chineseZodiac("1970-01-01");

  //test regular Zodiac, should work with any date 
  // console.log(getZodiac("1970-01-01"));
  // console.log(chineseZodiac("1970-01-01"));

  // var zodiac = chineseZodiac("1970-01-01");

  function getGiphyImages(zodiac) {

    // Add image

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + zodiac + "&limit=1&api_key=wslWpWhssAgYDK6zVXacBDsacT47flr4";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      var gifs = response.data
      console.log(gifs[0].images.original.url);

    });

  }

});
