var attemps_508 = [
    {
        id: "13-20-83dcefb7",
        nota: 13,
        data: []
    },
    {
        id: "15-20-1ad5be0d",
        nota: 15,
        data: []
    },
    {
        id: "15-20-6dd28e9b",
        nota: 15,
        data: []
    },
    {
        id: "17-20-f3b61b38",
        nota: 17,
        data: []
    },
    {
        id: "19-20-1db87a14",
        nota: 19,
        data: []
    },
    {
        id: "19-20-6abf4a82",
        nota: 19,
        data: []
    },
    {
        id: "19-20-84b12bae",
        nota: 19,
        data: []
    },
    {
        id: "19-20-4f5344cd",
        nota: 19,
        data: []
    },
    {
        id: "20-20-8d076785",
        nota: 20,
        data: []
    },
    {
        id: "20-20-a15d25e1",
        nota: 20,
        data: []
    },
    {
        id: "20-20-fa005713",
        nota: 20,
        data: []
    },
    {
        id: "20-20-4f5344cd",
        nota: 20,
        data: []
    },
    {
        id: "20-20-3854745b",
        nota: 20,
        data: []
    },
    {
        id: "20-20-a630e1f8",
        nota: 20,
        data: []
    },
];
$(function () {
    attemps.forEach((attemp, key) => {
        $.getJSON(`508/${attemp.id}.json`, res => {
            attemps[key].data = res;
        })
    })
})

$(document).on('change', '#query', function() {
    var query = $(this).val();
    $('#results').empty();
    attemps.forEach(attemp => {
        attemp.data.forEach(question => {
            if (question.question == query) {
                $('#results').append(`
                <tr>
                    <td>${question.selected}</td>
                    <td> - </td>
                    <td width="0%">Sacó ${attemp.nota}</td>
                </tr>
                `);
            }
        })
    })
})