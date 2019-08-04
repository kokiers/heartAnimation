
//  draw heart 20190804
 var heartAnimation = function(config) {

    this.width = config.width || 150,
    this.height = config.height || 150,
    this.pic = config.pic || false;
	this.IMG_SRC = config.src || './like.png';
	this.X = this.width/2,
	this.Y = this.height/2,
	this.el = config.el;
	this.cb = config.cb;
	
	this.out_time = 333;
	this.inner_time = 310;
	this.heart_time = 105;
	this.star_time = 300;	
	this.timer = null
};

heartAnimation.prototype = {
	init:function(){
	    this.canvas = document.createElement('canvas'),
	    this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.el.appendChild(this.canvas);

		var that = this;
		var basic = that.out_time+that.inner_time+that.heart_time*2+that.star_time;
		if (this.pic){
			var img = new Image();	
			img.src = this.IMG_SRC;

			img.onload = function(){
				that.start = (new Date()).getTime();
				that.timer = setInterval(function(){
					that.drawBasic(basic)
				},16);
			} 
		}else{
			this.start = (new Date()).getTime();
			that.timer = setInterval(function(){
				that.drawBasic(basic)
			},16);
		}
		
	},
	drawBasic(t,cb){

		this.ctx.clearRect(0,0,this.width,this.height);
		var now = (new Date()).getTime();
		var diff = now - this.start;
		var out_rate = (diff)/this.out_time;
		if(out_rate>=0){
			out_rate = Math.min(out_rate,1);
			this.drawOutCircle(this.X,this.Y,34*out_rate,'#fff'); 
		}else{
			this.drawOutCircle(this.X,this.Y,34,'#fff');
		}
		var inner_rate = (diff - this.out_time)/this.inner_time;
		if(inner_rate > 0){
			inner_rate = Math.min(inner_rate,0.9);
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.fillStyle = '#fff';
			var smallR = 22+(60-22)*inner_rate,
			bigR = smallR+16*(0.85-inner_rate);
			this.ctx.arc(this.X,this.Y,bigR,0,Math.PI*2);
			this.ctx.fill();
			this.ctx.restore();
			this.ctx.beginPath();
			this.ctx.save();
			this.ctx.globalCompositeOperation = 'destination-out';
			this.ctx.arc(this.X,this.Y,smallR,0,Math.PI*2);
			this.ctx.fill();
			this.ctx.restore();
		}
		var heart_rate = (diff - this.out_time)/this.heart_time;
		if( heart_rate >= 0){
			heart_rate = Math.min(heart_rate,2);
			if(heart_rate >=0 && heart_rate <=1){
				this.drawPics(heart_rate*1.44);
			}else if(heart_rate >1){
				this.drawPics(1.44-(heart_rate-1)*0.44);
			}
		}
		var star_rate = (diff - this.out_time - this.inner_time - this.heart_time)/this.star_time;
		if(star_rate <=1 && star_rate >=0){
			star_rate = Math.min(star_rate,1);
			this.drawStar(star_rate);
		}
		if(diff >= t){
			clearInterval(this.timer);
			this.el.removeChild(this.canvas)
			this.cb && this.cb();
		}
	},
	drawPics(t){
		console.log(this.pic)
		if (this.pic){
			this.drawHeartFromImg(t);
		}else{
			this.drawHeart(t);
		}
	},
	drawHeartFromImg(rate){
		this.ctx.beginPath();
		var img = new Image();
		img.src = this.IMG_SRC;
		var w = 28*rate,h = 28*rate;
		this.ctx.drawImage(img,0,0,28,28,this.X-w/2,this.Y-h/2,w,h);
	},
	drawOutCircle(x,y,r,color){
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.arc(x,y,r,0,Math.PI*2);
		this.ctx.fillStyle = color;
		this.ctx.fill();
		this.ctx.restore();
	},
	drawHeart(rate){
		this.ctx.beginPath();
		this.ctx.fillStyle = 'red';
		this.ctx.moveTo(this.X,this.Y);
		for(var i=0;i<360;i++){
			var angle = i*Math.PI/180,
			x = this.getX(rate,angle),
			y = this.getY(rate,angle);
			this.ctx.lineTo(x,y);
		}
		this.ctx.fill();
	},
	getX(r,t) { 
        return this.X + r * (16 * Math.pow(Math.sin(t), 3));  
    },
    getY(r,t) { 
        return this.Y - r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));  
    },
    drawStar(rate){
    	for(var i=0;i<6;i++){
    		this.ctx.beginPath();
    		var x = this.X+Math.cos(i*Math.PI/3)*(36+60*rate);
    		var y = this.Y+Math.sin(i*Math.PI/3)*(36+60*rate);
    		this.ctx.fillStyle = '#fff';
    		this.ctx.arc(x,y,2*(1-rate),0,2*Math.PI);
    		this.ctx.fill();
    	}
    }
}