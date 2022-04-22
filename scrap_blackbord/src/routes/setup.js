const puppeteer = require('puppeteer');
const fs = require('fs');

async function setup() {
    console.log('    ⤷ Inicializando navegador Chromium ↻');
    
    // Obteniendo configuración para navegar
    try {
        var launchConfig = JSON.parse(fs.readFileSync('./json/launch.json', 'utf8'));
    } catch (error) {
        var launchConfig = {
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage=true',
                '--disable-accelerated-2d-canvas=true',
                '--disable-gpu',
            ]
        };
    }

    // Abriendo un navegador
    const browser = await puppeteer.launch(launchConfig);
    console.log('    ⤷ Chromium listo para navegar ✓');
    
    // Eliminando el idBrowser por si se desconecta
    //browser.on('disconnected', function() {
    //    destroy(idBrowser);
    //});

    // Retornando el idBrowser para proximos usos de idBrowser
    return browser;
}
module.exports = setup;