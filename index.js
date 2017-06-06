if (process.env.NODE_ENV === 'production') {
    require('./dist/vendor.js');
    require('./dist/main.js');
} else {
    // Babel polyfill to convert ES6 code in runtime
    require('babel-register')({
        "plugins": [
            [
                "babel-plugin-webpack-loaders",
                {
                    "config": "./webpack.config.prod.js",
                    "verbose": false,
                }
            ]
        ]
    });
    require('babel-polyfill');

    require('./server/server');
}
