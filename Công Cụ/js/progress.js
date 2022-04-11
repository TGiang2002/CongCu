(function(window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        musicList:[],
        init:function($progressBar,$progressLine,$progressDot){
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove: false,
        progressClick: function(callBack){
            var $this = this; // tại thời điểm này, đây là tiến trình
// lắng nghe các nhấp chuột trong nền
this.$progressBar.click(function () { // bên trong này là processBar

// Lấy vị trí mặc định của khoảng cách nền từ cửa sổ
var normalLeft = $(this).offset().left;
// Lấy vị trí của vị trí đã nhấp từ cửa sổ
var eventLeft = event.pageX;
// Đặt chiều rộng của nền trước
$this.$progressLine.css("width",eventLeft - normalLeft);
                $this.$progressDot.css("left",eventLeft - normalLeft);
// Tính quy mô của thanh tiến trình
var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            });
        },
        progressMove: function(callBack){
            var $this = this;
// Lấy vị trí mặc định của khoảng cách nền từ cửa sổ
var normalLeft = this.$progressBar.offset().left;
// Lấy chiều rộng tổng thể của thanh tiến trình
var barWidth = this.$progressBar.width();
// Lưu trữ vị trí của vị trí được nhấp từ cửa sổ
var eventLeft;
// lắng nghe sự kiện thả chuột
this.$progressBar.mousedown(function(){
                $this.isMove = true;
// lắng nghe các sự kiện di chuyển chuột
$(document).mousemove(function(event){
// Lấy vị trí của vị trí đã nhấp từ cửa sổ
eventLeft = event.pageX;
                    var offset = eventLeft - normalLeft;
                    if(offset >= 0 && offset <= barWidth){
// Đặt chiều rộng của nền trước
$this.$progressLine.css("width",eventLeft - normalLeft);
                    $this.$progressDot.css("left",eventLeft - normalLeft);
                    }
                });
            });
// Lắng nghe sự kiện di chuột lên
$(document).mouseup(function(){
// di chuyển ra khỏi sự kiện di chuyển chuột
$(document).off("mousemove");
                // $this.isMove = false;
// Tính quy mô của thanh tiến trình
var value = (eventLeft - normalLeft) / $this.$progressBar.width();
                callBack(value);
            });
        },
        setProgress: function(value){
            if(this.isMove) return;
            if(value < 0 || value > 100)return;
            this.$progressLine.css({
                width: value+"%"
            });
            this.$progressDot.css({
                left: value+"%"
            });
        },
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress=Progress;
})(window)