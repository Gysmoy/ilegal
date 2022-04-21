async function logueo(page, credentials) {
    await page.goto('https://senati.blackboard.com/auth-saml/saml/login?apId=_242_1&redirectUrl=https%3A%2F%2Fsenati.blackboard.com%2Fultra');

    console.log('    ⤷ Iniciando sesión en BLACKBOARD ↻');
   // console.log(credentials)

    await page.waitForSelector('#i0116');
    await page.type('#i0116', credentials.user);
    await page.keyboard.press('Enter');
    await page.waitForSelector('#i0118');
    await page.waitForTimeout(1500);
    await page.type('#i0118', credentials.password);
    await page.waitForTimeout(1500);
    await page.keyboard.press('Enter');
    //await page.waitForTimeout(2000);
    await page.waitForSelector('.win-button.button_primary.button.ext-button.primary.ext-primary')
    await page.keyboard.press('Enter');
    return page;
}
module.exports = logueo;