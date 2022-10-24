var attemps = {};

function getData(course) {
    attemps[`_${course}`].forEach((attemp, key) => {
        $.getJSON(`${course}/${attemp.id}.json`, res => {
            attemps[`_${course}`][key].data = res;
            attemps[`_${course}`][key].nota = attemp.id.substr(0, 2);
        })
    })
}

$(function () {
    $('#examen').trigger('change');
})

$(document).on('change', '#examen', async function () {
    let id = new Date().getTime();
    var url = './prueba.php?course={course.id}';
    if (location.host != 'localhost') {
        url = './assets/sources/{course.id}.json?v=' + id;
    }
    var res = await fetch(url.replace('{course.id}', $(this).val()));
    var data = await res.json();
    attemps[`_${$(this).val()}`] = data;
    getData($(this).val());
})

$(document).on('change', '#query', function () {
    var query = $(this).val();
    var examen = $('#examen').val();
    $('#results tbody').empty();
    attemps[`_${examen}`].forEach(attemp => {
        attemp.data.forEach(question => {
            if (
                question.question.replaceAll(' ', '').replaceAll('\n', '')
                ==
                query.replaceAll(' ', '').replaceAll('\n', '')
            ) {
                $('#results tbody').append(`
                <tr>
                    <td>${attemp.id}</td>
                    <td id="attemp_${attemp.id}">
                        <b class="question"></b></br>
                        <span class="answer"></span>
                    </td>
                    <td width="0%">${attemp.nota}</td>
                    <td>${question.correct ?? 'Indefinido'}</td>
                </tr>
                `);

                $(`#attemp_${attemp.id} .question`).text(question.question);
                $(`#attemp_${attemp.id} .answer`).text(question.selected);
            }
        })
    })
})