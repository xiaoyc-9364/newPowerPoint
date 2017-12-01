window.addEventListener('load', function() {
	addImgSlide();
}, false);

function addImgSlide() {
	var allImg = document.getElementsByTagName('img');	//获取页面中所有img
	var len = allImg.length;
	var imgGroup = {};
	var frame = null;
	for (var i = 0; i < len; i++) {	
		var aImg = allImg[i];	
		var imgData = aImg.getAttribute('data-imggroup');
		if (imgData) {					//判断是否有'data-imggroup'属性
			if (!imgGroup[imgData]) {		//判断json中是否有与'data-imggroup'值相同的属性
				imgGroup[imgData] = [aImg];		//没有则在json中添加一个'data-imggroup'值为名称的数组
				imgGroup[imgData].push();	//并将该img添加到数组中
			} else {
				imgGroup[imgData].push(aImg);	//如果有'data-imggroup'值相同的属性，将该图片添加到数组中
			}
		}
	}
	return new PowerPoint(imgGroup);
}

function PowerPoint(opts) {		//参数：拥有不用图片元素数组的对象
	this.options = opts;
	this.init();
};

PowerPoint.prototype.init = function() {
	this.createFrame();
	this.addEvent();
};

PowerPoint.prototype.createFrame = function() {	//创建图片详情方法
	this.oScreen = document.createElement('div');	//创建屏幕遮罩
	this.oScreen.setAttribute('class', 'frame_screen');	//设置class，用于css

	this.oFrame = document.createElement('div');	//创建显示框
	this.oFrame.setAttribute('class', 'frame_detail');

	this.oImg = document.createElement('img');	
	this.oImg.setAttribute('class', 'frame_img');
	this.oFrame.appendChild(this.oImg);

	this.oPrev = document.createElement('button');	//创建上一张及下一张按钮
	this.oPrev.setAttribute('class', 'frame_btn frame_prev');
	this.oPrev.innerHTML = '<';	
	this.oFrame.appendChild(this.oPrev);

	this.oNext = document.createElement('button');
	this.oNext.setAttribute('class', 'frame_btn frame_next');
	this.oNext.innerHTML = '>';	
	this.oFrame.appendChild(this.oNext);

	this.oClose = document.createElement('button');		//创建关闭按钮
	this.oClose.setAttribute('class', 'frame_hide');
	this.oClose.innerHTML = '×';
	this.oFrame.appendChild(this.oClose);

	this.pageNum = document.createElement('p');		//页码信息
	this.pageNum.setAttribute('class', 'frame_pagenum');
	this.oFrame.appendChild(this.pageNum);

	this.imgMessage = document.createElement('p');	//图片描述信息
	this.imgMessage.setAttribute('class', 'frame_message');
	this.oFrame.appendChild(this.imgMessage);

	document.body.appendChild(this.oFrame);			//将显示框添加到body
	document.body.appendChild(this.oScreen);		//屏幕遮罩添加到body
};

PowerPoint.prototype.addEvent = function() {
	var _this = this;
	for (var k in _this.options) {	//遍历对象
		(function(k) {
			var len = _this.options[k].length;	//对象k属性的数组长度
				for(var i = 0; i < len; i++) {
					(function(i) {
						_this.options[k][i].addEventListener('click', function() {	//点击图片
							_this.showFrame();	//创建详情
							_this.loadImg(k, i);
						}, false);
					})(i);
				}
		})(k);
	}
	document.addEventListener('keydown', function(event) {	
		switch(event.keyCode) {		//按下键盘Esc键，关闭详图
			case 27:
				_this.hideFrame();
				break;
			case 37: 				//左方向键上一张
				_this.tabImg(-1);
				break;
			case 39: 				//有方向键下一张
				_this.tabImg(1);
				break;
			case 32: 				//有空格键下一张
				_this.tabImg(1);
				break;
		}
	},false);

	_this.oPrev.addEventListener('click', function() {	//上一张
		_this.tabImg(-1);
	}, false);
	_this.oNext.addEventListener('click', function() {	//下一张
		_this.tabImg(1);				
	}, false);

	_this.oScreen.addEventListener('click', function() { //关闭按钮
		_this.hideFrame();
	}, false);

	_this.oClose.addEventListener('click', function() {	//关闭按钮
		_this.hideFrame();
	}, false);
};

PowerPoint.prototype.loadImg = function(property, index) {  //加载图片
	this.key = property;
	this.cur = index;
	var len = this.options[property].length;

	this.cur = Math.max(0, Math.min(this.cur, len-1));
	var imgSrc = this.options[this.key][this.cur].getAttribute('src');
	var imgAlt = this.options[this.key][this.cur].getAttribute('alt');
	
	this.oImg.setAttribute('src', imgSrc);
	this.imgMessage.innerHTML = imgAlt;						//图片信息添加内容
	this.pageNum.innerHTML = (this.cur + 1) + " / " +  len;			//页码
	

	var imgW = this.oImg.offsetWidth,
		imgH = this.oImg.offsetHeight,
		pageW = window.innerWidth,
		pageH = window.innerHeight;
	// if (imgW >= pageW && imgH <= pageH) {
	// 	this.oImg.style.width = pageW + 'px';
	// } else if (imgW <= pageW && imgH >= pageH) {
	// 	this.oImg.style.height = pageH + 'px';
	// } else if (imgW >= pageW && imgH >= pageH) {
	// 	var scaleW = imgW / pageW,
	// 		scaleH = imgH / pageH;
	// 	if (scaleW > scaleH) {
	// 		this.oImg.style.height = pageH + 'px';
	// 	} else {
	// 		this.oImg.style.width = pageW + 'px';
	// 	}
	// }
	


};

PowerPoint.prototype.tabImg = function(n) {		//切换图片
	var len = this.options[this.key].length;
	var timer = null;
	this.loadImg(this.key, this.cur + n);

	if ( this.cur <= 0) {	//判断是否为第一张
		this.oPrev.classList.add('hide_btn');	//隐藏上一张按钮
	} else if (this.cur >= (len - 1)) {
		this.oNext.classList.add('hide_btn'); //隐藏下一张按钮
	} else {
		this.oPrev.classList.remove('hide_btn');
		this.oNext.classList.remove('hide_btn');
	}
};

PowerPoint.prototype.hideFrame = function() {		//关闭详情图片
	this.oFrame.style.display = 'none';
	this.oScreen.style.display = 'none';
	document.body.style.overflow = 'auto';
};

PowerPoint.prototype.showFrame = function() {		//关闭详情图片
	this.oFrame.style.display = 'block';
	this.oScreen.style.display = 'block';
	document.body.style.overflow = 'hidden';
};

PowerPoint.prototype.frameResize = function (newWidth, newHeight) {
	this.oFrame.style.width = newWidth + 'px';
	this.oFrame.style.height = newHeight + 'px';
};

function getStyle( obj,attr ){	
	return obj.currentStyle ? obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}