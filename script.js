$(document).ready(function () {

    var cityName="London";
    var apiKey="17c84c3fd27ab590f993fd4332212e8c"
    var units="metric";
    
    var latitude="";
    var longitude="";
    var weatherIconID="";
    var dateHour="";
    var currentDate=moment().format('MMMM Do YYYY');
    var recentSearch=[];

    $("#search-btn").on("click", getWeather);
 
    function getWeather() {
        event.preventDefault();
        $("#mainInfo-section").empty();
        cityName=$("#searchedCity").val();
        //recentSearch.splice(1, 0, cityName);
        recentSearch.unshift(cityName);
        console.log(recentSearch);
        var queryURL ="https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey+"&units="+units;
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            //console.log(response);
            var mainDiv=$("#mainInfo-section");

            var titleDiv=$("<div>");
            var newMainCity=$("<h2>");
            var weatherIcon=$("<img>");
            var newTempP=$("<p>");
            var newHumP=$("<p>");
            var newWindSP=$("<p>");
            var newuvIndP=$("<p>");

            var city=response.name;
            var country=response.sys.country;
            var currentTemperature=response.main.temp;
            var currentHumidity=response.main.humidity;
            var currentWindS=response.wind.speed;
            var currentUvInd="Dummy value";
            latitude=response.coord.lat;
            longitude=response.coord.lon;
            weatherIconID=response.weather[0].icon;
            var weatherIconURL="http://openweathermap.org/img/wn/"+weatherIconID+"@2x.png";

            //console.log(weatherIcon);

            newMainCity.text(city+" , "+country+" ("+currentDate+")");
            weatherIcon.attr("src",weatherIconURL);
            newTempP.text("Temperature: "+currentTemperature+" °C");
            newHumP.text("Humidity: "+currentHumidity+" %");
            newWindSP.text("Wind speed: "+currentWindS+" KPH");
            newuvIndP.text("UV Index: "+currentUvInd);

            mainDiv.append(titleDiv);
            titleDiv.append(newMainCity);
            newMainCity.append(weatherIcon);
            mainDiv.append(newTempP);
            mainDiv.append(newHumP);
            mainDiv.append(newWindSP);
            mainDiv.append(newuvIndP);

            var uvQueryUrl="https://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+latitude+"&lon="+longitude;

            $.ajax({
                url: uvQueryUrl,
                method: "GET",
            }).then(function (responseUV) {
                currentUvInd=responseUV.value;
                newuvIndP.text("UV Index: "+currentUvInd);
                dateHour=responseUV.date;
                //console.log(dateHour.toISOString());
                //console.log(dateHour);
            });

            var fiveDaysQueryUrl="https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&exclude=current,minutely,hourly&appid="+apiKey+"&units="+units;
            
            $.ajax({
                url: fiveDaysQueryUrl,
                method: "GET",
            }).then(function (responseFD) {
                //console.log(responseFD);

                $("#5days-section").empty();
                $("#5daysDiv").empty();

                var fiveDaysMainDiv=$("#5days-section");
                var fiveDaysTitle=$("#5daysDiv");
                var fiveDH=$("<h3>");
                fiveDH.text("5 days forecast");
                fiveDaysTitle.append(fiveDH);

                for(var cnt5=1; cnt5<6; cnt5++){
                    var card=$("<div>");
                    card.attr("class","card");
                    fiveDaysMainDiv.append(card);

                    var cardBody=$("<div>");
                    cardBody.attr("class","card-body");
                    card.append(cardBody);

                    var cardTitle=$("<h5>");
                    cardTitle.attr("class","card-title");
                    var dateFive=moment().add(cnt5, 'day').format('DD/MM/YYYY');
                    cardTitle.text(dateFive);
                    cardBody.append(cardTitle);

                    weatherIconIDFive=responseFD.daily[cnt5].weather[0].icon;
                    var weatherIconFive="http://openweathermap.org/img/wn/"+weatherIconIDFive+"@2x.png";

                    var iconFive=$("<img>");
                    iconFive.attr("src",weatherIconFive);
                    cardBody.append(iconFive);

                    var minTempFive=$("<p>");
                    minTempFive.attr("class","card-title");
                    minTempFive.text("Min: "+responseFD.daily[cnt5].temp.min+"°C");
                    cardBody.append(minTempFive);

                    var maxTempFive=$("<p>");
                    maxTempFive.attr("class","card-title");
                    maxTempFive.text("Max: "+responseFD.daily[cnt5].temp.max+"°C");
                    cardBody.append(maxTempFive);

                    var humFive=$("<p>");
                    humFive.attr("class","card-title");
                    humFive.text("Hum: "+responseFD.daily[cnt5].humidity+"%");
                    cardBody.append(humFive);
                }
            });

        });
    };
});