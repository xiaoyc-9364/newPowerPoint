window.addEventListener('load', function() {
	addImgSlide();
	


}, false); 

function addImgSlide() {
	var aImg = document.getElementsByTagName('img');
	var len = aImg.length;
	var json = {};
	for (var i = 0; i < len; i++) {
		var imgData = aImg[i].getAttribute('data-imggroup');
		if (imgData) {
			if (!json[imgData]) {
				json[imgData] = [];
				json[imgData].push(aImg[i]);
			} else {
				json[imgData].push(aImg[i]);
			}
		}
	}
	var frame = new PowerPoint(json);
	document.addEventListener('resize', function() {
		frame.resize(document.body);
	}, false);
}

function PowerPoint(json) {
	this.opts = json;
	this.init();
}
PowerPoint.prototype.init = function() {
	this.addEvent();
}

PowerPoint.prototype.addEvent = function() {
	var _this = this;
	for (var k in _this.opts) {
		(function(k) {
			var len = _this.opts[k].length;

			for(var i = 0; i < len; i++) {
				(function(i) {
					_this.opts[k][i].addEventListener('click', function() {
						var that = this;
						_this.createFrame(that);
						document.addEventListener('keyup', function(event) {	//按下键盘Esc键，关闭详图
							if (event.keyCode == 27) {
								_this.frameClose();
							}
						},false);

						_this.oPrev.addEventListener('click', function() {
							var oldImg = document.getElementById('oldImg');
							_this.oFrame.removeChild(oldImg);
							i--;
							if ( i <= 0) {
								i = 0;
								this.style.display = 'none';
							}
							_this.oNext.style.display = 'block';

							var curImg = _this.opts[k][i].cloneNode(true)
							curImg.setAttribute('id', 'oldImg');
							_this.oFrame.appendChild(curImg);
							var imgMessage = curImg.getAttribute('alt');
							_this.addDescription(imgMessage, i + 1, len)
						}, false);

						_this.oNext.addEventListener('click', function() {
							var oldImg = document.getElementById('oldImg');
							_this.oFrame.removeChild(oldImg);
							i++;
							if ( i >= len-1) {
								i = len-1;
								this.style.display = 'none';
							}
							_this.oPrev.style.display = 'block';

							var curImg = _this.opts[k][i].cloneNode(true)
							curImg.setAttribute('id', 'oldImg');
							_this.oFrame.appendChild(curImg)
							var imgMessage = curImg.getAttribute('alt');
							_this.addDescription(imgMessage, i + 1, len)

						}, false);

						document.addEventListener('click', function(event) {
							var oPrevWidth = _this.oPrev.offsetWidth,
								oFrameHeight = _this.oFrame.offsetHeight,
								oFrameWidth = _this.oFrame.offsetWidth,
								oFrameLeft = _this.oFrame.offsetLeft- oFrameWidth / 2,
								oFrameRight = oFrameLeft + oFrameWidth;
								oFrameTop = _this.oFrame.offsetTop - oFrameHeight / 2;
							if (event.clientX < oFrameLeft || event.clientX > oFrameRight || event.clientY < oFrameTop || event.clientY > (oFrameTop + oFrameHeight)) {
								// if(_this.oFrame){
								// 	_this.frameClose();
								// }
							}
							
						}, false);
			
						_this.oClose.addEventListener('click', function() {	//关闭
							_this.frameClose();
						}, false);
						var imgMessage = this.getAttribute('alt');
						_this.addDescription(imgMessage, i + 1, len);
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
	this.oPrev.setAttribute('class', 'prev');
	this.oPrev.innerHTML = '<';	

	this.oNext = document.createElement('button');
	this.oNext.setAttribute('class', 'next');
	this.oNext.innerHTML = '>';	

	this.oClose = document.createElement('a');		//创建关闭按钮
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
};

PowerPoint.prototype.createBtn = function() {
	this.oPrev = document.createElement('button');	//创建上一张及下一张按钮
	this.oPrev.setAttribute('class', 'prev');
	this.oPrev.innerHTML = '<';	

	this.oNext = document.createElement('button');
	this.oNext.setAttribute('class', 'next');
	this.oNext.innerHTML = '>';	

	this.oFrame.appendChild(this.oPrev);
	this.oFrame.appendChild(this.oNext);
};

PowerPoint.prototype.frameClose = function() {
	document.body.removeChild(this.oFrame);
	document.body.removeChild(this.oScreen);
};

PowerPoint.prototype.addDescription = function(str, index, len) {
	this.imgMessage.innerHTML = str;						//图片信息添加内容
	this.pageNum.innerHTML = index + " / " +  len;		//页码
};
PowerPoint.prototype.resize = function(obj) {
	this.oScreen.style.width = obj.offsetWidth + 'px';
	this.oScreen.style.height = obj.offsetHeight + 'px';
	this.oFrame.style.maxWidth = obj.offsetWidth * 0.9 + 'px';
	this.oFrame.style.maxHeight = obj.offsetHeight * 0.9 + 'px';
}
PowerPoint.prototype.move = function(obj) {
	 nthis.frameClose();
	this.createFrame()
	
}