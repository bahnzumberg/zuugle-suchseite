if (process.env.NODE_ENV === 'production' && host.indexOf("www.zuugle.") >= 0) {
    console.log = function () {};
}