/* V1.3 */
var Dmet = {};
var GLOBAlIE6= /msie 6/ig.test(window.navigator.userAgent) && !/msie [1-57-9]/ig.test(window.navigator.userAgent);
var GLOBALIE6= /msie 6/ig.test(window.navigator.userAgent) && !/msie [1-57-9]/ig.test(window.navigator.userAgent);
Dmet.alertBox = function(obj,pos){
	if(!obj){
		return null;
	};
	var that = this;
	this.obj = obj;
	this.left = (typeof pos.left == 'undefined')?'':pos.left;
	this.right = (typeof pos.right == 'undefined')?'':pos.right;
	this.top = (typeof pos.top == 'undefined')?'':pos.top;
	this.bottom = (typeof pos.bottom == 'undefined')?'':pos.bottom;
	this.animit = pos.animit||false;
	this.lock = pos.lock||false;
	this.opacity = pos.opacity||0.5;
	this.fixed = pos.fixed;
	if(typeof this.fixed === 'boolean'){
		this.fixed = pos.fixed
	}else{
		this.fixed = true	
	}
	this.setBody();
	this.creatMask();
	setTimeout(function(){
		obj.style.display = 'block';
		that.setPos(obj);
	},30);
	var that = this;
	this.bindResize();
};
Dmet.alertBox.prototype={
	setBody:function(){
		
		if(this.fixed){
			if(GLOBAlIE6){
				if((css(document.body,'backgroundAttachment') !== "fixed") && (css(document.body,'backgroundImage') === "none")){
					document.body.style.backgroundRepeat = "no-repeat";
					document.body.style.backgroundImage = "url(about:blank)";
					document.body.style.backgroundAttachment = "fixed";	
				}
				css(this.obj,{position:'absolute',zIndex:999});
			}else{
				css(this.obj,{position:'fixed',zIndex:999});
			}
		}else{
			css(this.obj,{position:'absolute',zIndex:999});
		}
		
	},
	creatMask:function(){
		if(this.lock){
			this.mask = document.createElement("div");
			var frame = document.createElement("iframe");
			frame.style.filter = 'alpha(opacity=0)';
			frame.style.opacity = 0;
			frame.style.width='100%';
			frame.style.height = '100%';
			if(this.animit){
				this.mask.style.cssText = 'width:100%;height:100%;background:black;filter:alpha(opacity='+this.opacity*100+');opacity:'+this.opacity+';position:fixed;top:0;left:0;_position:absolute;_top:expression((document).documentElement.scrollTop);_height:expression((document).documentElement.clientHeight);z-index:990';
			}else{
				this.mask.style.cssText = 'width:100%;height:100%;background:black;filter:alpha(opacity='+this.opacity*100+');opacity:'+this.opacity+';position:fixed;top:0;left:0;_position:absolute;_top:expression((document).documentElement.scrollTop);_height:expression((document).documentElement.clientHeight);z-index:990';
			}
			this.mask.appendChild(frame);
			document.body.appendChild(this.mask);
			if(this.animit){
				startMove(this.mask,{opacity:50});
			}
			this.obj.onkeypress = function(ev){
				var oEvent = ev || event;
				oEvent.cancelBubble = true;
			}
			document.onkeypress = function(ev){
				var oEvent = ev || event;
				if(oEvent.keyCode  == 13){
					return false;
				}
			}
		}
	},
	setPos:function(obj){	
		var dom = '(document.documentElement || document.body)';
		var domWidth = document.documentElement.offsetWidth || document.body.offsetWidth;
		var domHeight = document.documentElement.clientHeight || document.body.clientHeight;
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(obj){
			if(this.top == 'middle'){
				if(this.fixed){
					if(GLOBALIE6 && obj.style.setExpression){
						obj.style.setExpression('top', dom + '.scrollTop+'+(eval(dom).clientHeight-obj.offsetHeight)/2);
					}else{
						obj.style.marginTop = 0+'px';
						obj.style.top = '50%';
						obj.style.marginTop = (-obj.offsetHeight/2)+'px';
					}
				}else{
					obj.style.marginTop = 0+'px';
					obj.style.top = '50%';
					obj.style.marginTop = (-(obj.offsetHeight)/2+scrollTop)+'px';
				}
				
			}else{
				if(this.top!==''){
					if(this.fixed ){
						if(GLOBAlIE6 && obj.style.setExpression){
							obj.style.setExpression('top', dom + '.scrollTop+'+this.top);
						}else{
							obj.style.top = this.top+'px';			
						}
					}else{
						obj.style.top = (scrollTop+this.top)+'px';		
					}
				}			
			}
			if(this.left == 'center'){		
				obj.style.left = '50%';
				obj.style.marginLeft = -(obj.offsetWidth)/2+'px';
			}else{			
				if(this.left!==''){
					obj.style.marginLeft = 0+'px';
					obj.style.left = this.left+'px';
				}
			}
			if(this.right !==''){
				obj.style.marginLeft = 0+'px';
				obj.style.left = 'auto';			
				obj.style.right = this.right+'px';
			}
			if(this.bottom !==''){
				if(this.fixed ){
					if(GLOBAlIE6 && obj.style.setExpression){
						obj.style.setExpression('top', dom + '.scrollTop+'+(eval(dom).clientHeight-obj.offsetHeight-this.bottom));
					}else{	
						obj.style.top = 'auto';
						obj.style.bottom = this.bottom+'px';			
					}
				}else{
					obj.style.top = (scrollTop+domHeight-obj.offsetHeight-this.bottom)+'px';
				}
				
			}
		}
	},
	closeMask:function(obj){
		var that = this;
		var obj = this.obj || obj;
		if(!obj){return null;}
		if(this.mask){
			if(this.animit){
				startMove(this.mask,{opacity:0},function(){
					document.body.removeChild(that.mask);
					that.mask = null;
				})
			}else{
				document.body.removeChild(this.mask);
				this.mask = null;
			}
			document.onkeypress = function(){
				return true;
			}
		}		
		obj.style.display = 'none';		
		if(GLOBAlIE6 && obj.style.setExpression){
			obj.style.removeExpression('top');
			obj.style.removeExpression('left');
		}
	},
	bindResize:function(){
		if(!this.fixed){
			return null;
		}
		var that = this;
		var t = null;
		var b = true;
		var obj = this.obj;
		addEvent(window,'resize',function(){
			if(b){
				that.setPos(obj);
				if(t){
					clearTimeout(t);
					t = null;
				}
				b = false;
				t = setTimeout(function(){
					that.setPos(obj);
					b = true;
				},100)
				
			}
		})
	},
	bindScroll:function(){
		if(!this.obj || !this.fixed){
			return null;
		};
		var that = this;
		var t = null;
		var b = true;
		addEvent(window,'scroll',function(){
			
			if(b){
				that.setPos(that.obj);
				if(t){
					clearTimeout(t);
					t = null;
				}
				b = false;
				t = setTimeout(function(){
					that.setPos(that.obj);
					b = true;
				},200)
			}
		})	
	}
};