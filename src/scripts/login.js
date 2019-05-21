firebase.auth().onAuthStateChanged(function (user) {
    database.ref("userlist/" + user.uid).update({
        "userName": user.displayName,
        "email": user.email
    });
    sessionStorage.setItem("uid", user.uid);
    sessionStorage.setItem("name", user.displayName);    
});

// Test Data
let petNum = 1;


function getUrl(){
    // If the account is new and have to pet
    // window.alert("test");
    if (petNum == 0 ){
        return '../icopicoPet/icopico.html';
    } else{
        return '../icopico/icopico.html';
    }
};


var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            return true;
        },
        uiShown: function () {
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: getUrl(),
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
};


// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);