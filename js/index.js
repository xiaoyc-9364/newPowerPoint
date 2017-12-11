;(function($) {
	$.fn.picSlide = function() {
		var imgGroup = {};
		this.find('img').each(function(){
			var $this = $(this);
			var imgData = $this.data('imggroup');	
			if (imgData) {							//判断是否存在data-imggroup属性
				if (!imgGroup[imgData]) {			//判断imggroup中是否有该属性
					imgGroup[imgData] = [$this];	//如果没有则添加属性，并将该img添加到数组中
				} else {
					imgGroup[imgData].push($this);	//如果存在直接添加
				}
			}
		});

		return new Frame(imgGroup);
	};

	function Frame(opts) {
		this.info = opts; 
		this.init();
	}

	Frame.prototype = {
		init: function() {
			this.createFrame();	//创建节点
			this.addEvent();	//绑定事件
		},

		createFrame: function() {	//创建节点方法
			var $body = $('body');
			this.oScreen = $('<div></div>').css({	//创建屏幕遮罩，并设置样式
								position: 'fixed',
								left: 0,
								top:0,
								zIndex: 990 ,
								width: '100%' ,
								height:'100%' ,
								background: '#000',
								opacity: 0.4
							}).appendTo($body).hide();

			this.oFrame = $('<div></div>').css({	//创建容器
								position: 'fixed',
								left: '50%',
								top: '50%',
								color: '#fff',
								transform: 'translate(-50%, -50%)',
								zIndex: 991,
								background: '#fff url(image/5-121204193R0.gif) center center no-repeat',
								padding: '5px',
								borderRadius: '5px',
								marginBottom: '50px'
							}).hide();

			var $frameContainer = this.oFrame;

			$('<img/>').css({		//创建img
					display: 'block',
					borderRadius: "5px"
				}).appendTo($frameContainer);

			var $oPrev = $('<button>&lt;</button>').css({	//创建上一张按钮
							height: '100%',
							width: '80px',
							lineHeight: '100%',
							textAlign: 'center',
							position: 'absolute',
							top: 0,
							left: 0,
							border: 'none',
							cursor: 'pointer',
							outline: 'none',
							color: '#fff',
							background: 'transparent',
							WebkitFontSmoothing: 'antialiased',
							fontSize: '40px',
							textShadow: '0  0 5px #000',
							transition: 'all 0.5s',
							opacity: 0.6,
							zIndex: 999
						}).appendTo($frameContainer);

			var $oNext = $oPrev.clone(true).html('&gt;').css({	//下一张按钮
							right:0,
							left: 'auto'
						}).appendTo($frameContainer);

		

			$('<a href="javascript:void(0);">×</a>').css({		//关闭按钮
					display: 'block',
					lineHeight: '40px',
					fontSize: '3em',
					textDecoration: 'none',
					textShadow: '0 0 3px #fff',
					color: '#fff',
					background: 'transparent',
					position: 'absolute',
					right: 0,
					transform: 'translateY(100%)',
					bottom: 0,
					outline: 'none',
					userSelect: 'none',
					zIndex: 999,
				}).appendTo($frameContainer);

			this.imgMessage = $('<p>cc</p>').css({		//图片描述文本
					lineHeight: '14px',
					fontSize: '16px',
					position: 'absolute',
					left: 0,
					bottom: '-20px',
					textIndent: '1em'
				}).appendTo($frameContainer);

			this.pageNum = $('<p>fff</p>').css({	//页码
					lineHeight: '14px',
					fontSize: '16px',
					position: 'absolute',
					left: 0,
					bottom: '-45px',
					textIndent: '1em'
				}).appendTo($frameContainer);

			this.oFrame.appendTo($body);
		},

		addEvent: function() {		//事件绑定方法
			var _this = this;
			$.each(_this.info, function(key, value) {
				$(value).each(function(index) {
					$(this).click(function() {		//图片点击事件
						_this.showFrame();			//显示幻灯
						_this.loadImage(key, index);//加载图片
					});
				});
			});

			this.oFrame.find('a').click(function() {	//关闭按钮隐藏幻灯
				_this.hideFrame();	
			});

			this.oScreen.click(function() {		//点击幻灯外围隐藏幻灯
				_this.hideFrame();
			});

			var $btn = this.oFrame.find('button');
			$btn.hover(function() {		//鼠标悬浮事件
				$(this).css({
					opacity: 1
				});
			}, function() {
				$(this).css({
					opacity: 0.3
				});
			});

			$btn.eq(0).click(function() {	//上一张按钮
				_this.tabImage(-1);
			});
			$btn.eq(1).click(function(e) {	//下一张按钮
				_this.tabImage(1);
			});

			$(document).keydown(function(e) {
				switch(e.which) {		//按下键盘Esc键，关闭详图
					case 27:
						_this.hideFrame();
						break;
					case 37: 				//左方向键上一张
						_this.tabImage(-1);
						break;
					case 39: 				//有方向键下一张
						_this.tabImage(1);
						break;
					case 32: 				//有空格键下一张
						_this.tabImage(1);
						break;
				}
			});
			
			$(window).resize(function() {	//浏览器缩放
				if (_this.oFrame.css('display') !== 'none') {
					console.log($(window).width());
					_this.loadImage(_this.key, _this.cur);
				}
				
			});
		
			
		},

		loadImage: function(property, index) {	
			//加载图片方法，参数：当前的info的属性； 该属性下的索引；
			this.key = property;
			this.cur = index;
			var _this = this;
			var len = $(this.info[property]).length;
			var aBtn = this.oFrame.find('button');

			if (this.cur < 0) {	//当前图片为第一张是隐藏上一张按钮
				
				aBtn.eq(0).fadeOut('fast');
				aBtn.eq(1).fadeIn();	//防止点击最后一张图片后退出，再点击第一张时按隐藏
				this.cur = 0;
				return false;
			} else if (this.cur > len-1) {
				this.cur = len-1;
				aBtn.eq(0).fadeIn();
				aBtn.eq(1).fadeOut('fast');
				return false;
			} else {
				aBtn.fadeIn();
			}
			if (len == 1) {		//图片组只有一张时隐藏按钮
				aBtn.fadeOut('fast');
			}
			var $curImage = $(this.info[this.key][this.cur]);	//当前图片
			var imgSrc = $curImage.attr('src'),  //获取当前图片的src
				imgAlt = $curImage.attr('alt');	 //获取当前图片的alt
		
			var newImage = new Image();			//新的图片对象
			newImage.src = imgSrc
		
			var viewportW = $(window).width() * 0.9,		//视口宽度的90%
				viewportH = $(window).height() * 0.8,	//视口高度的80%
				realWidth = newImage.width,		//图片的原始宽度
				realHeight = newImage.height,	//图片的原始高度
				scaleW = viewportW / realWidth,	//高度及宽度的缩放比例
				scaleH = viewportH / realHeight;
				
			var scale = Math.min(scaleW, scaleH, 1);
			var imgW, imgH;
			//连个比例都大于1时则说明图片的原始高度及宽度小于视口高度宽度
			// if (scaleW >= 1 && scaleH >= 1) {
			// 	imgW = realWidth;
			// 	imgH = realHeight;
			// 	console.log('1');
			// } else {
			// //当高度或宽度有一个大于视口的宽高时，比较高度及宽度是缩放比
			// //宽度的缩放比大于高度的缩放比，说明高度的缩放量更大，则将图片的高度设置为视口高度
			// //宽度按高度的缩放比缩放	
			// 	if (scaleW > scaleH) {
			// 		imgH = viewportH;
			// 		imgW = realWidth * scaleH;
			// 	console.log('2');
			// 	} else {
			// 		imgW = viewportW;
			// 		imgH = viewportH * scaleW;
			// 		// debugger;
			// 	console.log('3');
			// 	} 
			// }
			imgH = realHeight * scale;
			imgW = realWidth * scale;
			_this.oFrame.find('img').attr('src', imgSrc).css({
				opacity: 0
			}).animate({
				width: imgW,
				height: imgH,
				// opacity: 1
			},300).animate({
				opacity: 1
			}, 600);
			

			this.imgMessage.html(imgAlt);
			this.pageNum.html(this.cur + 1 + " / " + len);
		},

		tabImage: function(n) {
			this.loadImage(this.key, this.cur + n);
		},

		showFrame: function() {
			this.oScreen.fadeIn('slow');
			this.oFrame.fadeIn('slow');
			$('body').css('overflow', 'hidden');
		},

		hideFrame: function() {
			this.oScreen.fadeOut('slow');
			this.oFrame.fadeOut('slow');
			$('body').css('overflow', 'auto');
		},

		resize: function() {
			this.loadImage(this.key, this.cur);
		}
	}
})(jQuery);

$(document).ready(function(){
	$('.imgmain').picSlide();
});

