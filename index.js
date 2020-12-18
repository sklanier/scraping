const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const mySelector = 'body > bx-site > ng-component > div > sp-sports-ui > div > main > div > section > main > sp-path-event > div > sp-next-events > div > div > div.bucket__collapsableSection > div > sp-coupon > sp-multi-markets > section > section > header > sp-competitor-coupon > a > div > h4'
JSDOM.fromURL('https://www.bovada.lv/sports/basketball/college-basketball').then(dom =>{
    console.log(dom.serialize());
});