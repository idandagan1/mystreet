/**
 * Created by idandagan1 on 22/09/2017.
 */

const ENV = process.env,
    env = 'production',
    SERVER_DEV_PORT = 8001,
    port = ENV.WEB_PORT || SERVER_DEV_PORT,
    host = ENV.IP || '127.0.0.1',
    db = 'mongodb://emma:Aa123123@ds143734.mlab.com:43734/mystreet',
    url = 'https://mystreet.herokuapp.com';

module.exports = {
    port,
    host,
    db,
    url,
    env,
}
