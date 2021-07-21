var machine = [1,2,3,4,5];
var mObj = [];
var usingTimer = null;
var socketId = null;
var mReady = [false,false,false,false,false];

(async function ($) {

  // var worker = new Worker('worker.js');
  var socket = io();
  var currency = await getCurrencies();
  console.log("Currency", currency);
  // console.log(mObj);

  // getBalance();
  // getCurrencies();
  getMachineAddress();

  $.each(machine, function (i, val) {
    // console.log(i, val);

    document.getElementById("m" + val + "butt").disabled = true;

    mObj.push({
      idx: val,
      bal: 0.0,
      mode: 4,
      timer: 0
    })

    $("#inputMode" + val).on("change", function (evt) {
      // var inputMode1 = $("#inputMode1").val();
      mObj[i].mode = Number($("#inputMode" + val).val());
      console.log("Mode Machine (" + val + ")", mObj[i].mode);
    })

    socket.on("m" + val + "bal", function (msg) {
      console.log("Message: ", msg);
      mObj[i].bal += Number(msg.bal);
      $("#m" + val + "bal").html("<center>" + (mObj[i].bal/1000000.0).toFixed(3).toString() + " MIOTA</center>");
      document.getElementById("m" + val + "butt").disabled = false;
    });

    $("#m" + val + "butt").on("click", function (evt) {
      evt.preventDefault();
      console.log("Butt Value", $("#m" + val + "butt").val());
      if ($("#m" + val + "butt").val() === "0") {
        usingTimer = setInterval(function () {
          machineTimer(val, mObj[i].bal, mObj[i].mode, currency)
        }, 1000);
        $("#m" + val + "butt").val("1");
        $("#m" + val + "butt").removeClass("btn-primary");
        $("#m" + val + "butt").addClass("btn-danger");
        $("#m" + val + "butt").html("STOP");
        $("#m" + val + "stat").html("<center><i class=\"fa fa-circle\" aria-hidden=\"true\" style=\"color:green\"></i></center>");
      } else {
        clearInterval(usingTimer);
        $("#m" + val + "butt").val("0");
        $("#m" + val + "butt").removeClass("btn-danger");
        $("#m" + val + "butt").addClass("btn-primary");
        $("#m" + val + "butt").html("START");
        $("#m" + val + "stat").html("<center><i class=\"fa fa-circle\" aria-hidden=\"true\" style=\"color:red\"></i></center>");
      }

      // machineTimer(val, mObj[val].bal, mObj[val].mode, currency);
    });

  });

  var checkBal1 = setInterval(() => {
    console.log('checking every 30s');
    mReady[0] ? socket.emit('mbal1', { m: 1 }) : true;
  }, 30000);

  var checkBal2 = setInterval(() => {
    console.log('checking every 30s');
    mReady[1] ? socket.emit('mbal2', { m: 2 }) : true;
  }, 30000);

  var checkBal3 = setInterval(() => {
    console.log('checking every 30s');
    mReady[2] ? socket.emit('mbal3', { m: 3 }) : true;
  }, 30000);

  var checkBal4 = setInterval(() => {
    console.log('checking every 30s');
    mReady[3] ? socket.emit('mbal4', { m: 4 }) : true;
  }, 30000);

  var checkBal5 = setInterval(() => {
    console.log('checking every 30s');
    mReady[4] ? socket.emit('mbal5', { m: 5 }) : true;
  }, 30000);

  // $("#inputMode1").on("change", function (evt) {
    // var inputMode1 = $("#inputMode1").val();

  // })

  /**
   *

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

  $("#machineNum").on("change", function (evt) {
    var machineSelected = $("#machineNum").val();
    $.ajax({
      url: "/api/address?m=" + machineSelected.toString(),
      type: "GET",
      success: function (res) {
        // console.log("RESULT: ", res);
        $("#m-addr").html(res.addr);
        document.getElementById("qr-addr").src = res.url;
      },
      error: function (err) {
        console.error(err);
      }
    });
  })

  $("#inputMode").on("change", function (evt) {
    var inputMode = $("#inputMode").val();
    $.ajax({
      url: "/api/cur",
      type: "GET",
      success: function (res) {
        console.log("RESULT: ", res);
        // $("#amount").html(res.eur);
        if (inputMode === "1" || inputMode === "4" || inputMode === "7") {
          // timeRunning = Number(Number(runningAmount)) * 60;
          $("#inputAmount").val((Math.ceil((1.0/Number(res.eur)) * 1000 * 1000000)/1000).toString());
        } else if (inputMode === "2" || inputMode === "5" || inputMode === "6") {
          // timeRunning = Number(Number(runningAmount)/2) * 60;
          $("#inputAmount").val((Math.ceil((2.0/Number(res.eur)) * 1000 * 1000000)/1000).toString());
        } else if (inputMode === "3") {
          // timeRunning = Number(Number(runningAmount)/0.5) * 60;
          $("#inputAmount").val((Math.ceil((0.5/Number(res.eur)) * 1000 * 1000000)/1000).toString());
        } else {
          // timeRunning = 0;
          $("#inputAmount").val(0);
        }
      },
      error: function (err) {
        console.error(err);
      }
    });
  })

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

   *
   */

})(jQuery);


function getMachineAddress() {
  $.ajax({
    url: "/api/address?m=1",
    type: "GET",
    success: function (res) {
      // console.log("RESULT: ", res);
      $("#m1addr").html(res.addr);
      document.getElementById("qr1addr").src = res.url;
      mReady[0] = true;
    },
    error: function (err) {
      console.error(err);
    }
  });
  $.ajax({
    url: "/api/address?m=2",
    type: "GET",
    success: function (res) {
      // console.log("RESULT: ", res);
      $("#m2addr").html(res.addr);
      document.getElementById("qr2addr").src = res.url;
      mReady[1] = true;
    },
    error: function (err) {
      console.error(err);
    }
  });
  $.ajax({
    url: "/api/address?m=3",
    type: "GET",
    success: function (res) {
      // console.log("RESULT: ", res);
      $("#m3addr").html(res.addr);
      document.getElementById("qr3addr").src = res.url;
      mReady[2] = true;
    },
    error: function (err) {
      console.error(err);
    }
  });
  $.ajax({
    url: "/api/address?m=4",
    type: "GET",
    success: function (res) {
      // console.log("RESULT: ", res);
      $("#m4addr").html(res.addr);
      document.getElementById("qr4addr").src = res.url;
      mReady[3] = true;
    },
    error: function (err) {
      console.error(err);
    }
  });
  $.ajax({
    url: "/api/address?m=5",
    type: "GET",
    success: function (res) {
      // console.log("RESULT: ", res);
      $("#m5addr").html(res.addr);
      document.getElementById("qr5addr").src = res.url;
      mReady[4] = true;
    },
    error: function (err) {
      console.error(err);
    }
  });
}

function machineTimer(machine, bal, mode, curr) {
  console.log(machine, bal, mode, curr);
  var balanceused = 0.0;
  var balanceleft = Number(bal);
  if (balanceleft <= 0.0) {
    // console.log('stop')
    clearInterval(usingTimer);
    $("#m" + machine + "butt").val("0");
    $("#m" + machine + "butt").removeClass("btn-danger");
    $("#m" + machine + "butt").addClass("btn-primary");
    $("#m" + machine + "butt").html("START");
    $("#m" + machine + "stat").html("<center><i class=\"fa fa-circle\" aria-hidden=\"true\" style=\"color:red\"></i></center>");
    $("#m" + machine + "bal").html("<center>0 MIOTA</center>");
    mObj[machine].bal = 0.0;
    document.getElementById("m" + machine + "butt").disabled = true;
    /* $.ajax({
      url: "/api/address?m=" + machine,
      type: "GET",
      success: function (res) {
        // console.log("RESULT: ", res);
        $("#m" + machine + "addr").html(res.addr);
        document.getElementById("qr" + machine + "addr").src = res.url;
      },
      error: function (err) {
        console.error(err);
      }
    }); */
  } else {
    // console.log(timeleft)
    // balanceleft -= 1
    if (mode === 1 || mode === 4 || mode === 7) {
      balanceused = (Math.ceil(((1.0/60.0)/Number(curr)) * 1000000.0 * 1000.0)/1000.0);
    } else if (mode === 2 || mode === 5 || mode === 6) {
      balanceused = (Math.ceil(((2.0/60.0)/Number(curr)) * 1000000.0 * 1000.0)/1000.0);
    } else if (mode === 3) {
      balanceused = (Math.ceil(((0.5/60.0)/Number(curr)) * 1000000.0 * 1000.0)/1000.0);
    }
    console.log("Balance Used", balanceused);
    balanceleft -= balanceused;
    if (balanceleft > 0.0) {
      mObj[machine].bal = balanceleft;
      $("#m" + machine + "bal").html("<center>" + (balanceleft/1000000.0).toFixed(3).toString() + " MIOTA</center>");
      $("#m" + machine + "fee").html("<center>" + (balanceused/1000000.0 * 60).toFixed(3).toString() + " (MIOTA/min)</center>");
    } else {
      clearInterval(usingTimer);
      mObj[machine].bal = 0.0;
      $("#m" + machine + "butt").val("0");
      $("#m" + machine + "butt").removeClass("btn-danger");
      $("#m" + machine + "butt").addClass("btn-primary");
      $("#m" + machine + "butt").html("START");
      $("#m" + machine + "stat").html("<center><i class=\"fa fa-circle\" aria-hidden=\"true\" style=\"color:red\"></i></center>");
      $("#m" + machine + "bal").html("<center>0 MIOTA</center>");
      document.getElementById("m" + machine + "butt").disabled = true;
      /* $.ajax({
        url: "/api/address?m=" + machine,
        type: "GET",
        success: function (res) {
          // console.log("RESULT: ", res);
          $("#m" + machine + "addr").html(res.addr);
          document.getElementById("qr" + machine + "addr").src = res.url;
        },
        error: function (err) {
          console.error(err);
        }
      }); */
    }
  }
}

function getCurrencies() {
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: "/api/cur",
        type: "GET",
        success: function (res) {
          console.log("RESULT: ", res);
          // $("#amount").html(res.eur);
          resolve(res.eur);
        },
        error: function (err) {
          console.error(err);
        }
      });
    } catch (err) {
      console.error(err);
    }
  })
}

/**
 *

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

function getCurrencies() {
  $.ajax({
    url: "/api/cur",
    type: "GET",
    success: function (res) {
      console.log("RESULT: ", res);
      // $("#amount").html(res.eur);
      $("#inputAmount").val((Math.ceil((1.0/Number(res.eur)) * 1000 * 1000000)/1000).toString());
    },
    error: function (err) {
      console.error(err);
    }
  });
}

 *
 */
