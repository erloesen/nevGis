// implement of login with database
// import con to db
const db = require('../db/index.js');
const bcrypt = require('bcrypt');

// create two interface
exports.register = (req, res) => {
    const reginfo = req.body;
    // verify null
    if (!reginfo.account || !reginfo.password) {
        return res.send({
            status: 1,
            message: 'account and password can not be null'
        })
    }
    // verify if account already exist
    const sqls = 'select * from sys_users where account=$1'
    const user = [reginfo.account];
    db.query(sqls, user, (err, result) => {
        if (result.rowCount !== 0) {
            return res.send({
                status: 1,
                message: 'account already exists!'
            })
        } else {
            // encryption
            reginfo.password = bcrypt.hashSync(reginfo.password, 10)
            // insert
            const sqlin = 'insert into sys_users (account, password, phone, email, name, job, company, role, status, createdate) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ';
            const role = 'user';
            const status = 'normal';
            const createdate = new Date();
            const value = [reginfo.account, reginfo.password, reginfo.phone, reginfo.email, reginfo.name, reginfo.job, reginfo.company, role, status, createdate];
            db.query(sqlin, value, (err, result) => {
                if (result.rowCount !== 1) {
                    return res.send({
                        status: 1,
                        message: 'register failed'
                    })
                }
                return res.send({
                    status: 200,
                    message: 'register successfully'
                })
            })
        }
    })
}
exports.login = (req, res) => {
    res.send('login')
}