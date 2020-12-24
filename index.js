const puppeteer = require("puppeteer");
const chalk = require("chalk");
const fs = require("fs");
const json2csv = require("csvjson-json2csv");

const error = chalk.bold.red;
const success = chalk.keyword("green");

(async () => {
  try {
    // open the headless browser
    let browser = await puppeteer.launch({ 
      headless: true,
      dumpio: false
     });
    // open a new page
    let page = await browser.newPage();
    // enter url in page
    await page.goto(`https://www.bovada.lv/sports/basketball/college-basketball`);
    await page.waitForSelector("section.coupon-container.multiple.inline");

    let schedule = await page.evaluate(() => {
      let rowList = document.querySelectorAll("section.coupon-container.multiple.inline");
      
      let eventList = [];
      for (let i=0;i<rowList.length;i++){
        eventList[i] = {

          team1: rowList[i].querySelectorAll("h4.competitor-name")[0].innerText.trim(),
          team2: rowList[i].querySelectorAll("h4.competitor-name")[1].innerText.trim(),
          spread: rowList[i].querySelectorAll("button.bet-btn")[0].innerText.trim() + " / " + rowList[i].querySelectorAll("button.bet-btn")[1].innerText.trim(),
          total: rowList[i].querySelectorAll("button.bet-btn")[2].innerText.trim() + " / " + rowList[i].querySelectorAll("button.bet-btn")[3].innerText.trim()
        };
      }
      return eventList;
    });
    
    fs.writeFile("d1daily.csv", json2csv(schedule), (err) => {
      if (err) throw err;
      console.log("Saved!");
    });
    
    console.log(success("Browser Closed"));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
})();