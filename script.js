// Photos for Horoscope
var horoscopePic = {
  CapricornIcon: "https://cdn.pixabay.com/photo/2017/07/29/18/41/capricorn-2552366__340.png",
  AquariusIcon: "https://cdn.pixabay.com/photo/2017/07/29/13/24/aquarius-2551502__340.png",
  PiscesIcon: "https://cdn.pixabay.com/photo/2017/07/29/15/56/pisces-2551918__340.png",
  AriesIcon: "https://cdn.pixabay.com/photo/2017/07/28/22/02/aries-2549974__340.png",
  TaurusIcon: "https://cdn.pixabay.com/photo/2017/07/28/22/46/taurus-2550112__340.png",
  GeminiIcon: "https://cdn.pixabay.com/photo/2017/07/28/23/22/gemini-2550197__340.png",
  CancerIcon: "https://cdn.pixabay.com/photo/2017/07/29/13/07/cancer-2551431__340.png",
  LeoIcon: "https://cdn.pixabay.com/photo/2017/07/29/12/19/leo-2551352__340.png",
  VirgoIcon: "https://cdn.pixabay.com/photo/2017/07/29/18/09/virgo-2552259_960_720.png",
  LibraIcon: "https://cdn.pixabay.com/photo/2017/07/29/19/42/libra-2552502__340.png",
  ScorpioIcon: "https://cdn.pixabay.com/photo/2017/07/29/16/44/scorpio-2552035__340.png",
  SagittariusIcon: "https://cdn.pixabay.com/photo/2017/07/29/12/37/sagittarius-2551400__340.png",
}

// General Images
var astroImg = "https://cdn.pixabay.com/photo/2019/04/30/01/02/vintage-4167444_960_720.png";
var moonImg = "https://cdn.pixabay.com/photo/2017/02/10/15/57/full-moon-2055469__340.jpg";
var starImg = "https://cdn.pixabay.com/photo/2018/08/08/08/37/star-card-3591581_960_720.jpg";
var vintageImg = "https://cdn.pixabay.com/photo/2018/05/17/15/24/armillar-ball-3408811__340.jpg";

var bg_bottom = "https://cdn.pixabay.com/photo/2016/07/17/16/19/stars-1524180_960_720.jpg";

var resp = "";
var bday, astrosign, czodiac;
var owmapikey = "8164cdd41308f159d85ff4ef8f3b5171"; // openweathermap.org
var breezokey = "a7204a3f724a470fb35ad085b72fdba7"; //breezometer.com
var curlat, curlon; // need it for UV, BreezoMeter, Pollen

// Once document is loaded
$(document).ready(function () {

  // Hide Data
  $("#content").hide();

  // Variable to track which horoscope we are on
  var isHoro1, isHoro2 = false;

  // Variables for Horoscope text
  var horoscope1, horoscope2;

  // Variable for sentiment
  var keyword1, sentiment1, keyword2, sentiment2;

  // Variable for birthday
  var month, day, year, date;

  // Variables for location
  var city, state;

  // Get previous data
  getPrevData();

  // Validation
  $("#form").validate({
    debug: true,
    rules: {
      bdayMonth: {
        required: "true",
        minlength: 2,
        maxlength: 2
      },
      bdayDay: {
        required: "true",
        minlength: 2,
        maxlength: 2
      },
      bdayYear: {
        required: "true",
        minlength: 4,
        maxlength: 4
      },
      city: {
        required: "true",
        minlength: 3
      },
      state: {
        required: "true",
        minlength: 3
      }

    },
    messages: {
      bdayMonth: {
        required: "Please enter a month - MM",
        minlength: "Search term must be 2 characters long"
      },
      bdayDay: {
        required: "Please enter a day - DD",
        minlength: "Search term must be 2 characters long"
      },
      bdayYear: {
        required: "Please enter a year - YYYY",
        minlength: "Search term must be 4 characters long"
      },
      city: {
        required: "Please enter a city",
        minlength: "Search term must be at least 3 characters long"
      },
      state: {
        required: "Please enter a state",
        minlength: "Search term must be at least 3 characters long"
      }
    }
  })

  // Submit Form
  $("#bday-submit").on("click", function (event) {
    if ($("#form").valid()) {
      // Prevent Default Form Behavior
      event.preventDefault();

      $("#submitted").show();

      // Get Birthday Date
      month = $("#bdayMonth").val();
      day = $("#bdayDay").val();
      year = $("#bdayYear").val();

      date = year + "-" + month + "-" + day;

      bday = moment(date, "YYYY-MM-DD", true);

      if (!bday.isValid()) {
        console.log("Date entered is not valid!");
      }

      // console.log("bday = " + bday);

      // Get Zodiac
      astrosign = getZodiac(bday);
      // console.log("astrosign= " + astrosign);

      // Get Chinese Zodiac
      czodiac = chineseZodiac(bday);
      // console.log("czodiac= " + czodiac);

      // Hide Welcome Message
      $("#welcomeMessage").hide();
      $("#click").hide();

      // Display Zodiac signs
      $("#horoscopeName").text(astrosign);
      $("#and").attr("style", "display: block");
      $("#zodiacName").text("Year of the " + czodiac);

      // Horoscope Icon
      var icon = astrosign + "Icon";
      var srcURL = horoscopePic[icon];

      $("#horoscopeImg").attr("src", srcURL);

      getHoroscope1(astrosign, getHoroscopeData1(getHoroscope2(astrosign, getHoroscopeData2)));

      // Get Horoscope 2 
      // getHoroscope2(astrosign, getHoroscopeData2);


      timerSet(date);

      // getGiphyImages(czodiac);
      // getQuotes(keyword);
      // getTidalInfo(curlat, curlon)

      // Get Location
      city = $("#city").val();
      state = $("#state").val();

      // saveNewData();

      $("#content").show();
      $("#scroll").show();

      // Get Weather
      queryCurrentWeather(city, state, getPollenBrezData);

    }
  });


  // Get Previous Bday and City
  function getPrevData() {
    getBday();
    getCity();
  }

  function getBday() {
    // Check Storage For Bday
    storedYear = localStorage.getItem("year");
    storedMonth = localStorage.getItem("month");
    storedDay = localStorage.getItem("day");

    // Stored Bday Exists
    if (storedYear, storedMonth, storedDay !== "") {
      year = storedYear;
      month = storedMonth;
      day = storedDay;
    }
  }

  function getCity() {
    // Check Storage For City
    storedCity = localStorage.getItem("city");
    storedState = localStorage.getItem("state");


    // Stored Bday Exists
    if (storedCity, storedState !== "") {
      city = storedCity;
      state = storedState;
    }
  }

  function saveNewData() {
    saveBdayData();
    saveCityData();
  }

  function saveBdayData() {
    // Saves Bday Input to LocalStorage
    localStorage.setItem("day", $("#bday-day").val());
    localStorage.setItem("month", $("#bday-month").val());
    localStorage.setItem("year", $("#bday-year").val());
  }

  function saveCityData() {
    // Saves City Input to LocalStorage
    localStorage.setItem("city", $("#city").val());
    localStorage.setItem("state", $("#state").val());
  }

  function getZodiac(indate) {
    var tdate = moment(indate); // any date will be converted

    // console.log(tdate.calendar())
    // console.log(tdate);
    var day = tdate.date();
    var month = tdate.month() + 1;

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

    // console.log("Test " + indate + " into lunar is " + tlunar2);

    var tlunarYear = moment(tlunar2).year();

    czodiac = zodiacTable[tlunarYear % 12];

    return czodiac;

    // 1924 = Rat
    // 1920 % 12 = 0
  }

  // Callback function for horoscope call
  function getHoroscopeData1(callback) {

    isHoro1 = true;
    isHoro2 = false;

    getSentiment(horoscope1);
    // console.log("sentemintent1: " + sentiment1)

    getKeyword(horoscope1);

    // getHoroscope2(astrosign, getHoroscopeData2);
    // console.log("is horoscope num 1 " + isHoro1);


  }
  // Callback function for horoscope call
  function getHoroscopeData2() {

    isHoro1 = false;
    isHoro2 = true;
    console.log("is horoscope num 1 " + isHoro1);
    console.log("is horoscope num 2" + isHoro2);

    getSentiment(horoscope2);

    getKeyword(horoscope2);

    // wordSet2(keyword2, sentiment2)
    // wordSet2(keyword2, sentiment2);
  }

  function getPollenBrezData(lat, lon) {
    getBreezometerAQI(lat, lon);
    getPollenForecast(lat, lon);
  }


  function getSentiment(horoscope) {
    token = "8921d8d3e0274f0997aa91de967aca75";

    querySentimentURL =
      "https://api.dandelion.eu/datatxt/sent/v1/?text=" +
      encodeURI(horoscope) +
      "&token=" +
      token;

    $.ajax({
      type: "POST",
      url: querySentimentURL,
      dataType: "json"
    }).then(function (response) {
      var sentiment = response.sentiment.type

      console.log("sentiment " + sentiment)
      console.log("is horoscope num 1 " + isHoro1);
      console.log("is horoscope num 2" + isHoro2);

      // Set sentiment text
      if (isHoro1) {
        console.log("sent1");
        $("#sentiment1").text(sentiment);
      }
      else if (isHoro2) {
        console.log("sent2");
        $("#sentiment2").text(sentiment);
      }
      // return sentiment
    });
  }

  function getKeyword(horoscope) {
    token = "8921d8d3e0274f0997aa91de967aca75";

    queryKeywordURL =
      "https://api.dandelion.eu/datatxt/nex/v1/?text=" +
      encodeURI(horoscope) +
      "&min_confidence=0.5" +
      // "&top_entities=1"+
      "&token=" +
      token;

    $.ajax({
      type: "POST",
      url: queryKeywordURL,
      dataType: "json"
    }).then(function (response) {

      // Array of Annotaions
      var arr = response.annotations;

      // Random Index
      var rand = Math.floor(Math.random() * arr.length);
      console.log("label", arr[rand].label);

      var keyword = arr[rand].label;

      if (isHoro1) {
        console.log("key1");
        $("#keyword1").text(keyword);
      }
      else if (isHoro2) {
        console.log("key2");
        $("#keyword2").text(keyword);

      }

      // return keyword;
      // callback();
    });
  }

  function getHoroscope1(horoscope, callback) {

    var sign = horoscope.toLowerCase();
    var queryHoro1URL = "https://aztro.sameerkumar.website?sign=" + sign + "&day=today";

    $.ajax({
      type: "POST",
      url: queryHoro1URL,
      dataType: "json"
    }).then(function (response) {

      // Horoscope 1
      horoscope1 = response.description;

      // Horoscope 1 Stats
      $("#compatibility").text(response.compatibility);
      $("#mood").text(response.mood);
      $("#color").text(response.color);
      $("#lucky_num").text(response.lucky_number);
      $("#lucky_time").text(response.lucky_time);

      // callback();
      horoscope1Set(horoscope1);

    });
  }

  // Get Horoscope 2
  function getHoroscope2(horoscope, callback) {

    var sign = horoscope.toLowerCase();

    var queryHoro2URL = "https://cors-anywhere.herokuapp.com/http://sandipbgt.com/theastrologer/api/horoscope/" + sign + "/today/";
    $.ajax({
      // headers: {
      //     "Access-Control-Allow-Origin": "*",
      //     "Content-Type": "application/json"
      //   },
      // type: 'POST',
      url: queryHoro2URL,
      method: "GET",
      dataType: "json"
    }).then(function (response) {

      horoscope2 = response.horoscope;
      $("#mood2").text(response.meta.mood);
      $("#keywordsHoro").text(response.meta.keywords);
      $("#intensity").text(response.meta.intensity);
      callback();
      // // Set Horoscope 2
      horoscope2Set(horoscope2);
    });

  }

  // Set horoscope API info
  function horoscope1Set(horoscope1) {
    $("#horoscope1").text(horoscope1);

  }

  // Set horoscope API info
  function horoscope2Set(horoscope2) {
    $("#horoscope2").text(horoscope2);
  }


  // function wordSet1(word, sentimentOfWord) {
  //   console.log("keyword: " + word);
  //   console.log("sentiment: " + sentimentOfWord);
  //   $(".tileA").text(word); // word of day
  //   $(".tileB").text(sentimentOfWord);  // sentiment
  // }

  // function wordSet2(word, sentimentOfWord) {
  //   console.log("keyword: " + word);
  //   console.log("sentiment: " + sentimentOfWord);
  //   $(".tileC").text(word); // word of day
  //   $(".tileD").text(sentimentOfWord);  // sentiment
  // }

  // Date had format YYYY-MM-DD
  function timerSet(date) {

    // Get current day
    var currentDay = moment().format("YYYY-MM-DD");
    // console.log(currentDay);

    currentDay = currentDay.split("-");
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
    // console.log(date);
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


  // Kelvin to Fahrenheit
  function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 1.8 + 32;
  }

  // Get Weather Data
  function queryCurrentWeather(inCity, inState, callback) {

    var weather = {
      cityName: "",
      curDate: "",
      weatherIconUrl: "",
      humidity: "",
      temperature: "",
      wind: "",
    };

    var queryWeatherURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      encodeURI(inCity) +
      "," +
      encodeURI(inState) +
      "&appid=" +
      owmapikey;

    // perform AJAX query here
    $.ajax({
      url: queryWeatherURL,
      method: "GET",
    }).then(function (response) {
      res = response;

      weather.cityName = res.name;
      // "San Francisco Weather"
      $("#cityName").text(res.name + " Weather");

      // Weather Icon
      var iconId = res.weather[0].icon; // how to convert that to real icon?

      // Icon URL
      weather.weatherIconUrl =
        "http://openweathermap.org/img/wn/" + iconId + "@2x.png";

      $("#weatherIcon").attr("src", weather.weatherIconUrl);

      // Fahrenheit Symbol
      var fahsymbol = "%C2%B0" + "F";

      // Temperature
      weather.temperature =
        Math.round(kelvinToFahrenheit(res.main.temp) * 10) / 10;

      $("#temperature").text(weather.temperature + decodeURIComponent(fahsymbol));

      // Humidity
      weather.humidity = res.main.humidity + "%";

      $("#humidity").text(weather.humidity);

      // Wind Speed
      weather.wind = Math.round(res.wind.speed * 10) / 10 + " MPH";

      $("#wind").text(weather.wind);

      // we're recording the lat-lon for the UV reading
      // $("#weather").html(thtml);

      lat = res.coord.lat;
      lon = res.coord.lon;

      // console.log(weather);
      // console.log(lat + " / " + lon);

      getUVIndex(lat, lon);

      callback(lat, lon);
      return weather;
    });
  }


  function getUVIndex(lat, lon) {
    var queryUVURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&APPID=d953636a06fd6af8b2c881b86b574429";

    $.ajax({
      url: queryUVURL,
      method: "GET"
    }).then(function (response) {
      // Retrieve UV index
      UVIndex = response.value;

      // Display uv
      $("#uv").text(UVIndex);

    });
  }

  function getBreezometerAQI(lat, lon) {
    // see https://docs.breezometer.com/api-documentation/air-quality-api/v2/#current-conditions

    var queryBreezeURL =
      "https://api.breezometer.com/air-quality/v2/current-conditions?lat=" +
      lat +
      "&lon=" +
      lon +
      "&key=" +
      breezokey;

    $.ajax({
      type: "GET",
      url: queryBreezeURL,
      dataType: "json",
    }).then(function (response) {
      // options = response.description;
      var airIndex = response.data.indexes.baqi.aqi;
      // console.log(resp);

      $("#airIndex").text(airIndex);

      // return airIndex;
      // callback();
    });
  }

  function getPollenForecast(lat, lon) {
    // see https://docs.breezometer.com/api-documentation/pollen-api/v2/#request-parameters

    var thtml = "";
    var queryPollenURL =
      "https://api.breezometer.com/pollen/v2/forecast/daily?lat=" +
      lat +
      "&lon=" +
      lon +
      "&days=1" +
      "&key=" +
      breezokey;

    $.ajax({
      type: "GET",
      url: queryPollenURL,
      dataType: "json",
    }).then(function (response) {

      // Types of pollen
      var pollen = response.data[0].types;


      try {
        // Check Out of Season
        if (!pollen.grass.in_season) {
          pollen.grass.index.value = "Out of season";
          pollen.grass.index.category = "";
        }

        txt = "<P>Grass pollen data = " + polle.grass.index.value + " " + pollen.grass.index.category + "</P>";
        thtml += txt;
      } catch (err) {
        console.log("no grass pollen info / " + thtml);
      }

      try {
        // Check Out of Season
        if (!pollen.tree.in_season) {
          pollen.tree.index.value = "Out of season";
          pollen.tree.index.category = "";
        }
        txt = "<P>Tree pollen data = " + pollen.tree.index.value + "</P>";
        thtml += txt;
      } catch (err) {
        console.log("no tree pollen info / " + thtml);
      }

      try {
        // Check Out of Season
        if (!pollen.weed.in_season) {
          pollen.weed.index.value = "Out of season";
          pollen.weed.index.category = "";
        }
        txt = "<P>Weed pollen data = " + pollen.weed.index.value + "</P>";
        thtml += txt;
      } catch (err) {
        console.log("no weed pollen info / " + thtml);
      }
      $("#pollenData").html(thtml);
      // return pollen;
      // callback();
    });
  }

  // function getGiphyImages(zodiac) {

  //   // Add image

  //   var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + zodiac + "&limit=1&api_key=wslWpWhssAgYDK6zVXacBDsacT47flr4";

  //   $.ajax({
  //     url: queryURL,
  //     method: "GET"
  //   }).then(function (response) {
  //     console.log(response);

  //     var gifs = response.data
  //     console.log(gifs[0].images.original.url);

  //   });

  // }



  // function getTidalInfo(lat, long) {

  //   var queryURL = "https://suncalc.org/#/48.85826,2.29451,17/2015.05.11/13:15/324.0/2";

  //   $.ajax({
  //     url: queryURL,
  //     method: "GET"
  //   }).then(function (response) {
  //     console.log(response);

  //     // var gifs = response.data
  //     // console.log(gifs[0].images.original.url);

  //   });

  // }

});
