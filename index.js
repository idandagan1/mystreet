/**
 * Created by idandagan1 on 21/09/2017.
 */
/**
 * Entry Script
 */

require(process.env.NODE_ENV === 'production' ? './server/server.js' : './server/server-es6');
