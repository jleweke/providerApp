var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        loginForm();
        registerForm();
        benefitsForm();
        clickEvents();
        console.log("loaded app intialize")
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        console.log("are we getting here?")
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function clickEvents(){
    $('#login-form-link').click(function(e) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

  $('#register-form-link').click(function(e) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });


  $('#benefits-form-link').click(function(e) {
    $(".member-data").fadeOut(100);
    $("#benefits-form-div").delay(100).fadeIn(100);
    $('#member-nav li').removeClass('active');
    $(this).addClass('active');
      benefitsForm();
      "clicked on benefits form"
    e.preventDefault();
  });

    $('#profile-link').click(function(e) {
    $(".member-data").fadeOut(100);
    $("#profile").delay(100).fadeIn(100);
    $('#member-nav li').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

    // find listener for div, displya current user name
    // var stringCurrentUser = localStorage.currentUser
    // var currentUser = JSON.parse(stringCurrentUser)
    // document.getElementById("user-name").innerHTML = currentUser["Username"]

    $('#filing-link').click(function(e) {
    $(".member-data").fadeOut(100);
    $("#filing-info").delay(100).fadeIn(100);
    $('#member-nav li').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });
}


function loginForm(){
    //validation rules

$("#login-form").validate({
      rules: {
          "Username": {
              required: true

          },
          "Password": {
              required: true
          }
      },
      //perform an AJAX post to API
      submitHandler: function (form) {
          var formdata = $(form).serializeArray();
          var currentUser = {};

          $(formdata).each(function(index, obj){
            currentUser[obj.name] = obj.value
          });

          $.ajax({
              type: "POST",
              url: "https://myteamcare.org/ics.ashx",
              data: $(form).serialize(),
              headers: {
                  "action": 'authenticate',
                  "Content-type": "application/x-www-form-urlencoded",
              },
              success: function (message) {

                  if (message.Success) {
                   window.location = 'memberdata.html';
                    console.log(message);

                    // Put the object into storage
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));

                    // Retrieve the object from storage
                    // var retrievedObject = localStorage.getItem('testObject');
                  }

                  ////else display value error
                  else {
                      alert(message.Error);
                      window.localStorage.clear()
                      // console log local storage to make sure its empty
                  }
                  //window.location = 'memberdata.html';
              },
              error: function () { alert("There was an error communicating with the server.  Please try again")}
          });
          return false; // required to block normal submit since you used ajax
      }
  });
};

function registerForm(){
    //validation rules
$("#register-form").validate({
      rules: {
          "Username": {
              required: true,
              rangelength: [8, 30],
              uppercase: true,
              lowercase: true,
              number: true

          },
          "Password": {
              required: true
          }
          ,
          "TaxId": {
              required: true,
              taxid: true
          }
          ,
          "FirstName": {
              required: true
          }
          ,
          "LastName": {
              required: true
          }
          ,
          "Email": {
              required: true,
              email: true
          }
          ,
          "Question1": {
              required: true
          }
          ,
          "Answer1": {
              required: true
          }
          ,
          "Question2": {
              required: true
          }
          ,
          "Answer2": {
              required: true
          }
          ,
          "Question3": {
              required: true
          }
          ,
          "Answer3": {
              required: true
          }
      },
      //perform an AJAX post to API
      submitHandler: function (form) {
          jQuery(form).ajaxSubmit({
              type: "POST",
              url: "https://myteamcare.org/ics.ashx",
              data: $(this).serialize(),
              headers: {
                  "action": 'register',
                  "Content-type": "application/x-www-form-urlencoded",
              },
              success: function (data) {
                  console.log(data);
                  alert("Registration successful. Check email for next steps");
                  window.location = 'memberdata.html';
              },
              error: function () { alert("There was an error") }
          });

      }
  });
};

function benefitsForm(){
$("#benefits-form").validate({
      rules: {
          "Patient Birthdate": {
              required: true

          },
          "Patient Member ID": {
              required: true
          }
      }
  });
  console.log("before submit")
  $("#benefits-form").submit(function(event){
    console.log("on submit");
      //perform an AJAX post to API
       event.preventDefault(); //stop redirect

    if ($("#benefits-form").valid()){
        console.log("form is valid");

        var stringCurrentUser = localStorage.currentUser;
        var currentUser = JSON.parse(stringCurrentUser);

        var formData = $("#benefits-form").serializeArray();
        var formDataJSON = {
          "Username" : currentUser["Username"],
          "Password": currentUser["Password"],
        }

        $(formData).each(function(index, obj){
            formDataJSON[obj.name] = obj.value
          });

          $.ajax({
              type: "POST",
              url: "https://myteamcare.org/ics.ashx",
              // dataType: "json",
              data: formDataJSON,
              headers: {
                  "action": 'check',
                  "Content-type": "application/x-www-form-urlencoded",
              },
              success: function (message) {
               displayBenefits(message)
              $(".member-data").fadeOut(100);
              $("#benefits-result").delay(100).fadeIn(100);
              },
              error: function () { alert("There was an error communicating with the server.  Please try again")}
          });
          return false; // required to block normal submit since you used ajax
      }

  });

};

function displayBenefits(memberDataJSON){
// Fills in all member health information from member data JSON
$.each(memberDataJSON, function(key, value){
    if ($("#" + key).length > 0){
      $("#" + key).html(value)
    }
  })

// Add and format PDF links for Plan Document information
$.each(memberDataJSON["PlanDocuments"], function(index, obj){
  var displayNameClean =  obj["DisplayName"].replace(/[^\w]/gi, '')

  if($("#" + displayNameClean).length > 0){
    var url = "https://myteamcare.org/" + obj["RelativePath"]
    $("#" + displayNameClean).attr("href", url)
  };
})

}
