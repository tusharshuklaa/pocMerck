$(() => {
    var uploadNowBtn = document.getElementById("openUploadBox");
    var fbLoginModal = document.getElementById("fbLoginModal");
    var postCreatorModal = document.getElementById("postCreator");

    var shareToFb = function() {
        FB.ui({
            method: 'share',
            mobile_iframe: true,
            href: 'https://developers.facebook.com/docs/',
        }, function(response) {
            hidePostCreator();
        });
    };

    var loginToFacebook = function() {
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {
            scope: "publish_actions"
        });
    };

    var isFbLoggedIn = new Promise(function(resolve, reject) {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                resolve(true);
            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
                resolve(true);
            } else {
                // the user isn't logged in to Facebook.
                reject("User isn't logged in");
            }
        });
    });

    var openUploadBox = function() {
    	var self = this;
        uploadNowBtn.innerHTML = "Opening...";
        self.isFbLoggedIn().then((res) => {
            if (res) {
                self.openPostCreator();
            }
        }, (err) => {
            // in case of API fail or not logged in
            console.log("error", err);
            self.openFbLoginModal();
        });
    };

    var openPostCreator = function() {
        postCreatorModal.classList.add("postCreatorOpen");
    };

    var openFbLoginModal = function() {
        fbLoginModal.classList.add("fbLoginOpen");
    };

    var hidePostCreator = function() {
        postCreatorModal.classList.remove("postCreatorOpen");
    }

    // Attaching click events
    document.getElementById("openUploadBox").onclick = openUploadBox;
});