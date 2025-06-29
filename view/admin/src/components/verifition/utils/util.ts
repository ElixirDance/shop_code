export function resetSize(vm) {
    var imgWidth, imgHeight, barWidth, barHeight;	//图片的宽度、高度，移动条的宽度、高度

    var parentWidth = vm.$el.parentNode.offsetWidth || window.offsetWidth
    var parentHeight = vm.$el.parentNode.offsetHeight || window.offsetHeight
    if (vm.imgSize.width.indexOf('%') != -1) {
        imgWidth = parseInt(vm.imgSize.width) / 100 * parentWidth + 'px'
    } else {
        imgWidth = vm.imgSize.width;
    }

    if (vm.imgSize.height.indexOf('%') != -1) {
        imgHeight = parseInt(vm.imgSize.height) / 100 * parentHeight + 'px'
    } else {
        imgHeight = vm.imgSize.height
    }

    if (vm.barSize.width.indexOf('%') != -1) {
        barWidth = parseInt(vm.barSize.width) / 100 * parentWidth + 'px'
    } else {
        barWidth = vm.barSize.width
    }

    if (vm.barSize.height.indexOf('%') != -1) {
        barHeight = parseInt(vm.barSize.height) / 100 * parentHeight + 'px'
    } else {
        barHeight = vm.barSize.height
    }

    return {imgWidth: imgWidth, imgHeight: imgHeight, barWidth: barWidth, barHeight: barHeight}
}

export const _code_chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export const _code_color1 = ['#fffff0', '#f0ffff', '#f0fff0', '#fff0f0']
export const _code_color2 = ['#FF0033', '#006699', '#993366', '#FF9900', '#66CC66', '#FF33CC']