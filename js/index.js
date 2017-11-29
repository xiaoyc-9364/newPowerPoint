window.addEventListener('load', function() {
	addImgSlide();
	window.addEventListener('resize', function() {
			frame.resize(document.body.offsetWidth, document.body.offsetHeight);
		}, false); 
}, false);
function addImgSlide() {
	var aImg = document.getElementsByTagName('img');	//获取页面中所有img
	var len = aImg.length;
	var json = {};
	for (var i = 0; i < len; i++) {		
		var imgData = aImg[i].getAttribute('data-imggroup');
		if (imgData) {					//判断是否有'data-imggroup'属性
			if (!json[imgData]) {		//判断json中是否有与'data-imggroup'值相同的属性
				json[imgData] = [];		//没有则在json中添加一个'data-imggroup'值为名称的数组
				json[imgData].push(aImg[i]);	//并将该img添加到数组中
			} else {
				json[imgData].push(aImg[i]);	//如果有'data-imggroup'值相同的属性，将该图片添加到数组中
			}
		}
	}
	return frame = new PowerPoint(json);
	window.addEventListener('resize', function() {
		frame.resize(document.body.offsetWidth, document.body.offsetHeight);
	}, false);
}

function PowerPoint(json) {		//参数：拥有不用图片元素数组的对象
	this.opts = json;
	this.init();
}
PowerPoint.prototype.init = function() {
	this.addEvent();
}

PowerPoint.prototype.addEvent = function() {
	var _this = this;
	for (var k in _this.opts) {	//遍历对象
		(function(k) {
			var len = _this.opts[k].length;	//对象k属性的数组长度
			for(var i = 0; i < len; i++) {
				(function(i) {
					_this.opts[k][i].addEventListener('click', function() {	//点击图片
						_this.createFrame(this);	//创建详情

						var imgMessage = this.getAttribute('alt');		
						_this.addDescription(imgMessage, i + 1, len);	//添加页面信息及页码

						document.addEventListener('keydown', function(event) {	
							switch(event.keyCode) {		//按下键盘Esc键，关闭详图
								case 27:
									_this.frameClose();	
									break;
								case 37: 				//左方向键上一张
									_this.tabImg(k, --i);
									if (i <= 0) {		
										i = 0;
									}
									break;
								case 39: 				//有方向键下一张
									_this.tabImg(k, ++i);
									if (i >= len - 1) {
										i = len - 1;
									}
									break;
							}
						},false);

						_this.oPrev.addEventListener('click', function() {	//上一张
							_this.tabImg(k, --i);
							if (i <= 0) {
								i = 0;
							}
						}, false);

						_this.oNext.addEventListener('click', function() {	//下一张
							_this.tabImg(k, ++i);
							if (i >= len - 1) {
								i = len - 1;
							}
						}, false);

						document.addEventListener('click', function(event) {
							// var oFrameHeight = _this.oFrame.offsetHeight,
							// 	oFrameWidth = _this.oFrame.offsetWidth,
							// 	oFrameLeft = _this.oFrame.offsetLeft- oFrameWidth / 2,
							// 	oFrameRight = oFrameLeft + oFrameWidth;
							// 	oFrameTop = _this.oFrame.offsetTop - oFrameHeight / 2;

							// if (event.clientX < oFrameLeft || event.clientX > oFrameRight 
							// 	|| event.clientY < oFrameTop || event.clientY > (oFrameTop + oFrameHeight)) {
							// 	// if(_this.oFrame){
							// 		_this.frameClose();
							// 	// }
							// }
							var target = event.target;
							var targetName = target.nodeName.toLowerCase()
							if (targetName != 'img' && targetName != 'p' && targetName != 'button') {
								_this.frameClose();
							}
							
						}, false);
			
						_this.oClose.addEventListener('click', function() {	//关闭按钮
							_this.frameClose();
						}, false);
						
					}, false);
				})(i);
			}
		})(k);
	}


};

PowerPoint.prototype.createFrame = function(obj) {	//创建图片详情方法
	this.oScreen = document.createElement('div');	//创建屏幕遮罩
	this.oScreen.setAttribute('class', 'screen');	//设置class，用于css

	this.oFrame = document.createElement('div');	//创建显示框
	this.oFrame.setAttribute('class', 'frame');

	this.oPrev = document.createElement('button');	//创建上一张及下一张按钮
	this.oPrev.setAttribute('class', 'ctrl_btn prev');
	this.oPrev.innerHTML = '<';	

	this.oNext = document.createElement('button');
	this.oNext.setAttribute('class', 'ctrl_btn next');
	this.oNext.innerHTML = '>';	

	this.oClose = document.createElement('button');		//创建关闭按钮
	this.oClose.setAttribute('class', 'close');
	this.oClose.innerHTML = '×';

	this.pageNum = document.createElement('p');		//页码信息
	this.pageNum.setAttribute('class', 'pagenum');

	this.imgMessage = document.createElement('p');	//图片描述信息
	this.imgMessage.setAttribute('class', 'message');

	var newObj = obj.cloneNode(true);				//复制传入的对象
	newObj.setAttribute('id', 'oldImg');

	this.oFrame.appendChild(this.imgMessage);
	this.oFrame.appendChild(this.pageNum);
	this.oFrame.appendChild(this.oClose);
	this.oFrame.appendChild(this.oPrev);
	this.oFrame.appendChild(this.oNext);
	this.oFrame.appendChild(newObj);
	

	document.body.appendChild(this.oFrame);			//将显示框添加到body
	document.body.appendChild(this.oScreen);		//屏幕遮罩添加到body

	document.body.style.overflow = 'hidden';

};

PowerPoint.prototype.frameClose = function() {		//关闭详情图片
	document.body.removeChild(this.oFrame);
	document.body.removeChild(this.oScreen);
	document.body.style.overflow = 'auto';
};

PowerPoint.prototype.addDescription = function(str, index, len) {
	this.imgMessage.innerHTML = str;						//图片信息添加内容
	this.pageNum.innerHTML = index + " / " +  len;			//页码
};

PowerPoint.prototype.resize = function(newWith, newHeight) {
	this.oScreen.style.width = newWith + 'px';
	this.oScreen.style.height = newHeight + 'px';
	this.oFrame.style.maxWidth = newWith * 0.9 + 'px';
	this.oFrame.style.maxHeight = newHeight * 0.9 + 'px';
}
PowerPoint.prototype.tabImg = function(property, index) {
	var len = this.opts[property].length;
	var timer = null;
	if ( index <= 0) {	//判断是否为第一张
		index = 0;
		this.oPrev.style.display = 'none';	//隐藏上一张按钮
	} else if (index > 0 && index < len - 1) {
		this.oNext.style.display = 'block';
		this.oPrev.style.display = 'block';
	} else if (index >= (len - 1)) {
		index = len - 1;
		this.oNext.style.display = 'none'; //隐藏下一张按钮
	}
	var oldImg = this.oFrame.getElementsByTagName('img')[0];	//获取到详图中的唯一一张照片
	var _this = this;
	
	this.oFrame.style.width = oldImg.offsetWidth + 'px';		
	this.oFrame.style.height = oldImg.offsetHeight + 'px';

	this.oFrame.removeChild(oldImg);							//从详图中移除

	var curImg = _this.opts[property][index].cloneNode(true);	//复制需要显示是图片
	var imgMessage = curImg.getAttribute('alt');				//更新图片描述及页码
	_this.addDescription(imgMessage, index + 1, len);

	clearTimeout(timer);
	timer = setTimeout(function() {		//延时加载新图片
		_this.oFrame.appendChild(curImg);							//添加到详图中
		_this.oFrame.style.width = curImg.style.width;				//更新详图的宽高
		_this.oFrame.style.height = curImg.style.height;
	}, 300);
};

PowerPoint.prototype.frameResize = function (newWidth, newHeight) {
	this.oFrame.width = newWidth + 'px';
	this.oFrame.height = newHeight + 'px';
}