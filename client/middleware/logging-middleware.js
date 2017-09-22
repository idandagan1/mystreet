import * as config from '../../server/config/config';

export default () => next => action => {
    console.log(`${process.env.SERVER_URL}:${config.port}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(action);
    }
    next(action);
};
