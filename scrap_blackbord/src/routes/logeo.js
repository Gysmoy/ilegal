async function logueo(page, credentials) {
    var start_messages = [];
    
    await page.goto('https://senati.blackboard.com/auth-saml/saml/login?apId=_242_1&redirectUrl=https%3A%2F%2Fsenati.blackboard.com%2Fultra');
    await page.waitForResponse(response => {
        return response.url().includes('signin-options');
    });
    start_messages.push('BlackBoard cargó correctamente');
    start_messages.push('Ingresando usuario');
    await page.type('#i0116', credentials.user);
    await page.click('#idSIButton9');

    await page.waitForResponse(response => {
        return response.url().includes('arrow_left');
    });

    start_messages.push('Ingresando contraseña');
    await page.type('#i0118', credentials.password);
    await page.click('#idSIButton9');
    
    start_messages.push('Confirmando caché de navegador');
    await page.waitForTimeout(2000);
    await page.click('#idBtn_Back');

    await page.waitForResponse('https://senati.blackboard.com/learn/api/v1/streams/ultra');
    start_messages.push('BlackBoard ultra cargó correctamente');

    console.table(start_messages);
    return page;
}

module.exports = logueo;