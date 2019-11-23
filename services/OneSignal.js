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
    
    stockInsertNotification(stock, amount){
        var stockNotification = new OneSignal.Notification({
            contents: {      
                en: stock + " 주식이 " + amount + "주 입금되었습니다."
            }      
        });  
        stockNotification.postBody["included_segments"] = ["Active Users"];      
        //TODO: 메시지 수정 및 icon 추가
        stockNotification.postBody["headings"] = { "en" : "주식 입금 알림" };
        return this.myClient.sendNotification(stockNotification)      
        .then(response => {
            return Promise.resolve(response.data);
        })      
        .catch(function (err) {      
            console.log('Something went wrong...', err);      
        });  
    }  
}

module.exports = new OSignal();
