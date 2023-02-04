module.exports = {
    cerateCode: "insert into code_list(id,orgin) values ? on duplicate key update id=values(id);",
    selectCode: "select * from code_list order by create_time desc ;",
}