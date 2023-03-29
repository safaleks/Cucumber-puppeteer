const { clickElement, getText } = require("./commands.js");

module.exports = {
    selectDateTime: async function (page, day, time) {
      await clickElement(page, day);
      await clickElement(page, time);
    },
  checkSeatIsTaken: async function (page, row, ...seats) {
    await page.waitForSelector(".buying-scheme__wrapper");
    try {
      for (let i = 0; i < seats.length; i++) {
        await page.waitForSelector(
          `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seats[i]}).buying-scheme__chair_taken`
        );
      }
    } catch (error) {
      throw new Error("Seat(s) is free");
    }
  },
  checkSeat: async function (page, row, seats) {
    await page.waitForSelector(".buying-scheme__wrapper");
    try {     
        await clickElement(
          page,
          `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seats})`
        );
        await page.waitForSelector(
          `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seats}).buying-scheme__chair_selected`
        );
        await clickElement(page, ".acceptin-button"); //бронируем место
      
    } catch (error) {
      throw new Error(`Seat(s) is taken`);
    }
},
checkBuySeat: async function (page, row, seats) {
  await page.waitForSelector(".buying-scheme__wrapper");
      
      await clickElement(
        page,
        `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seats})`
      );
      await page.waitForSelector(
        `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seats}).buying-scheme__chair_selected`
      );
      await clickElement(page, ".acceptin-button"); //бронируем место
      await clickElement(page, ".acceptin-button"); //получаем QR    
},
}