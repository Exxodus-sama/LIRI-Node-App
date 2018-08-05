
require("dotenv").config();

// Imports that run the app

var fs = require("fs"); 
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require ("node-spotify-api");

//Keys
var spotify = new Spotify(keys.spotify);
var client = new twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
  });

// Variables for commands
var command = process.argv[2];
var addOn = process.argv[3];

// Commands that LIRI accepts 

switch (command) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhat();
        break;

    default: console.log(
        "\n" +"Try typing one of the following commands after 'node liri.js': " +"\n"+
        "my-tweets" + "\n" +
        "spotify-this-song 'any song name' " + "\n" +
        "movie-this 'any movie name' " + "\n" +
        "do-what-it-says." + "\n" +
        "Be sure to put the movie or song name in quotation marks if it's more than one word."
    );
};                  


// Functions that are the actual code of the app
// Twitter function that displays the tweets.

function myTweets() {

    var params = {screen_name: 'Exxodus5', count: 20};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                var number = i + 1;
                console.log(
                    "\n" + '--------------------' +
                    "\n" + [i + 1] + '. ' + tweets[i].text +
                    "\n" +'Tweeted on: ' + tweets[i].created_at +
                    "\n" + '--------------------' + "\n"
                );
            };
        };
    });
};

function spotifyThis(){
    if (!addOn){
        addOn = "The Sign";
    };
    spotify.search({ type: 'track', query: addOn }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        } else {
            console.log(
                '\n--------------------' + 
                "\nArtist: " + data.tracks.items[0].artists[0].name +
                "\nSong Name: " + data.tracks.items[0].name +
                "\nPreview Link: " + data.tracks.items[0].preview_url +
                "\nAlbum: " + data.tracks.items[0].album.name + 
                '\n--------------------\n'
            );
        }; 
      });
};

function movieThis(){
    if (!addOn) {
        addOn = 'Mr.Nobody';
    };
    var URL = "http://www.omdbapi.com/?t=" + addOn + "&y=&plot=short&apikey=71f0cfba";
    request(URL, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            var movieParse = JSON.parse(body);
            var movieData = [
                "--------------------" +
                "\n" +
                "Title: " + movieParse.Title,
                "Release Year: " + movieParse.Year,
                "Rating: " + movieParse.imdbRating,
                "Country: " + movieParse.Country,
                "Language: " + movieParse.Language,
                "Plot: " + movieParse.Plot,
                "Actors: " + movieParse.Actors +
                "\n" + 
                "--------------------"
            ].join("\n");
            console.log(movieData);
        };
    });
};

function doWhat() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(!error){
            dataArr = data.split(",");
            spotifyThis(dataArr[0], dataArr[1]);
        } else {
            console.log("Error: " + error);
        }
    });
    
};
