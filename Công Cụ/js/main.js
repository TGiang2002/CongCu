// import { format } from "url";

$(function(){
	// thanh cuộn tùy chỉnh
	$(".content_list").mCustomScrollbar();

	var $audio = $("audio");
	var player = new Player($audio);
	var progress;
	var voiceProgress;
	var lyrics;
	

// tải danh sách bài hát
	getPlayerList();
	function getPlayerList(){
		$.ajax({
			url: "./source/musiclist.json",
			dataType: "json",
			success:function(data){
				player.musicList = data;
				// Tạo từng bản nhạc thông qua dữ liệu đã duyệt
				// Lấy vị trí của bài hát đã chèn
				var $musicList = $(".content_list ul");
				$.each(data,function(index,ele){
					var $item = createMusicItem(index, ele);
					$musicList.append($item);
				});
				// Khởi tạo thông tin bài hát

				initMusicInfo(data[0]);
				// Khởi tạo thông tin lời bài hát
				initMusicLyrics(data[0]);

			},
			error:function(e){
				console.log(e);
			}
			
		});
	}

// Khởi tạo thông tin bài hát
function initMusicInfo(music){
// lấy phần tử tương ứng
		var $musicImage = $(".song_info_pic img");
		var $musicName = $(".song_info_name a");
		var $musicSinger = $(".song_info_singer a");
		var $musicAlbum = $(".song_info_album a");
		var $musicProgressName = $(".music_progress_name");
		var $musicProgressTime = $(".music_progress_time");
		var $musicBg = $(".mask_bg");
// gán giá trị cho phần tử thu được
		$musicImage.attr("src",music.cover);
		$musicName.text(music.name);
		$musicSinger.text(music.singer);
		$musicAlbum.text(music.album);
		$musicProgressName.text(music.name+" / "+music.singer);
		$musicProgressTime.text("00:00 / "+music.time);
		$musicBg.css("background","url('"+music.cover+"')");
	}

	// Khởi tạo thông tin lời bài hát



// Khởi tạo thanh tiến trình
	initProgress();
	function initProgress(){
// thanh tiến trình âm nhạc
		var $progressBar = $(".music_progress_bar");
		var $progressLine = $(".music_progress_line");
		var $progressDot = $(".music_progress_dot");
		progress = Progress($progressBar,$progressLine,$progressDot);
// sự kiện nhấp vào thanh tiến trình
			progress.progressClick(function(value){
			player.musicSeekTo(value);
		});
// Sự kiện kéo thanh tiến trình
		progress.progressMove(function(value){
			player.musicSeekTo(value);
		});

// thanh tiến trình âm thanh
		var $voiceBar = $(".music_voice_bar");
		var $voiceLine = $(".music_voice_line");
		var $voiceDot = $(".music_voice_dot");
		voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot);
// sự kiện nhấp vào thanh tiến trình
		voiceProgress.progressClick(function(value){
			player.musicVoiceSeekTo(value);
		});
// Sự kiện kéo thanh tiến trình
		voiceProgress.progressMove(function(value){
			player.musicVoiceSeekTo(value);
		});
	}


// Khởi tạo trình nghe sự kiện
	initEvents();
	function initEvents(){
		// Nghe các sự kiện chuyển vào và chuyển ra của bài hát
/ * Di chuyển vào: hiển thị menu con, ẩn thời lượng * /
		$(".content_list").delegate(".list_music","mouseenter",function(){
		// hiển thị menu con
// Hiển thị các biểu tượng chơi, thêm, tải xuống, chia sẻ
			$(this).find(".list_menu").stop().fadeIn(0);
			// ẩn thời lượng

			$(this).find(".list_time span").stop().fadeOut(0);
			// hiển thị biểu tượng xóa
		$(this).find(".list_time a").stop().fadeIn(0);
		});

		/ * Di chuyển ra ngoài: ẩn menu con, thời lượng hiển thị * /
		$(".content_list").delegate(".list_music","mouseleave",function(){
			// ẩn menu con
// Ẩn các biểu tượng chơi, thêm, tải xuống, chia sẻ
			$(this).find(".list_menu").stop().fadeOut(0);
// ẩn biểu tượng xóa
			$(this).find(".list_time a").stop().fadeOut(0);

			//hiển thị thời gian

			$(this).find(".list_time span").stop().fadeIn(0);
		});

		// lắng nghe sự kiện nhấp vào hộp kiểm

		$(".content_list").delegate(".list_check","click",function(){
			$(this).toggleClass("list_checked");
		});

		// Thêm di chuyển vào nút phát menu con
// $ (". content_list"). ủy nhiệm (". list_menu_play", "mouseenter", function () {
// $ (this) .toggleClass ("list_menu_play3");
//});

// Thêm trình nghe cho nút phát menu con
// Lấy nút phát ở dưới cùng
		var $musicPlay = $(".music_play");
		$(".content_list").delegate(".list_menu_play","click",function(){
// tìm nút của bản nhạc hiện tại
	var $item = $(this).parents(".list_music");

			// console.log($item.get(0).index);
			// console.log($item.get(0).music);

// Chuyển biểu tượng của nút phát
		$(this).toggleClass("list_menu_play2");
		// Khôi phục biểu tượng của các nút chơi khác

			$item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
// Đồng bộ hóa biểu tượng nút phát dưới cùng
			if($(this).attr("class").indexOf("list_menu_play2") != -1){
			// Menu con hiện tại đang ở trạng thái phát
// Thêm nút phát 2
				$musicPlay.addClass("music_play2");
			// làm cho văn bản được đánh dấu

				$item.find("div").css("color","#fff");
// thì văn bản bài hát khác bị mờ
			$item.siblings().find("div").css("color","rgba(255, 255, 255, .5)");
			}else{
				// Menu con hiện tại không phát
// xóa nút phát 2
				$musicPlay.removeClass("music_play2");
// làm cho văn bản không được đánh dấu
		$item.find("div").css("color","rgba(255, 255, 255, .5)");
			}
			// chuyển trạng thái số sê-ri

			$item.find(".list_number").toggleClass("list_number2");
			// Khôi phục trạng thái số sê-ri khác

			$item.siblings().find(".list_number").removeClass("list_number2");

//chơi nhạc
			player.playMusic($item.get(0).index,$item.get(0).music);

			// chuyển đổi thông tin bài hát

			initMusicInfo($item.get(0).music);
			// chuyển đổi thông tin lời bài hát

			initMusicLyrics($item.get(0).music);
		});

// Theo dõi việc nhấp vào nút phát trong khu vực điều khiển dưới cùng
		$musicPlay.click(function(){
			// Xác định xem bản nhạc đã được phát chưa

			if(player.currentIndex == -1){
				// không có nhạc nào được phát

				$(".list_music").eq(0).find(".list_menu_play").trigger("click");
			}else{
				// Nhạc đã được phát

				$(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
			}
		});
// Theo dõi việc nhấp vào nút trước đó trong khu vực điều khiển dưới cùng
		$(".music_pre").click(function(){
			$(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
		});

// Theo dõi việc nhấp vào nút tiếp theo trong khu vực điều khiển dưới cùng
$(".music_next").click(function(){
			$(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
		});

// Nghe khi nhấp vào nút xóa
$(".content_list").delegate(".list_menu_del","click",function(){
// tìm nhạc đã nhấp
var $item = $(this).parents(".list_music");
// Xác định xem bản nhạc đã xóa hiện đang phát
if($item.get(0).index == player.currentIndex){
				$(".music_next").trigger("click");
			}
// loại bỏ nút
$item.remove();
// xóa nhạc tương ứng trong tệp
player.changeMusic($item.get(0).index);

// sắp xếp lại
$(".list_music").each(function(index,ele){
				ele.index = index;
				$(ele).find(".list_number").text(index+1);
			});
		});

// Theo dõi tiến trình phát lại
player.musicTimeUpdate(function(currentTime, duration, timeStr){
// thời gian được đồng bộ hóa
$(".music_progress_time").text(timeStr);
			// thanh tiến trình đồng bộ hóa
// Tính tỷ lệ phát lại
			var value = currentTime / duration * 100;
			progress.setProgress(value);
// nhận ra sự đồng bộ của lời bài hát
			var index = lyrics.currentIndex(currentTime);
			var $item = $(".song_lyric li").eq(index);
			$item.addClass("cur");
			$item.siblings().removeClass("cur");
// Đặt cuộn sau khi chơi dòng đầu tiên
		if(index <= 2) return;
			$(".song_lyric").css({
				marginTop: (-index + 2) * 30
			});
		});

		// Nghe khi nhấp vào nút âm thanh

		$(".music_voice_icon").click(function(){
		// biểu tượng chuyển đổi
			$(this).toggleClass("music_voice_icon2");
		// chuyển đổi âm thanh
// Xác định xem biểu tượng hiện tại có phải là biểu tượng tắt tiếng hay không
			if($(this).attr("class").indexOf("music_voice_icon2") != -1){
// tắt tiếng
player.musicVoiceSeekTo(0);
			}else{
// trở thành âm thanh
player.musicVoiceSeekTo(1);
			}
		});
	}

// Xác định phương thức để tạo một bản nhạc
function createMusicItem(index, music){
		var $item = $(" <li class='list_music'>"+
		"<div class='list_check'><i></i></div>"+
		"<div class='list_number'>"+(index+1)+"</div>"+
		"<div class='list_name'>"+music.name+""+
		"	<div class='list_menu'>"+
		"		<a href='javascript:;' title='播放' class='list_menu_play'></a>"+
		"		<a href='javascript:;' title='添加'></a>"+
		"		<a href='javascript:;' title='下载'></a>"+
		"		<a href='javascript:;' title='分享'></a>"+
		"	</div>"+
		"</div>"+
		"<div class='list_singer'>"+music.singer+"</div>"+
		"<div class='list_time'>"+
		"	<span>"+music.time+"</span>"+
		"	<a href='javascript:;' title='删除' class='list_menu_del'></a>"+
		"</div>"+
		"</li>");

		$item.get(0).index = index;
		$item.get(0).music = music;
		return $item;
	}
// Nghe tiếng nhấp của nút chuyển chế độ
var mode = 1;
	$(`.music_mode${mode}`).click(function(){
// công tắc biểu tượng
$(this).toggleClass(`music_mode${mode}`);
		if(mode == 4){
			mode=0;
		}
		mode++;
		$(this).toggleClass(`music_mode${mode}`);
	})

	// Lắng nghe những lần nhấp vào nút thích

	$(".music_fav").click(function(){
		// công tắc biểu tượng

		$(this).toggleClass(`music_fav2`);
	})

// Lắng nghe những lần nhấp vào nút 
$(".music_only").click(function(){
// công tắc biểu tượng
$(this).toggleClass(`music_only2`);
	})
});