const scrit = document.createElement("script");
scrit.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
document.head.appendChild(scrit);


var questions = [];
$('.multiple-answer-question [ng-model="assessmentQuestion.questionAttempt.question.questionText.rawText"]').each(function () {
    var question = {};
    question.question = $(this).text();
    question.selected = $(this).parents('.multiple-answer').find('.multiple-answer-answers').find('li.is-selected').find('label').find('p').text();
    question.answers = [];
    $(this).parents('.multiple-answer').find('.multiple-answer-answers').find('label').find('p').each(function () {
        var answer = $(this).text();
        question.answers.push(answer);
    });
    questions.push(question);
})
console.log(questions)

users = [
    {
        "username": "kanturin",
        "user": "1222871@senati.pe",
        "pass": "Pob01757"
    },
    {
        "username": "ESLI VICENTE CARHUACHIN CRUZ",
        "user": "1327130@senati.pe",
        "pass": "Virtual20"
    },
    {
        "username": "JOSE RAUL HEREDIA SOLANO",
        "user": "1303819@senati.pe",
        "pass": "Virtual20"
    },
    {
        "username": "JIMMY ULISIS MALPARTIDA ASIS",
        "user": "983085@senati.pe",
        "pass": "Virtual20"
    },
    {
        "username": "JENIFER SMARON LOPEZ GORA",
        "user": "1239805@senati.pe",
        "pass": "Simulacro19"
    },
    {
        "username": "DANIEL JAIME PACHECO VARGAS",
        "user": "1292844@senati.pe",
        "pass": "Virtual20"
    },
    {
        "username": "Aleshando",
        "user": "1300275@senati.pe",
        "pass": "Alex2021"
    },
    {
        "username": "Yon",
        "user": "1290272@senati.pe",
        "pass": "asucar123YON"
    },
    {
        "username": "Carlos",
        "user": "1324182@senati.pe",
        "pass": "14deMayoRN2018"
    },
    {
        "username": "becker",
        "user": "1230698@senati.pe",
        "pass": "Danielxd71126574"
    }

]
    ;
users.forEach(async (user) => {
    var req = {};
    req.username = user.user;
    req.password = user.pass;
    var res = await fetch('http://localhost:8080/qualitas/getDataBB', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })

    var data = await res.json();
    console.log(data);

});

/*

var questions = [];
$('.multiple-answer-question [ng-model="assessmentQuestion.questionAttempt.question.questionText.rawText"]').each(function() {
    var question = {};
    question.question = $(this).text();
    question.answers = [];
    $(this).parents('.multiple-answer').find('.multiple-answer-answers').find('label').find('p').each(function() {
        var answer = $(this).text();
        question.answers.push(answer);
    });
    questions.push(question);
})
console.log(questions)

$('[ng-model="assessmentQuestion.questionAttempt.question.questionText.rawText"]').each(function(){
    console.log($(this).text());
});*/