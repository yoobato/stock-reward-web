const config = require('config');
const { Client, Notification } = require('onesignal-node');

class OneSignal {
    constructor() {
        this.client = new Client(config.get('onesignal'));
    }

    sendStockRewardReceiveNotification(stock, amount) {
        let notification = new Notification({
            contents: {
                en: `📈 ${stock.name} 주식을 ${amount}주 받았습니다!`
            }
        });
        notification.postBody['included_segments'] = ['Active Users'];
        notification.postBody['headings'] = { 'en': '주식리워드 알림' };
        
        return this.client.sendNotification(notification).then(response => {
            return Promise.resolve(response.data);
        }).catch(err => {
            console.log(`[OneSignal] 오류: ${err}`);
        });
    }
}

module.exports = new OneSignal();
