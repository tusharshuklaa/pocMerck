(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(() => {
    var uploadNowBtn = $("#openUploadBox");
    var fbLoginModal = $("#loginFb");
    var fbLoginModalClose = $("#closeLoginPopup");
    var postCreatorModal = $("#postCreatorModal");
    var postCreatorModalClose = $("#postModalClose");

    window.fbAsyncInit = function() {
        FB.init({
            appId: '578128222551876',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v2.12'
        });
    };

    var shareToFb = function() {
        // avatar.result('blob').then(function(blob) {
        //     // do something with cropped blob
        // });
        FB.ui({
            method: 'share',
            mobile_iframe: true,
            href: 'https://developers.facebook.com/docs/',
        }, function(response) {
            closePostCreator();
        });
    };

    var loginToFacebook = function() {
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                    openPostCreator();
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
        closeFbLoginModal();
        postCreatorModal.addClass("postCreatorOpen");

        setTimeout(() => {
        	$('#avatar').croppie("bind");
        });
    };

    var closePostCreator = function() {
        postCreatorModal.removeClass("postCreatorOpen");
    }

    var openFbLoginModal = function() {
        fbLoginModal.addClass("fbLoginOpen");
    };

    var closeFbLoginModal = function() {
        fbLoginModal.removeClass("fbLoginOpen");
    };

    // Attaching click events
    uploadNowBtn.on("click", openUploadBox);
    fbLoginModal.on("click", loginToFacebook);
    fbLoginModalClose.on("click", closeFbLoginModal);
    postCreatorModalClose.on("click", closePostCreator);

    var avatar = $('#avatar').croppie({
        viewport: {
            width: 150,
            height: 200,
            type: 'circle'
        },
        boundary: {
            width: 300,
            height: 300
        },
        showZoomer: false,
    });

    $('#avatar').bind({
        url: '/images/cat.jpg'
    });

    // $('#imgUploader').on("change", function() {
    //     var input = $(this);
    //     var frm = new FormData();
    //     frm.append('imageInput', input[0].files[0]);
    //     $.ajax({
    //         method: 'POST',
    //         address: 'https://tusharshuklaa.github.io/pocMerck/images/',
    //         data: frm,
    //         contentType: false,
    //         processData: false,
    //         cache: false
    //     }).done(function(resp) {
    //         console.log("resp", resp);
    //     });
    // });
});