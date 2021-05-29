const io = require('socket.io-client')

module.exports = function (machine, timer, mode) {
  return new Promise((resolve, reject) => {
    try {
      const socket = io('http://127.0.0.1:16688')
      // const socket = io('http://127.0.0.1:8888')
      var timeleft = Number(timer)
      var usingTimer = setInterval(function () {
        if (timeleft <= 0) {
          // console.log('stop')
          socket.emit('timer', {
            machine: machine,
            mode: mode,
            timeleft: timeleft
          })
          resolve('stop')
          clearInterval(usingTimer)
        } else {
          // console.log(timeleft)
          socket.emit('timer', {
            machine: machine,
            mode: mode,
            timeleft: timeleft
          })
          timeleft -= 1
        }
      }, 1000)
    } catch (err) {
      reject(err)
    }
  })
}
