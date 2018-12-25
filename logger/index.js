module.exports = function (message) {
    let date = new Date(),
        time = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ];
    for (let i = 1; i < 6; i++) {
        if (time[i] < 10) {
            time[i] = '0' + time[i]
        }
    }
    console.log(time[0] + '-' + time[1] + '-' + time[2] + ' ' + time[3] + ':' + time[4] + ':' + time[5] + ' - ' + message)
};
