const TeleBot = require('telebot');

// Включить опрос сервера
const bot = new TeleBot('567021299:AAGAi1GtVk-H0N5uI1OfhojwlgQNzHF956A');

var request = require('request');

var replyOptions = {
    reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: false,
        keyboard: [
            [
                { text: 'Курсы валют' },
                { text: 'Валюты EXMO' }
            ]
        ],
    },
};

var urlBittrex = 'https://bittrex.com/api/v1.1/public/getticker?market=';
var urls = [
    { pair: 'RUB-GBG', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-GBG', birga: 'bittrex' },
    { pair: 'RUB-GOLOS', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-GOLOS', birga: 'bittrex' },
    { pair: 'RUB-ETH', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-ETH', birga: 'bittrex' },
    { pair: 'RUB-LTC', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LTC', birga: 'bittrex' },
    { pair: 'RUB-DASH', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-DASH', birga: 'bittrex' },
    { pair: 'RUB-MAID', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-MAID', birga: 'bittrex' },
    { pair: 'RUB-GRC', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-GRC', birga: 'bittrex' },
    { pair: 'RUB-STEEM', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-STEEM', birga: 'bittrex' },
    { pair: 'RUB-WAVES', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-WAVES', birga: 'bittrex' },
    { pair: 'RUB-LSK', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LSK', birga: 'bittrex' },
    { pair: 'RUB-SBD', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-SBD', birga: 'bittrex' },
    { pair: 'RUB-DOGE', url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-DOGE', birga: 'bittrex' },
    { pair: 'RUB-BTS', url: 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_BTS&depth=1', birga: 'poloniex' }
]

var whiteList = [
    377734637,          //Смирнов Дмитрий
    202278966,          //Красношапка Виталий
    344487166,          //Юрий
    461500422           //Шорохов Егор
];

var result = [];

var complite = 0;

bot.start();


bot.on(/\/start/, function (msg, match) {
    let replyMarkup = bot.keyboard([
        ['/buttons', '/inlineKeyboard'],
        ['/start', '/hide']
    ], {resize: true});

    return bot.sendMessage(msg.from.id, 'Keyboard example.', {replyMarkup});
});


bot.on('message', function onCallbackQuery(msg) {
    date = new Date(1000 * msg.date);
    console.log('from: id:', msg.from.id, ' name: ', msg.from.last_name + ' ' + msg.from.first_name, ' time: ', date);
    if (whiteList.indexOf(msg.from.id) == -1) {
        console.log(msg.from.id,': access denied');
        bot.sendMessage(msg.from.id, "Курсы с биржи предоставляются по подписке.");
    }
    else {

        if (msg.text == "Курсы валют") {
            request.get('https://api.exmo.com/v1/order_book/?pair=BTC_RUB&limit=1', function (error, response, body) {
                complite = 0;
                result = [];

                if (!error && response.statusCode == 200) {
                    let course = parseFloat(JSON.parse(body).BTC_RUB.bid_top);
                    result.push('RUB-BTC: ' + course.toFixed(2));
                    urls.forEach(pair => {
                        request.get(pair.url, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                bxJSON = JSON.parse(body);

                                try {
                                    if (pair.birga == 'bittrex')
                                        r = parseFloat(bxJSON.result.Bid);
                                    else {
                                        r = parseFloat(bxJSON.bids[0][0]);
                                    }

                                    result.push(pair.pair + ': ' + (r * course).toFixed(2));
                                    complite++;
                                    if (complite == urls.length) {
                                        let r = '';
                                        result.sort().forEach(item => {
                                            r = r + item + '\n';
                                        });
                                        bot.sendMessage(msg.from.id, r);
                                    }
                                } catch (error) {
                                    result.push(pair.pair + ': ОШИБКА!');
                                    complite++;
                                }


                            }
                            else {
                                result.push(pair.pair + ': ОШИБКА!');
                                complite++;
                                bot.sendMessage(msg.from.id, 'Ошибка получения курса' + url.pair);
                            }
                        })

                    })


                }
                else {
                    bot.sendMessage(msg.from.id, 'Ошибка получения курса BTC->RUB');
                }
            })
        }
        else if (msg.text == "Валюты EXMO") {
            request.get('https://api.exmo.com/v1/currency', function (error, response, body) {
                res = JSON.parse(body);
                r = '';
                res.sort().forEach(item => {
                    r = r + item + '\n';
                });
                bot.sendMessage(msg.from.id, r);
            })

        }
        else {
            bot.sendMessage(msg.from.id, 'Я не понимаю это сообщение');
        }
    }


});

