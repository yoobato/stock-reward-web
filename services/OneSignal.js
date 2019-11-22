const OneSignal = require('onesignal-node');

class OSignal {
    constructor() {
        this.myClient = new OneSignal.Client({      
            userAuthKey: 'YWZkMTZiYTUtMzc1NC00YzVhLTkyM2EtODI1YjE2ZDZjYWNk',      
            app: { 
                appAuthKey: 'YjBjMGNjMGYtMjgxMy00NmVjLWJjYzctNzZkOGM4OWUxZTky',
                appId: '71add10e-a796-4d8e-bb57-e07b620751d3' 
            }      
        }); 
    }
    
    sendNotification(){
        var firstNotification = new OneSignal.Notification({      
            contents: {      
                en: "Test notification",      
                tr: "Test mesajı"      
            }      
        });  
        // set target users      
        firstNotification.postBody["included_segments"] = ["Active Users"];      
            
        // set notification parameters      
        firstNotification.postBody["data"] = {"abc": "123", "foo": "bar"};      

        return this.myClient.sendNotification(firstNotification)      
        .then(response => {
            return Promise.resolve(response.data);
        })      
        .catch(function (err) {      
            console.log('Something went wrong...', err);      
        });  
    }  
}

module.exports = new OSignal(); 