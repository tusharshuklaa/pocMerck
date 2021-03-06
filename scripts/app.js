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
		uploadCrop: $("#avatar").croppie({
			viewport: {
				width: 150,
				height: 150
			}
		}),
		postPostedModal: $("#postPostedModal"),
		postPostedClose: $("#postPostedClose"),
		postForm: $(".postCreator"),
		previewImg: $("#previewImg"),
		storyDesc: $("#storyDesc"),
		userStory: $("#userStory"),
		shareOnFb: $("#shareOnFb"),
		uploadAvatar: $("#uploadAvatar")
	};

	var imgMeta;
	var allowedImgTypes = [
		"jpeg",
		"jpg",
		"png"
	];

	window.fbAsyncInit = function() {
		FB.init({
			appId: '1662052057223084',
			autoLogAppEvents: true,
			xfbml: true,
			version: 'v2.12'
		});
	};

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

    		// var img = ELEM.previewImg.attr("src");
    		// Have to give the url of cropped image saved on server, base64/blob won't work for sharing on fb
    		var img = "https://tusharshuklaa.github.io/pocMerck/images/cat.jpg";
    		var desc = ELEM.userStory.text();
    		var title = document.title;
    		var link = window.location.href;

    		FB.ui({
    			method: 'share_open_graph',
    			action_type: 'og.shares',
    			action_properties: JSON.stringify({
    				object: {
    					'og:url': link,
    					'og:title': title,
    					'og:description': desc,
    					'og:image': img
    				}
    			})
    		}, function(response) {
    			console.log("response from fb", response);
    			if(response) {
    				StoryCreator.closePreview();
    				alert("Your story has been shared on Facebook succesfully!");
    			}
    		});
    	}
    }

    class StoryCreator {
    	constructor() {}

    	static openCreator() {
    		ELEM.postCreatorModal.addClass("modalOpen");
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

	    static readFile(input) {
	    	if (input.files && input.files[0]) {
	    		imgMeta = input.files[0];
	    		var reader = new FileReader();

	    		reader.onload = function (e) {
	    			ELEM.postForm.addClass('ready');
					ELEM.uploadCrop.croppie('bind', {
						url: e.target.result
					}).then(function(){
						console.log('jQuery bind complete');
					});
				}

				reader.readAsDataURL(input.files[0]);
			}
			else {
				console.log("Sorry - you're browser doesn't support the FileReader API");
			}
		}

		static isValid() {
			var story = ELEM.storyDesc.val();
			if(story && story !== "") {
				if(story.length > 150) {
					alert("Story cannot exceed more than 150 characters");
					return false;
				}
			} else {
				alert("Cannot submit empty story");
				return false;
			}

			if(imgMeta) {
				var imgType = imgMeta.type.substring(6, imgMeta.type.length);
				if(allowedImgTypes.indexOf(imgType) === -1) {
					alert("Only " + allowedImgTypes.join(", ") + " image types are allowed");
					return false;
				}

				if(imgMeta.size > 5000000) {
					alert("Choose an image less than 5MB");
					return false;
				}
			} else {
				alert("Cannot submit story without a picture");
				return false;
			}

			return true;
		}

		static save(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			var self = this;
			var story = ELEM.storyDesc.val();
			if(self.isValid()) {
				ELEM.uploadCrop.croppie("result", {
					type: 'base64',
					resultSize: {
						width: 150,
						height: 150
					}
				}).then(function (resp) {
	    			// some code to save the image and story to repo should come here
	    			ELEM.storyDesc.val("");
	    			ELEM.previewImg.attr("src", resp);
	    			self.closeCreator();
	    			ELEM.userStory.text(story);
	    			self.openPreview();
	    		});
			}
		}
	}

    // Attaching click events
    
    ELEM.uploadNowBtn.on("click", StoryCreator.openCreator);
    ELEM.postCreatorModalClose.on("click", StoryCreator.closeCreator);
    ELEM.postPostedClose.on("click", StoryCreator.closePreview);
    ELEM.postForm.on("submit", (e) => StoryCreator.save(e));
    ELEM.shareOnFb.on("click", FbUtils.share);
    ELEM.uploadAvatar.on('change', function() { StoryCreator.readFile(this); });
});