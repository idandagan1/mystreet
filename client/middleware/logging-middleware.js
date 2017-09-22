export default () => next => action => {
    console.log(process.env.SERVER_URL);
    console.log(action);
//     if (process.env.NODE_ENV !== 'production') {
//         console.log(action);
//     }
    next(action);
};
