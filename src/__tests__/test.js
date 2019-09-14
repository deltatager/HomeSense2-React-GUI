const {Builder, By} = require('selenium-webdriver');
require('geckodriver');

const driver = new Builder().forBrowser('firefox').build();

it('should click on navbar button to display a drawer', async () => {
    await driver.get('https://www.google.com');

    let el = await driver.findElement(By.id('SIvCob'));
    let actual = await el.getText();
    let expected = 'Google disponible en : English';
    await driver.quit();
    expect(actual).toEqual(expected);
}, 100000);