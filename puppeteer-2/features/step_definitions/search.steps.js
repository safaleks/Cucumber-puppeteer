const { Given, When, Then } = require('@cucumber/cucumber');
const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const {
  selectDateTime,
  checkSeat,
  checkBuySeat,
} = require("../../lib/util.js");
const { setDefaultTimeout } = require("@cucumber/cucumber");
const { Before, After } = require("@cucumber/cucumber");
const { getText } = require("../../lib/commands.js");
setDefaultTimeout(60 * 1000);

let ticketCost;
let testMovie = "[data-seance-id='139']";
let train = "main section:nth-child(1) li:nth-child(3)";
let costVip = "main p:nth-child(6) span";
let movieTime = "[data-seance-id='129']"; // 14:00, Hercules, Movie1
let ticketHint = "h2.ticket__check-title";
let confirmingText = "Вы выбрали билеты:";

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on {string} page", async function (string) {
  return await this.page.goto(`http://qamid.tmweb.ru/client${string}`, {
    setTimeout: 20000,
  });
});

When("user select {int}-th day and movie about Train", async function (int1) {
  await selectDateTime(
    this.page,
    `nav.page-nav > a:nth-child(${int1})`,
    train
  );
});

When("user select {int}-th day and test movie", async function (int1) {
  await selectDateTime(
    this.page,
    `nav.page-nav > a:nth-child(${int1})`,
    testMovie
  );
});

When("user select {int}-th day and movie", async function (int1) {
  await selectDateTime(
    this.page,
    `nav.page-nav > a:nth-child(${int1})`,
    movieTime
  );
});

When("select and book {int} row and {int} seat", async function (int1, int2) {
  await checkSeat(this.page, int1, int2);
});

When("select, book and buy {int} row and {int} seat", async function (int1, int2) {
  await checkBuySeat(this.page, int1, int2);
});

When(
  "sees that {int} row and {int} seat is taken trying select them, but button is disabled",
  async function (int1, int2) {
      try {
      await checkSeat(this.page, int1, int2);
    } catch (error) {
      const buttonStatus = await this.page.$eval(
        ".acceptin-button",
        (el) => el.disabled
      );
      expect(buttonStatus).equal(true);
    }
  }
);

Then("user received information about ticket", async function () {
  const actual = await getText(this.page, ticketHint);
  expect(actual).contain(confirmingText);
});

Then("Book button is not active", async function () {
  const buttonStatus = await this.page.$eval(
    ".acceptin-button",
    (el) => el.disabled
  );
  expect(buttonStatus).equal(true);
});

When("remember cost vip tickets", async function(){
  ticketCost = await getText(this.page, 'main div:nth-child(1) > p:nth-child(2) > span.buying-scheme__legend-value'); //запоминаем стоимость билета
});

Then("user check price about ticket", async function () {
  actual = await getText(this.page, costVip); //запоминаем стоимость билета
  expect(actual).equal(ticketCost);
} );