const puppeteer = require("puppeteer");
const chalk = require("chalk");
var fs = require("fs");

const error = chalk.bold.red;
const success = chalk.keyword("green");

(async () => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: true });
    // open a new page
    var page = await browser.newPage();
    // enter url in page
    await page.goto(`https://www.bovada.lv/sports/basketball/college-basketball`);
    await page.waitForSelector("div.competitors");

    var schedule = await page.evaluate(() => {
      var teamList = document.querySelectorAll(`span.name`);
      var spreadList = document.querySelectorAll(`span.market-line.bet-handicap`);
      var gamesArray = [];
      for (var i = 0; i < teamList.length; i++) {
        gamesArray[i] = {
          game: teamList[i].innerText.trim(),
          spread: spreadList[i].innerText.trim()
        };
      }
      return gamesArray;
    });
    await browser.close();
    
    fs.writeFile("d1daily.json", JSON.stringify(schedule), function(err) {
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