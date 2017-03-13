exports.fmoney = function (s, n) {
    if(typeof s === 'string'){
        return s;
    }
    n = n > 0 && n <= 20 ? n : 0;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
    }
    if (n === 0) {
        return t.split("").reverse().join("");//不要小数
    } else {
        return t.split("").reverse().join("") + "." + r;
    }
}

exports.cut2 = function (s) {//取2位小数
    return Math.floor(s * 100) / 100
}