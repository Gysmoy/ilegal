$('#send').click(function () { 
  var user = $('#user').val();
  var pass = $('#pass').val();
  var request = {};
  request.username = user;
  request.password = pass;

  $.ajax({
      type: "POST",
      url: "http://34.102.135.155/qualitas/getDataBB",
      data: request,
      dataType: "JSON",
      success: function (data) {
          console.log(data)
      }
  });
    
});