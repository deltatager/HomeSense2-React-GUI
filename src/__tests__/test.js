const {Builder, By} = require('selenium-webdriver');

const driver = new Builder()
    .forBrowser('firefox')
    .usingServer('http://192.168.11.18:4444/wd/hub')
    .build();

it('Changing google.com language', async () => {
    await driver.get('https://www.google.com');

    await driver.findElement(By.id('SIvCob')).findElement(By.css('a')).click();
    let actual = await driver.findElement(By.id('SIvCob')).getText();
    let expected = 'Google disponible en : English';
    await driver.quit();
    expect(actual).toEqual(expected);
}, 100000);