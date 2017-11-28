window.addEventListener('load', function() {
	var oWrapper = document.getElementById('wrapper');
	var json = {
		imgDescription: ['aaaaaaa', 'bbbbbbbb', 'cccccc', 'dddddddd'],
		imgData: ['image/1.png','image/2.png','image/3.png','image/4.png']
	};

	var frame = new PowerPoint(oWrapper, json);

}, false);

function PowerPoint(obj, opt) {		//参数：包裹元素，包含图片信息的对象
		this.wrapper = obj;			
		this.options = opt;
		this.init();
	}

	PowerPoint.prototype.init = function() {	//初始化方法
		this.createNode();		//生成元素
		this.addEvent();		//添加事件
	};

	PowerPoint.prototype.createNode = function() {	//生成元素
		this.imgMain = document.createElement('div');	//创建一个包含图片的div
		this.len = this.options.imgData.length;			//图片个数
		var oImg;
		for (var i = 0; i< this.len; i++) {
			oImg = document.createElement('img');		//创建图片
			oImg.setAttribute('src', this.options.imgData[i]);
			oImg.setAttribute('index', i);	//创建索引
			this.imgMain.appendChild(oImg); //添加到div中
		}
		this.imgMain.setAttribute('class', 'imgmain');	//添加class用于样式
		this.wrapper.appendChild(this.imgMain);		//div添加到包裹元素中
	};

	PowerPoint.prototype.addEvent = function() {
		var _this = this;
		this.imgMain.addEventListener('click', function(event) {	//包含图片div绑定事件
			var target = event.target;								//事件目标
			if (target.nodeName.toLowerCase() === 'img') {			//判断目标类型
				_this.createFrame(target);							//打开详情

				document.addEventListener('click', function(event) {
					if (_this.oFrame) {
						var newTarget = event.target;
						var targetType = newTarget.nodeName.toLowerCase();
						
						if (targetType !== 'img' && targetType !== 'p') {
							_this.frameClose();
						}
						// var mouseX = event.clientX,
						// 	mouseY = event.clientY;
						// if (mouseX < _this.oFrame.offsetLeft || mouseX > (_this.oFrame.offsetLeft + _this.oFrame.offsetWidth)) {
						// 	_this.frameClose();
						// }
					}
					
				}, false);

				_this.oClose.addEventListener('click', function() {	//关闭
					_this.frameClose();
				}, false);

				var num = parseInt(target.getAttribute('index'));	//获取目标索引
				_this.addDescription(_this.options.imgDescription[num], num + 1);	//添加描述及页码
			}
		}, false);
	
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

	PowerPoint.prototype.addDescription = function(str, index) {
		this.imgMessage.innerHTML = str;						//图片信息添加内容
		this.pageNum.innerHTML = index + " / " +  this.len;		//页码
	};

	PowerPoint.prototype.frameClose = function() {
		document.body.removeChild(this.oFrame);
		document.body.removeChild(this.oScreen);
	};