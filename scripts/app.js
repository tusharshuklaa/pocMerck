(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(() => {
    var uploadNowBtn = document.getElementById("openUploadBox");
    var fbLoginModal = document.getElementById("loginFb");
    var postCreatorModal = document.getElementById("postCreator");

    window.fbAsyncInit = function() {
        FB.init({
            appId: '578128222551876',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v2.12'
        });
    };

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
        });
    };

    var isFbLoggedIn = function() {
        return new Promise((resolve, reject) => {
            return FB.getLoginStatus(function(response) {
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
                    resolve(false);

                }
            });
        });
    };

    var openUploadBox = function() {
        // uploadNowBtn.innerHTML = "Opening...";
        // isFbLoggedIn.then((res) => {
        //     if (res) {
        //         openPostCreator();
        //     }
        // }, (err) => {
        //     // in case of API fail or not logged in
        //     console.log("error", err);
        //     openFbLoginModal();
        // });
        // var loggedIn = isFbLoggedIn();
        // if (loggedIn) {
        //     openPostCreator();
        // } else {
        //     openFbLoginModal();
        // }

        isFbLoggedIn().then((loggedIn) => {
            if (loggedIn) {
                openPostCreator();
            } else {
                openFbLoginModal();
            }
        }, (err) => {
            console.log("err", err);
            openFbLoginModal();
        });
    };

    var openPostCreator = function() {
        postCreatorModal.classList.add("postCreatorOpen");
    };

    var openFbLoginModal = function() {
        fbLoginModal.classList.add("fbLoginOpen");
    };

    var closeFbLoginModal = function() {
        fbLoginModal.classList.remove("fbLoginOpen");
    };

    var hidePostCreator = function() {
        postCreatorModal.classList.remove("postCreatorOpen");
    }

    // Attaching click events
    document.getElementById("loginBtn").onclick = loginToFacebook;
    document.getElementById("openUploadBox").onclick = openUploadBox;
    document.getElementById("closeLoginPopup").onclick = closeFbLoginModal;
});