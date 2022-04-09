var attemps = {
    _508: [
        { id: "13-20-83dcefb7" },
        { id: "15-20-1ad5be0d" },
        { id: "15-20-6dd28e9b" },
        { id: "17-20-f3b61b38" },
        { id: "19-20-1db87a14" },
        { id: "19-20-6abf4a82" },
        { id: "19-20-84b12bae" },
        { id: "19-20-4f5344cd" },
        { id: "20-20-8d076785" },
        { id: "20-20-a15d25e1" },
        { id: "20-20-fa005713" },
        { id: "20-20-4f5344cd" },
        { id: "20-20-3854745b" },
        { id: "20-20-a630e1f8" },
        { id: "20-20-d137d16e" },
    ],
    _509: [
        { id: "17-20-1ad5be0d" },
        { id: "17-20-83dcefb7" },
        { id: "18-20-6dd28e9b" },
        { id: "18-20-f3b61b38" },
        { id: "19-20-1db87a14" },
        { id: "19-20-6abf4a82" },
        { id: "19-20-84b12bae" },
        { id: "19-20-a15d25e1" },
        { id: "19-20-d137d16e" },
        { id: "20-20-8d076785" },
        { id: "20-20-a15d25e1" },
        { id: "20-20-fa005713" },
        { id: "20-20-3854745b" },
    ]
};

function getData(course) {
    attemps[`_${course}`].forEach((attemp, key) => {
        $.getJSON(`${course}/${attemp.id}.json`, res => {
            attemps[`_${course}`][key].data = res;
            attemps[`_${course}`][key].nota = attemp.id.substr(0, 2);
        })
    })
}

$(function () {
    getData($('#examen').val());
})

$(document).on('change', '#examen', function () {
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
                    <td id="${attemp.id}"></td>
                    <td width="0%">${attemp.nota}</td>
                </tr>
                `);
                $(`#${attemp.id}`).text(question.selected);
            }
        })
    })
})