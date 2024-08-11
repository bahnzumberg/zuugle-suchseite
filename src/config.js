if (process.env.NODE_ENV === 'production' && window.location.href.indexOf("www.zuugle.") >= 0) {
    console.log = function () {};
}