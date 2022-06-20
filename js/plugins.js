/**
 * @param {number} times - The number of shakes
 * @param {number} duration - The speed amount
 * @param {string} easing - The easing method
 * @param {function} complete - A callback function
 */
jQuery.fn.shake =
jQuery.fn.wiggle = function (times, duration, easing, complete) {
    var self = this;

    if (times > 0) {
        this.animate({
            marginLeft: times-- % 2 === 0 ? -15 : 15
        }, duration, easing, function () {
            self.wiggle(times, duration, easing, complete);
        });
    } else {
        this.animate({
            marginLeft: 0
        }, duration, easing, function () {
            if (jQuery.isFunction(complete)) {
                complete();
            }
        });
    }
    return this;
};
