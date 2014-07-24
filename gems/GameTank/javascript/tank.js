/**
 * Created by jack on 14-7-18.
 */




function TankModel(context, tankstatus) {
    if (this instanceof TankModel) {
        this.context = context
        this.x = tankstatus.x
        this.y = tankstatus.y
        this.color = tankstatus.color
        this.speed = tankstatus.speed
        this.direction = ""
        this.bullet = {}
    } else {
        return new TankModel(context,tankstatus)
    }
}

TankModel.prototype = {
    constructor: TankModel,
    down: function () {
        this.direction = "down"
        this.eraser()
        if (this.y + this.speed <= 130){
            this.y = this.y + this.speed
        }
        this.context.fillStyle = "#BA9658"
        this.context.fillRect(this.x, this.y, 5, 30)
        this.context.fillRect(this.x + 15, this.y, 5, 30)
        this.context.fillRect(this.x + 6, this.y + 5, 8,20)
        this.context.fillStyle = this.color
        this.context.arc(this.x + 10, this.y + 15, 4, 0, 2*Math.PI, true);
        this.context.fill();
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 1.5;
        this.context.beginPath();
        this.context.moveTo(this.x + 10, this.y + 15);
        this.context.lineTo(this.x+10,this.y+30)
        this.context.closePath()
        this.context.stroke();
    },
    up:function(){
        this.direction = "up"
        this.eraser()
        if (this.y - this.speed >= 0){
            this.y = this.y - this.speed
        }
        this.context.fillStyle = "#BA9658"
        this.context.fillRect(this.x, this.y, 5, 30)
        this.context.fillRect(this.x + 15, this.y, 5, 30)
        this.context.fillRect(this.x + 6, this.y + 5, 8,20)
        this.context.fillStyle = this.color
        this.context.arc(this.x + 10, this.y + 15, 4, 0, 2*Math.PI, true);
        this.context.fill();
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 1.5;
        this.context.beginPath();
        this.context.moveTo(this.x + 10, this.y + 15);
        this.context.lineTo(this.x+10,this.y)
        this.context.closePath()
        this.context.stroke();
    },
    right:function(){
        this.direction = "right"
        this.eraser()
         if (this.x + this.speed <= 275){
           this.x  = this.x +this.speed
             }
        //画出自己的坦克，使用前面的绘图技术
        //设置颜色
        this.context.fillStyle="#BA9658";
        //韩老师使用 先死--->后活 (初学者最好用这个方法)
        //先画出左面的矩形
        this.context.fillRect(this.x,this.y,30,5);
        //画出右边的矩形(这时请大家思路->一定要一个参照点)
        this.context.fillRect(this.x,this.y+15,30,5);
        //画出中间矩形
        this.context.fillRect(this.x+5,this.y+6,20,8);
        //画出坦克的盖子
        this.context.fillStyle=this.color;
        this.context.arc(this.x+15,this.y+10,4,0,2*Math.PI,true);
        this.context.fill();
        //画出炮筒(直线)
        this.context.strokeStyle=this.color;
        //设置线条的宽度
        this.context.lineWidth=1.5;
        this.context.beginPath();
        this.context.moveTo(this.x+15,this.y+10);
        this.context.lineTo(this.x+30,this.y+10);
        this.context.closePath()
        this.context.stroke();
    },
    left:function(){
        this.direction = "left"
        this.eraser()
        if (this.x - this.speed >= 0){
            this.x  = this.x - this.speed
        }
        //画出自己的坦克，使用前面的绘图技术
        //设置颜色
        this.context.fillStyle="#BA9658";
        //韩老师使用 先死--->后活 (初学者最好用这个方法)
        //先画出左面的矩形
        this.context.fillRect(this.x,this.y,30,5);
        //画出右边的矩形(这时请大家思路->一定要一个参照点)
        this.context.fillRect(this.x,this.y+15,30,5);
        //画出中间矩形
        this.context.fillRect(this.x+5,this.y+6,20,8);
        //画出坦克的盖子
        this.context.fillStyle= this.color;
        this.context.arc(this.x+15,this.y+10,4,0,2*Math.PI,true);
        this.context.fill();
        //画出炮筒(直线)
        this.context.strokeStyle=this.color;
        //设置线条的宽度
        this.context.lineWidth=1.5;
        this.context.beginPath();
        this.context.moveTo(this.x+15,this.y+10);
        this.context.lineTo(this.x,this.y+10);
        this.context.closePath()
        this.context.stroke();
    },
    eraser:function(){
        this.context.clearRect(0,0,610,320)
    }


}
var canvas = document.getElementById("playGame")
var gem = {
    init: function () {
        var context = canvas.getContext("2d")
        var radTank = {x:12,y:12,color:"red",speed:10}
        hero =  TankModel(context,radTank)
        hero.left()
        var keybroadEvent = {
            keyboardUp:hero.up,
            keyboardDown:hero.down,
            keyboardRight:hero.right,
            keyboardLeft:hero.left
        }
        this.getCharCode(keybroadEvent)
    },
    getCharCode:function(fn){
        document.onkeydown = function(e){
            var isIe = (document.all) ? true:false
            var key;
            if(isIe){
                key = window.event.keyCode;
            }else{
                key = e.which
            }
            switch (key){
                case 37:
                    fn.keyboardLeft.call(hero);
                    break;
                case 38:
                    fn.keyboardUp.call(hero);
                    break;
                case 39:
                    fn.keyboardRight.call(hero);
                    break;
                case 40:
                    fn.keyboardDown.call(hero);
                    break;
                case 32:
                    factoryBullet(hero)

            }
        }
    }
}
function Bullet(tankObj,speed){
    if (this instanceof Bullet){
        this.context = tankObj.context;
        this.x = tankObj.x;
        this.y = tankObj.y;
        this.speed = speed;
        this.direction = tankObj.direction;
        tankObj.bullet = this
        this.bullets = []
    }else{
       return new Bullet(tankObj,speed)
    }
}
Bullet.prototype = {
    constructor:Bullet,
    init:function(){
     if(this.direction == "right" || this.direction == "left"){
         this.x = this.x +9;
         this.y = this.y +10;
     }else{
         this.x = this.x +10;
         this.y = this.y +9;
     }

    },
    locus:function(){
        switch (this.direction){
            case "up":
              this.y = this.y - this.speed;
                break;
            case "down":
                this.y = this.y + this.speed;
                break;
            case "right":
                this.x = this.x +this.speed;
                break;
            case "left":
                this.x = this.x - this.speed;

                break;
        }
        this.bullets.push({x:this.x,y:this.y})
        this.render()
        var eraser = this.eraser
        var x = this.x
        var y = this.y
        var context = this.context
        setTimeout(function(){eraser(x,y,context)},500)
    },
    render:function(){
    this.context.fillStyle = "red"
    this.context.fillRect(this.x,this.y,2,2);
    this.context.fill();
    this.context.closePath();
    },
    eraser:function(x,y,context){
     context.clearRect(x,y,2,2)
    }
}
function factoryBullet(tank){
   var bullet = Bullet(tank,5)
    bullet.init()
   while (0 <= bullet.x && bullet.x <= 300 && 0 <= bullet.y && bullet.y<= 140 ){
       bullet.locus()
   }

}
gem.init()