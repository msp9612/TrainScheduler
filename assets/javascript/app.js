// Firebase config
var firebaseConfig = {
    apiKey: "AIzaSyCDxFwJRLfxiMr7zZiqDyhQYhUcf4SxZCA",
    authDomain: "class9-14-19-984a2.firebaseapp.com",
    databaseURL: "https://class9-14-19-984a2.firebaseio.com",
    projectId: "class9-14-19-984a2",
    storageBucket: "class9-14-19-984a2.appspot.com",
    messagingSenderId: "101489884369",
    appId: "1:101489884369:web:e8a276c344f22d532b99f0"
};
firebase.initializeApp(firebaseConfig);
var trainDatabase = firebase.database();


// Submit button clicked
$("#add-train-submit").on("click", function (event) {

    event.preventDefault();

    // Get inputted values
    var trainName = $("#add-train-name").val().trim();
    var trainDestination = $("#add-train-destination").val().trim();
    var trainFirst = $("#add-train-first").val().trim();
    var trainFrequency = $("#add-train-frequency").val().trim();

    // Use inputted values
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        firstTime: trainFirst,
        frequency: trainFrequency
    };

    // Add to database
    trainDatabase.ref().push(newTrain);

    // Clear text inputs
    $("#add-train-input").val("");
    $("#add-train-destination").val("");
    $("#add-train-first").val("");
    $("#add-train-frequency").val("");
});


// Data added to Firebase
trainDatabase.ref().on("child_added", function (snapshot) {

    // Store values with variables
    var snapName = snapshot.val().name;
    var snapDestination = snapshot.val().destination;
    var snapFirstTime = snapshot.val().firstTime;
    var snapFrequency = snapshot.val().frequency;
    var arrivalTime, arrivalMinutes;

    // Split train time
    var timeSplit = snapFirstTime.split(":");
    var trainTime = moment()
        .hours(timeSplit[0])
        .minutes(timeSplit[1]);

    // Compare current time with train time
    var timeMax = moment.max(moment(), trainTime);
    if (timeMax === trainTime) {
        // First train hasn't arrived yet
        arrivalTime = trainTime.format("hh:mm A");
        arrivalMinutes = trainTime.diff(moment(), "minutes");
    } else {
        // First train already arrived
        var timeMod = moment().diff(trainTime, "minutes") % snapFrequency;
        arrivalMinutes = snapFrequency - timeMod;
        arrivalTime = moment()
            .add(arrivalMinutes, "m")
            .format("hh:mm A");
    }

    // Add values to table
    $("#train-table > tbody").append(
        $("<tr>").append(
            $("<td>").text(snapName),
            $("<td>").text(snapDestination),
            $("<td>").text(snapFrequency),
            $("<td>").text(arrivalTime),
            $("<td>").text(arrivalMinutes)
        )
    );
});