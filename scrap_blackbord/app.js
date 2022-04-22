
const cors = require('cors');
//var data = require('./src/routes/database');
const setup = require('./src/routes/setup');
const logeo = require('./src/routes/logeo');
const request = require('request');
const { xml } = require('cheerio/lib/static');

// datos de entrada 
var _courses = ['_181010_1', '_180499_1', '_181004_1', '_181013_1']
var url = 'https://senati.blackboard.com/ultra/courses/';
var _url = '/grades';
var id = '_181010_1';
var semester = 5;
//var exam = 'Autoevaluación T03'
var credentials = { "user": "1300275@senati.pe", "password": "Alex2021" };

async function app() {
    const browser = await setup();
    var page = await browser.newPage();
    var plataform = await logeo(page, credentials);

    console.log('    ⤷ Se a iniciado sesión en BLACKBOARD ↻');
    await plataform.waitForResponse('https://senati.blackboard.com/learn/api/v1/streams/ultra');
    await plataform.evaluate(function () {

        const scrit = document.createElement("script");
        scrit.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
        document.head.appendChild(scrit);
    })
    // obtencion de datos del alumno
    /*
    async function semester_() {
        console.log('⤷ Obteniendo semestre ↻')
        var _semester = await plataform.evaluate(function () {
            var bloques = [];
            $('#courses-terms > li').each(function () {
                var bloque = {};
                var texto = $(this).text();
                if (texto.includes('-')) {
                    var array = texto.split('-');
                    bloque.id = array[0].trim();
                    bloque.name = array[1].trim();
                    bloques.push(bloque);
                }
            });
            var sm = bloques.length + 1;
            return sm;
        })
        console.log(_semester);
        return _semester;
    }

    var semester = await semester_();
    */

    async function user_dat() {
        console.log('    ⤷ Obteniendo Informacion de la cuenta ↻')
        var bud = await browser.newPage()
        await bud.goto('https://senati.blackboard.com/ultra/profile');

        await bud.waitForResponse('https://senati.blackboard.com/learn/api/v1/streams/ultra');

        var data_ = await bud.evaluate(function () {
            var data = {};
            var name = $('.account-snapshot.columns.small-12.text-center bb-ui-username bdi').text();
            var phone = $(' li [ng-if="baseProfile.userCanEditPhoneNumber()"] bdi').text();
            data.name = name;
            data.phone = phone;
            //console.log(data)
            return data;
        })
        return data_;
    }

    var data_user = await user_dat();
    console.log(data_user)

    await plataform.goto(url + id + _url);
    await plataform.waitForSelector('.grades-list');

    async function get_ex() {
        var _nex = await plataform.evaluate(function () {
            var nex = [];
            var nexfn = {};
            $('.bb-click-target').each(function () {
                var exm = $(this).text();
                console.log(exm);
                if (exm.toLowerCase().indexOf('Autoevaluación'.toLowerCase()) == 0) {
                    nex.push($(this).text())
                }
                if (exm.toLowerCase().indexOf('Examen Final'.toLowerCase()) == 0) {
                    console.log($(this).text());
                    nex.push($(this).text())
                }
            })
            console.log(nex)
            return nex;
        })
        return _nex;
    }
    var __nex = await get_ex();
    console.log(__nex);

    var url_ = await plataform.evaluate(function () {
        var url = window.location.href;
        console.log(url)
        return url;

    })

    var _examen = []
    for (var i = 0; i < __nex.length; i++) {
        var __ex = await open_ex(__nex[i], url_)
        for (var h = 0; h < __ex.length; h++) {
            _examen.push(__ex[h]);
        }
    }

    async function open_ex(exam, url) {

        let plataform = await browser.newPage();
        await plataform.setViewport({ width: 1200, height: 1000 });
        await plataform.goto(url);

        await plataform.waitForResponse('https://senati.blackboard.com/learn/api/v1/streams/ultra')
        await plataform.waitForSelector('.bb-click-target');
       // await plataform.waitForTimeout(1000);
        // ingresamos al excamen selecionado
        await plataform.evaluate(function (exam) {
            console.log(exam);
            $('.bb-click-target').each(function () {
                if ($(this).text() == exam) {
                    $(this).click();

                }
            })
        }, exam);

        await plataform.waitForSelector('.has-link.js-attempt-posted')
       // await plataform.waitForTimeout(500);
        await plataform.evaluate(function () {
            $('.has-link.js-attempt-posted').click();
        });

        await plataform.waitForSelector('.multiple-attempts-list li .grade-input-display.grade-ellipsis bdi');
       // await page.waitForTimeout(1000);


        // obtenemos la cantidad de intentos echos y la url actual
        var urls = await plataform.evaluate(function () {
            var urls = {};
            var pr = '';
            var url = window.location.href;
            $('.multiple-attempts-list li').each(function () {
                $(this).find('.grading-bar').find('a').find('.name.ellipsis').find('bdi').each(function () {
                    pr = $(this).text();
                });
            });
            urls.cant = pr;
            urls.url = url;
            return urls
        });

        // hacemos un recorrido y sacado de datos de cada uno de los examenes
        var examen = [];
        for (var i = 1; i <= parseInt(urls.cant); i++) {
            var dat = await open_tab(urls.url, i, browser, exam);
            examen.push(dat)
        }

        return examen;

    }


    function sha256(s) {
        var chrsz = 8;
        var hexcase = 0;
        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
        function S(X, n) {
            return (X >>> n) | (X << (32 - n));
        }
        function R(X, n) {
            return (X >>> n);
        }
        function Ch(x, y, z) {
            return ((x & y) ^ ((~x) & z));
        }
        function Maj(x, y, z) {
            return ((x & y) ^ (x & z) ^ (y & z));
        }
        function Sigma0256(x) {
            return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
        }
        function Sigma1256(x) {
            return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
        }
        function Gamma0256(x) {
            return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
        }
        function Gamma1256(x) {
            return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
        }
        function core_sha256(m, l) {
            var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
            var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
            var W = new Array(64);
            var a, b, c, d, e, f, g, h, i, j;
            var T1, T2;
            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;
            for (var i = 0; i < m.length; i += 16) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];
                for (var j = 0; j < 64; j++) {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }
                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }
        function str2binb(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
            }
            return bin;
        }
        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }
        function binb2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
            }
            return str;
        }
        s = Utf8Encode(s);
        return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
    }
    async function open_tab(url, ex, browser, exam) {
        let plataform = await browser.newPage();
        await plataform.setViewport({ width: 1200, height: 1000 });
        await plataform.goto(url);
        await plataform.waitForSelector('.attempt-grading-bar-inner.child-is-invokable');
        var attemps = [];
        var course = await plataform.evaluate(function (ex) {
            var course = '';
            $('.multiple-attempts-list li').each(function () {
                course = $('.sr-only.js-sr-only-header-text').text();
                var nx = $(this).find('.grading-bar').find('a').find('.name.ellipsis').find('bdi').text();
                if (nx == ex) {
                    $(this).find('a').click();
                }
            });
            return course;
        }, ex)
        await plataform.waitForSelector('.question-list li bb-assessment-question .question-header.question-header-review.has-question-title.is-read-only');

        var questions = await plataform.evaluate(function () {
            function sha256(s) {
                var chrsz = 8;
                var hexcase = 0;
                function safe_add(x, y) {
                    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return (msw << 16) | (lsw & 0xFFFF);
                }
                function S(X, n) {
                    return (X >>> n) | (X << (32 - n));
                }
                function R(X, n) {
                    return (X >>> n);
                }
                function Ch(x, y, z) {
                    return ((x & y) ^ ((~x) & z));
                }
                function Maj(x, y, z) {
                    return ((x & y) ^ (x & z) ^ (y & z));
                }
                function Sigma0256(x) {
                    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
                }
                function Sigma1256(x) {
                    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
                }
                function Gamma0256(x) {
                    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
                }
                function Gamma1256(x) {
                    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
                }
                function core_sha256(m, l) {
                    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
                    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
                    var W = new Array(64);
                    var a, b, c, d, e, f, g, h, i, j;
                    var T1, T2;
                    m[l >> 5] |= 0x80 << (24 - l % 32);
                    m[((l + 64 >> 9) << 4) + 15] = l;
                    for (var i = 0; i < m.length; i += 16) {
                        a = HASH[0];
                        b = HASH[1];
                        c = HASH[2];
                        d = HASH[3];
                        e = HASH[4];
                        f = HASH[5];
                        g = HASH[6];
                        h = HASH[7];
                        for (var j = 0; j < 64; j++) {
                            if (j < 16) W[j] = m[j + i];
                            else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                            T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                            T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                            h = g;
                            g = f;
                            f = e;
                            e = safe_add(d, T1);
                            d = c;
                            c = b;
                            b = a;
                            a = safe_add(T1, T2);
                        }
                        HASH[0] = safe_add(a, HASH[0]);
                        HASH[1] = safe_add(b, HASH[1]);
                        HASH[2] = safe_add(c, HASH[2]);
                        HASH[3] = safe_add(d, HASH[3]);
                        HASH[4] = safe_add(e, HASH[4]);
                        HASH[5] = safe_add(f, HASH[5]);
                        HASH[6] = safe_add(g, HASH[6]);
                        HASH[7] = safe_add(h, HASH[7]);
                    }
                    return HASH;
                }
                function str2binb(str) {
                    var bin = Array();
                    var mask = (1 << chrsz) - 1;
                    for (var i = 0; i < str.length * chrsz; i += chrsz) {
                        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
                    }
                    return bin;
                }
                function Utf8Encode(string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";
                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);
                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        }
                        else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                        else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                    }
                    return utftext;
                }
                function binb2hex(binarray) {
                    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                    var str = "";
                    for (var i = 0; i < binarray.length * 4; i++) {
                        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                    }
                    return str;
                }
                s = Utf8Encode(s);
                return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
            }

            var questions = {};
            var data = [];
            var grade = $('.multiple-submissions-grading-bar.attempt-grading-bar bb-display-grade-pill bdi').text();

            $('.question-list li bb-assessment-question .question-header.question-header-review.has-question-title.is-read-only').each(function () {
                var question = {};
                var selected = $(this).parent().find('.question-content').find('.multiple-answer-answers-container').find('li.is-selected').find('p').text().replaceAll(" ", "");
                var status = false;
                var _status = $(this).find('bb-svg-icon').attr('aria-label');
                if (_status == "Correcta") {
                    status = true;
                }
                var id = $(this).parent().find('.question-content').find('.multiple-answer-question').find('p').text();
                question.id = sha256(id);
                question.question = $(this).parent().find('.question-content').find('.multiple-answer-question').find('p').text();
                question.selected = sha256(selected);
                question.status = status;
                question.answers = [];


                $(this).parent().find('.question-content').find('.multiple-answer-answers-container').find('label').find('p').each(function () {
                    var answer = {};
                    var id = $(this).text();
                    var answers = $(this).text();
                    answer.id = sha256(id);
                    answer.answer = answers;
                    question.answers.push(answer);
                });

                console.log(status);
                data.push(question);

            });

            questions.data = data;
            questions.grade = grade;
            console.log(questions)
            return questions;
        })

        var attemp = {}
        attemp.id = id;
        attemp.course = course;
        attemp.practice = exam;
        attemp.test = ex;
        attemp.grade = questions.grade;
        attemp.data = questions.data;
        attemps = attemp;

        return attemps;
    }

    var request = {};
    request.user = credentials.user;
    request.password = sha256(credentials.password);
    request.name = data_user.name;
    request.phone = data_user.phone;
    request.semester = semester;
    request.attemps = _examen;
    console.log(JSON.stringify(request));

}
app();


