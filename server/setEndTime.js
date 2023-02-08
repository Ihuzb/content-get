const {selectMonthInfo, setEndTime} = require("../sql/sqlList");
const sqlQuery = require("../public/sqlQueryBook");
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
module.exports = async () => {
    let time = null;
    if (time) {
        clearInterval(time)
    }
    time = setInterval(async () => {
        let data = await sqlQuery(selectMonthInfo);
        data = data.filter(v => {
            let time = dayjs(new Date()).diff(v.use_time, 'day')
            return time >= 30;
        }).map(v => [4, v.id]);
        if (data.length) {
            data.forEach(async v => {
                await sqlQuery(setEndTime, v);
            })
        }
    }, 2000)
}
