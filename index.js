const TeleBot = require('telebot');
const bot = new TeleBot('567021299:AAGAi1GtVk-H0N5uI1OfhojwlgQNzHF956A');

var request = require('request');

var urlBittrex = 'https://bittrex.com/api/v1.1/public/getticker?market=';
var urls = [{
        pair: 'RUB-GBG',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-GBG',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-GOLOS',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-GOLOS',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-ETH',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-ETH',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-LTC',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LTC',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-DASH',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-DASH',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-MAID',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-MAID',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-GRC',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-GRC',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-STEEM',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-STEEM',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-WAVES',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-WAVES',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-LSK',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LSK',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-SBD',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-SBD',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-DOGE',
        url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-DOGE',
        birga: 'bittrex'
    },
    {
        pair: 'RUB-BTS',
        url: 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_BTS&depth=1',
        birga: 'poloniex'
    }
];

var whiteList = [
    377734637, //Смирнов Дмитрий
    202278966, //Красношапка Виталий
    344487166, //Юрий
    461500422 //Шорохов Егор
];

var result = [];

var complite = 0;

bot.start();

bot.on('/start', (msg, match) => {
    let replyMarkup = bot.keyboard([
        ['Курсы валют']
    ], {
        resize: true
    });

    return bot.sendMessage(msg.from.id, 'Нажмите кнопку "Курсы валют"', {
        replyMarkup
    });
});

bot.on('text', msg => {
    console.log(`message ${msg.text}`);
    request.get('https://api.exmo.com/v1/order_book/?pair=BTC_RUB&limit=1', (err, response, body) => {
        complite = 0;
        result = [];
        console.log(`message ${response.statusCode} / ${err}`);

        if (!err && response.statusCode == 200) {
            let course = parseFloat(JSON.parse(body).BTC_RUB.bid_top);
            console.log(`RUB-BTC: ${course.toFixed(2)}`);
            result.push('RUB-BTC: ' + course.toFixed(2));
            urls.forEach(pair => {
                request.get(pair.url, function (error, response, body) {
                    console.log(complite);
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
                                return ot.sendMessage(msg.from.id, r);
                            }
                        } catch (err) {
                            result.push(pair.pair + ': ОШИБКА!');
                            complite++;
                        }


                    } else {
                        result.push(pair.pair + ': ОШИБКА!');
                        complite++;
                        return bot.sendMessage(msg.from.id, 'Ошибка получения курса' + url.pair);
                    }
                });

            });
        }
        else 
            return bot.sendMessage(msg.from.id, `Ошибка ${err}` + url.pair);

    });
});