module.exports = {
    cerateCode: "insert into code_list(id,orgin) values ? on duplicate key update id=values(id);",
    selectCode: "select * from code_list order by create_time desc ;",
    setCodeType: "update code_list set code_list.type=?,code_list.use_time=NOW() where id=?;",
    selectCodeInfo: "select * from code_list where code_list.id=?;",
}