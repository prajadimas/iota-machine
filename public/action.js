(function ($) {

  var socketId = null;

  var socket = io();

  getBalance();

  socket.on("timer count", function (msg) {
    // $('#messages').append($('<li>').text(msg));
    console.log("Message: ", msg);
    $("#m" + msg.machine + "timer").html(msg.timeleft);
    if (msg.timeleft === 0) {
      $("#m" + msg.machine + "stat").html("<i class=\"fa fa-circle\" aria-hidden=\"true\" style=\"color:red\"></i>");
      $("#m" + msg.machine + "mode").html("-");
    } else {
      $("#m" + msg.machine + "stat").html("<i class=\"fa fa-circle\" aria-hidden=\"true\" style=\"color:green\"></i>");
      $("#m" + msg.machine + "mode").html(msg.mode);
    }
  });

  $("#runningForm").on("submit", function (evt) {
    evt.preventDefault();
    if ($("#inputAmount").val()) {
      var timeRunning = 0;
      var inputMode = $("#inputMode").val();
      // console.log("Input Mode: ", inputMode);
      var runningMachine = $("#machineNum").val();
      var runningAmount = $("#inputAmount").val();
      if (inputMode === "1" || inputMode === "4" || inputMode === "7") {
        timeRunning = Number(Number(runningAmount)) * 60;
      } else if (inputMode === "2" || inputMode === "5" || inputMode === "6") {
        timeRunning = Number(Number(runningAmount)/2) * 60;
      } else if (inputMode === "3") {
        timeRunning = Number(Number(runningAmount)/0.5) * 60;
      } else {
        timeRunning = 0;
      }
      $("#amount").html(Number($("#amount").html()) + Number(runningAmount));
      var data = {};
      timeRunning === 0 ? data = {} : data = { m: runningMachine, t: timeRunning, a: Number(runningAmount), o: inputMode };
      console.log("Data: ", data);
      // console.log("#m" + runningMachine + "stat");
      $("#m" + runningMachine + "mode").html(inputMode);
      if (timeRunning === 0) {
        $("#m" + runningMachine + "mode").html("-");
      } else {
        $.ajax({
          url: "/api",
          type: "POST",
          data: data,
          // dataType: 'application/json', // what type of data do we expect back from the server
          contentType: "application/x-www-form-urlencoded",
          encode: true,
          success: function (res) {
            console.log("RESULT: ", res);
            if (res.message === 'OK') {
              $("#m" + res.machine + "stat").html("<i class=\"fa fa-circle\" aria-hidden=\"true\" style=\"color:red\"></i>");
              $("#m" + res.machine + "timer").html(res.timeleft);
            } else {
              getBalance();
              Swal.fire({
                text: res.message,
                icon: "error"
              });
            }
          },
          error: function (err) {
            console.error(err);
          }
        });
      }
    } else {
      Swal.fire({
        text: "Amount must be set",
        icon: "error"
      });
    }

  });

})(jQuery);

function getBalance() {
  $.ajax({
    url: "/api/bal",
    type: "GET",
    success: function (res) {
      console.log("RESULT: ", res);
      $("#amount").html(res.bal);
    },
    error: function (err) {
      console.error(err);
    }
  });
}
