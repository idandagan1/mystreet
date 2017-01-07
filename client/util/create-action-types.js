export default function createActionTypes(prefix, actions) {
    return actions.reduce((prev, curr) => ({
        ...prev,
        [curr]: `${prefix}_${curr}`,
    }), {});
}
