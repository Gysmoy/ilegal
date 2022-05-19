$('#send').click(function () {
  var user = $('#user').val();
  var pass = $('#pass').val();
  var request = {};
  request.username = user;
  request.password = pass;

  //var data_ =  JSON.parse(data)
 // console.log(data);

  $.ajax({
    type: "POST",
    url: "http://34.102.135.155/qualitas/getDataBB",
    data: request,
    dataType: "JSON",
    success: function (data) {
    
      $.ajax({
        type: "POST",
        url: "http://localhost:8085/ilegal/ajax/api.php",
        data:data,
       // contentType: "application/json",
        dataType: "JSON",
        success: function ( data) {

        }
      });
     // console.log(data)
    }
  });

});