export default () => next => action => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(action);
    } else {
        console.log(action);
    }
    next(action);
};
