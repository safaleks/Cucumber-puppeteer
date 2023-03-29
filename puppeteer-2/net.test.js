const { clickElement, getText } = require("./lib/commands.js");
const {checkSeat, checkSeatIsTaken} = require("./lib/util");

let page;

beforeEach(async () => {
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto("http://qamid.tmweb.ru/client/index.php", {
            timeout: 30000,
        });
});

afterEach(() => {
    page.close();
});

describe("Booking tickets", () => {

    test("Should choose one seat", async () => { 
        await clickElement(page, 'body > nav > a:nth-child(2)');  //выбираем день "завтра"
        await clickElement(page, "[data-seance-start='1140']");  //выбираем сеанс
        await checkSeat(page, 1, 3); //выбираем место
        

        const text = await getText(page, "h2.ticket__check-title");
        expect(text).toContain("Вы выбрали билеты"); //получаем информацию по выбранным билетам
    }, 60000);

    test("Should choose one VIP seat", async () => {
        await clickElement(page, 'body > nav > a:nth-child(2)');  //выбираем день "завтра"
        await clickElement(page, "main section:nth-child(1) li:nth-child(3)"); //выбираем сеанс
        await checkSeat(page, 2, 2); //выбираем место
        const costVip = await getText(page, 'main div:nth-child(1) > p:nth-child(2) > span.buying-scheme__legend-value'); //запоминаем стоимость билета

        const actual = await getText(page, "main p:nth-child(6) ");
        expect(actual).toContain(costVip); // проверяем что стоимость соответствует VIP-месту
    }, 60000);

    test("Should don't booking ordering seat already", async () => { // возможно не пройдет если билет не был куплен билет
      await clickElement(page, "main section:nth-child(2) div:nth-child(3) a"); //выбираем сеанс
      await checkSeatIsTaken(page, 2, 2); // выбираем купленное место

      const isDisabled = await page.$eval("button", (button) => button.disabled);
      expect(isDisabled).toEqual(true); // проверяем состояние кнопки
  }, 60000);

});