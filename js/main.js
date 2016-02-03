var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        loginForm();
        registerForm();
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

