// implement of login with database
// import con to db
const db = require('../db/index.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtconfig = require('../jwt_config/index.js');

// create two interface
exports.register = (req, res) => {
    const reginfo = req.body;
    // verify null
    if (!reginfo.account || !reginfo.password) {
        return res.cc('account and password can not be null')
    }
    // verify if account already exist
    const sqls = 'select * from sys_users where account=$1'
    const user = [reginfo.account];
    db.query(sqls, user, (err, result) => {
        if (result.rowCount !== 0) {
            return res.cc('account already exists!')
        } else {
            // encryption
            reginfo.password = bcrypt.hashSync(reginfo.password, 10)
            // insert
            const sqlin = 'insert into sys_users (account, password, phone, email, name, job, company, role,' +
                                 ' status, createdate) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ';
            const role = 'user';
            const status = 'normal';
            const createdate = new Date();
            const value = [reginfo.account, reginfo.password, reginfo.phone, reginfo.email, reginfo.name,
                                  reginfo.job, reginfo.company, role, status, createdate];
            db.query(sqlin, value, (err, result) => {
                if (result.rowCount !== 1) { return res.cc('register filed!') }
                return res.cc('register successfully', 0)
            })
        }
    })
}
exports.login = (req, res) => {
    const loginfo = req.body;
    if (!loginfo.account || !loginfo.password) {
        return res.cc('account and password can not be null')
    }
    const sqls = 'select * from sys_users where account=$1'
    const user = [loginfo.account];
    db.query(sqls, user, (err, result) => {
        if (err) { return res.cc(err) }
        if (result.rowCount !== 1) { return res.cc('login failed!') }
        // user exists decode password
        const compareResult = bcrypt.compareSync(loginfo.password, result.rows[0].password)
        if (!compareResult) { return res.cc('login failed, account or password wrong!') }
        // verify account status
        if (result.rows[0].status !== 'normal') {return res.cc('account status abnormal, contact admin!')}
        // generate token, exclude useless information
        const user = {
            ...result.rows[0],
            password: '',
            createdate: '',
            updatedate: '',
        }
        // token life
        const tokenStr = jwt.sign(user, jwtconfig.jwtSecretKey, {
            expiresIn: '12h'
        })
        res.send({
            results: user,
            status: 0,
            message: 'login successfully',
            token: 'Bearer ' + tokenStr
        })
    })
}