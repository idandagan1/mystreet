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

module.exports.setCookie = function (c_name, value, exdays) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    const c_value = (value) + (!exdays ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = c_name + '=' + c_value;
}

module.exports.getCookie = function (c_name) {
    let i, x, y;
    const cookies = document.cookie.split(';');
    for (i = 0; i < cookies.length; i++) {
        x = cookies[i].substr(0, cookies[i].indexOf('='));
        y = cookies[i].substr(cookies[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        if (x === c_name) {
            return y;
        }
    }

    return '';
}
