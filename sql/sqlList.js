module.exports = {
    cerateCode: "insert into code_list(id,orgin) values ? on duplicate key update id=values(id);",
    selectCode: "select * from code_list order by create_time desc ;",
    setCodeType: "update code_list set code_list.type=? where id=?;",
    setUseCodeType: "update code_list set code_list.type=?,code_list.use_time=NOW() where id=?;",
    setUseYueCodeType: "update code_list set code_list.type=?,code_list.use_time=NOW(),code_list.end_time=NOW()+ INTERVAL 30 DAY where id=?;",
    selectCodeInfo: "select * from code_list where code_list.id=?;",
    setEndTime: "update code_list set code_list.type=?,code_list.end_time=NOW() where id=?;",
    selectMonthInfo: "select * from code_list where orgin=2 and type=3 order by use_time desc ;",
}