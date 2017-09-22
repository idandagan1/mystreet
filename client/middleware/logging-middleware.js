export default () => next => action => {
    console.log(action);
    if (process.env.NODE_ENV !== 'production') {
        console.log(action);
    }
    next(action);
};
