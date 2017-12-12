window.onload = function() {
    showPage('Home-navbar');
};

var Cougs_In_Space = (function() {
	//Private Variables
    var apiUrl = 'http://localhost:5000';
    var cis;

    var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };

    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };

    var displayPosts = function() {
        // Prepare the AJAX handlers for success and failure
         console.log('we reached inside display posts');
         $('.systems-posts-container').html('');
         $('.power-posts-container').html('');
         $('.structures-posts-container').html('');
         $('.thermal-posts-container').html('');
         $('.attitude-posts-container').html('');

        var onSuccess = function(data) {
            console.log('we reached inside on success for posts');
            //Calls and inserts the 5 posts into the correct page
            var i = 0;
            while(data.posts[i] != null && i <= 4)
            {
                insertPost(data.posts[i]);
                i++;
            }   
        };
        var onFailure = function() { 
            console.error('display posts failed'); 
        };
        //Make a get request for each URL to get the most recent 5 posts from each team
        makeGetRequest("/api/posts?team=Attitude", onSuccess, onFailure);
        makeGetRequest("/api/posts?team=Systems", onSuccess, onFailure);
        makeGetRequest("/api/posts?team=Power", onSuccess, onFailure);
        makeGetRequest("/api/posts?team=Thermal", onSuccess, onFailure);
        makeGetRequest("/api/posts?team=Structures", onSuccess, onFailure);
    };
    //inserts a post into a specific team section based on which team name the 
    var insertPost = function(post) {
        console.log('we reached insertPost, about to add eleements to dom object');
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(postTemplateHtml);
        // Populate the data in the new element
        // Set the "id" attribute 
        newElem.find('.post-id').text(post.id);
        newElem.find('.post-title').text(post.title);
        newElem.find('.post-body').text(post.update);
        newElem.find('.team-name').text(post.team);
        // Now fill in the data that we retrieved from the server
        switch(post.team) {
            case "Systems":
            {
                console.log('we reached insertPost, about to insert systems post');
                $(".systems-posts-container").append(newElem);
                break;
            }
            case "Attitude":
            {
                console.log('we reached insertPost, about to insert attitude post');
                $(".attitude-posts-container").append(newElem);
                break;
            }
            case "Power":
            {
                console.log('we reached insertPost, about to insert power post');
                $(".power-posts-container").append(newElem);
                break;
            }
            case "Thermal":
            {
                console.log('we reached insertPost, about to insert thermal post');
                $(".thermal-posts-container").append(newElem);
                break;
            }
            case "Structures":
            {
                console.log('we reached insertPost, about to insert structures post');
                $(".structures-posts-container").append(newElem);
                break;
            }
            default:
            {

            }
        }
    };

    var attachCreateHandler = function(e) {

        // FINISH ME (Task 4): add a handler for the 'Cancel' button to hide the form
        // and show the 'Shared a smile...' button
        cis.parent().on('click', '.cancel', function(e) {
            e.preventDefault();
        });

        // The handler for the Post button in the form
        cis.parent().find('.submit').unbind().click(function (e) {
            e.preventDefault (); // Tell the browser to skip its default click action

            var post = {};
            post.team = cis.parent().find('.teamSelect').val();
            post.title = cis.parent().find('.createTitle').val();
            post.update = cis.parent().find('.postBody').val();
            space = cis.parent().find('.teamSelect').val();

            var onSuccess = function(data) {
                displayPosts();
                location.reload();
            };
            var onFailure = function(error) { 
                console.error(error.status); 
            };
            
            // FINISH ME (Task 4): make a POST request to create the smile, then 
            //            hide the form and show the 'Shared a smile...' button
            if (post.title.length == 0 || post.title.length > 64) {
                window.alert("Title length is invalid");
            } else if (post.update.length == 0 || post.update.length > 2048) {
                window.alert("Update length is invalid");
            } else {
                makePostRequest("/api/posts/" + space, post, onSuccess, onFailure);
            }
        });

        cis.parent().find('.sign-in').unbind().click(function (e) {
            e.preventDefault();
            //window.location.replace('http://localhost:5000/static/login');

            //makeGetRequest = function(/login, onSuccessLogin, onFailureLogin);

        });
            // var onSuccessLogin = function(data) {
            //     if (data[0].login == "Success")
            //         window.alert("You've logged in!");
            //     else:
            //         window.alert("Failed to log in.");
            // };
            // var onFailureLogin = function(error) { 
            //     window.alert("Failed to log in error.");
            // };
         cis.parent().find('.sign-out').unbind().click(function (e) {
            e.preventDefault();
        });
    };

    var start = function() {
        cis = $(".cis");
        post = $(".post-container");

        attachCreateHandler();
		//DOM template for posts
		postTemplateHtml = $(".post-container")[0].outerHTML;
        
        post.html('');

        displayPosts();
        attachCreateHandler();
    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
    return {
        start: start
    };

})();

function showPage(id) {
    cis = $(".cis");
    if (id == 'Home-navbar') {
         cis.find('.home-page').show();
    } else {
         cis.find('.home-page').hide();
    }
    // if (id == 'CIS-navbar') {
    //      cis.find('.home-page').show();
    // } else {
    //      cis.find('.home-page').hide();
    // }
    if (id == 'Our-Teams') {
        cis.find('.team-page').show();
    } else {
        cis.find('.team-page').hide();
    }
    if (id == 'Systems-dropdown') {
        cis.find('.systems-page').show();
    } else {
        cis.find('.systems-page').hide();
    }
    if (id == 'Power-dropdown') {
        cis.find('.power-page').show();
    } else {
        cis.find('.power-page').hide();
    }
    if (id == 'Attitude-dropdown') {
        cis.find('.attitude-page').show();
    } else {
        cis.find('.attitude-page').hide();
    }
    if (id == 'Structures-dropdown') {
        cis.find('.structures-page').show();
    } else {
        cis.find('.structures-page').hide();
    }
    if (id == 'Thermal-dropdown') {
        cis.find('.thermal-page').show();
    } else {
        cis.find('.thermal-page').hide();
    }
    if (id == 'Donors-navbar') {
        cis.find('.donors-page').show();
    } else {
        cis.find('.donors-page').hide();
    }
    if (id == 'GetInvolved-navbar') {
        cis.find('.get-involved-page').show();
    } else {
        cis.find('.get-involved-page').hide();
    }
    if (id == 'Donate-navbar') {
        cis.find('.donate-page').show();
    } else {
        cis.find('.donate-page').hide();
    }
    if (id == 'K-12-navbar') {
        cis.find('.k-12-page').show();
    } else {
        cis.find('.k-12-page').hide();
    }
    if (id == 'About-navbar') {
        cis.find('.about-page').show();
    } else {
        cis.find('.about-page').hide();
    }
    if (id == 'Meet-dev-navbar') {
        cis.find('.meet-dev-page').show();
    } else {
        cis.find('.meet-dev-page').hide();
    }
    if (id == 'Create-dropdown') {
        cis.find('.create-page').show();
    } else {
        cis.find(".create-page").hide();
    }
};
