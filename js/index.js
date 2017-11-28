window.addEventListener('load', function() {
	addImgSlide();
	function addImgSlide() {
		var aImg = document.getElementsByTagName('img');
		var len = aImg.length;
		// var arr = [];
		// for(var i = 0; i < len; i++) {
		// 	if (aImg[i].getAttribute('data-imggroup')){
		// 		arr.push(aImg[i]);
		// 	}
		// }
		// var json = {};
		// var newLen = arr.length;
		// for (var j = 0; j < newLen; j++) {
		// 	if (!json[arr[j].getAttribute('data-imggroup')]) {
		// 		json[arr[j].getAttribute('data-imggroup')] = [];
		// 		json[arr[j].getAttribute('data-imggroup')].push(arr[j]);
		// 	} else {
		// 		json[arr[j].getAttribute('data-imggroup')].push(arr[j]);
		// 	}
		// }
		var json = {};
		for (var i = 0; i < len; i++) {
			if (aImg[i].getAttribute('data-imggroup')) {
				if (!json[aImg[i].getAttribute('data-imggroup')]) {
					json[aImg[i].getAttribute('data-imggroup')] = [];
					json[aImg[i].getAttribute('data-imggroup')].push(aImg[i]);
				} else {
					json[aImg[i].getAttribute('data-imggroup')].push(aImg[i]);
				}
			}
		}
		console.log(json);
		var frame = new PowerPoint(json);
		
	}


}, false);

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
						_this.createFrame(this);

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
	this.oFrame = document.createElement('div');	//创建显示框
	this.oPrev = document.createElement('button');	//创建上一张及下一张按钮
	this.oNext = document.createElement('button');	
	this.oClose = document.createElement('a');		//创建关闭按钮
	this.pageNum = document.createElement('p');		//页码信息
	this.imgMessage = document.createElement('p');	//图片描述信息
	var newObj = obj.cloneNode(true);				//复制传入的对象

	this.oScreen.setAttribute('class', 'screen');	//设置各个的class，用于css
	this.oFrame.setAttribute('class', 'frame');
	this.oClose.setAttribute('class', 'close');
	this.imgMessage.setAttribute('class', 'message');
	this.pageNum.setAttribute('class', 'pagenum');

	this.oClose.innerHTML = '×';					//创建的按钮及信息添加到显示框中
	this.oFrame.appendChild(this.imgMessage);
	this.oFrame.appendChild(this.pageNum);
	this.oFrame.appendChild(newObj);
	this.oFrame.appendChild(this.oClose);

	document.body.appendChild(this.oFrame);			//将显示框添加到body
	document.body.appendChild(this.oScreen);		//屏幕遮罩添加到body
};

PowerPoint.prototype.frameClose = function() {
	document.body.removeChild(this.oFrame);
	document.body.removeChild(this.oScreen);
};

PowerPoint.prototype.addDescription = function(str, index, len) {
		this.imgMessage.innerHTML = str;						//图片信息添加内容
		this.pageNum.innerHTML = index + " / " +  len;		//页码
};

PowerPoint.prototype.go = function(n) {

}