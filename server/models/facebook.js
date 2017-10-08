import https from 'https';

export default function getFbData(accessToken, apiPath, callback) {
    const options = {
        host: 'graph.facebook.com',
        port: 443,
        path: `${apiPath}?access_token=${accessToken}`, // apiPath example: '/me/friends'
        method: 'GET',
    };

    let buffer = ''; // this buffer will be populated with the chunks of the data received from facebook
    const request = https.get(options, result => {
        result.setEncoding('utf8');
        result.on('data', chunk => {
            buffer += chunk;
        });

        result.on('end', () => {
            callback(buffer);
        });
    });

    request.on('error', e => {
        console.log(`error from facebook.getFbData: ${e.message}`);
    });

    request.end();
}
