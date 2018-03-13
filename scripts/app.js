(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(() => {

	var ELEM = {
		uploadNowBtn: $("#openUploadBox"),
		postCreatorModal: $("#postCreatorModal"),
		postCreatorModalClose: $("#postModalClose"),
		avatar: $("#avatar").croppie({
				    viewport: {
				        width: 150,
				        height: 150
				    }
				}),
		postPostedModal: $("#postPostedModal"),
		postForm: $(".postCreator"),
		previewImg: $("#previewImg"),
		storyDesc: $("#storyDesc"),
		shareOnFb: $("#shareOnFb")
	};

    window.fbAsyncInit = function() {
        FB.init({
            appId: '578128222551876',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v2.12'
        });
    };

	ELEM.avatar.croppie('bind', {
	    url: "/pocMerck/images/cat.jpg"
	});
    
    class FbUtils {
    	constructor() {}

    	static login() {
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
    	}

    	static isLoggedIn() {
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
    	}

    	static share(evt) {
    		evt.preventDefault();

    		FB.ui({
	            method: 'share',
	            mobile_iframe: true,
	            href: 'https://developers.facebook.com/docs/',
	        }, function(response) {
	            closePostCreator();
	        });
    	}
    }

    class StoryCreator {
    	constructor() {}

    	static openCreator() {
    		ELEM.postCreatorModal.addClass("modalOpen");

	        setTimeout(() => {
	        	$('#avatar').croppie("bind");
	        }, 100);
    	}

    	static closeCreator() {
    		ELEM.postCreatorModal.removeClass("modalOpen");
    	}

    	static openPreview() {
    		ELEM.postPostedModal.addClass("modalOpen");
    	}

    	static closePreview() {
    		ELEM.postPostedModal.removeClass("modalOpen");
    	}

    	static save() {
    		var self = this;
    		ELEM.avatar.croppie("result", {
    			type: 'html',
				size: size,
				resultSize: {
					width: 150,
					height: 150
				}
    		}).then(function (resp) {
    			// some code to save the image and story to repo
    			console.log("resp img", resp);
    			ELEM.previewImg.html(resp);
    			self.openPreview();
			});
    	}
    }

    // Attaching click events
    
    ELEM.uploadNowBtn.on("click", StoryCreator.openCreator);
    ELEM.postCreatorModalClose.on("click", StoryCreator.closeCreator);
    ELEM.postForm.on("submit", StoryCreator.save);
    ELEM.shareOnFb.on("click", (e) => FbUtils.share(e));
});