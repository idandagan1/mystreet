module.exports = {
    replaceDateTime: (postDate) => {
        const date = postDate.replace('in ', '');
        if (date.includes('a few seconds')) {
            return date.replace('a few seconds', 'just now');
        } else if (date.includes('a minute')) {
            return date.replace('a minute', 'a minute ago');
        } else if (date.includes('minutes')) {
            return date.replace('minutes', 'mins');
        } else if (date.includes('hours')) {
            return date.replace('hours', 'hrs');
        }
        return date;
    },
}
