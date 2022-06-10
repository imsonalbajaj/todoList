module.exports.getDate = getDate;
function getDate() {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    return today.toLocaleDateString("en-US", options);
}

// or you can also shorter the code by using anonymous func

module.exports.getDay = function () {
    let today = new Date();

    let options = {
        weekday: "long"
    }

    return today.toLocaleDateString("en-US", options);
}