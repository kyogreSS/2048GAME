/**
 * Created by hjxuan on 2017/2/16.
 */
function CreateCraft() {
    this.n = 4;
    //棋盘大小
    this.arr = [];
    //棋盘数组
    this.dir = [];
    // 移动方向
    this.destory = [];
    // 是否被合并
    this.combine = [];
    // 是否合并了其他
    this.isOver = false;
    // 是否结束
    this.isGo = false;
    // 是否继续进行
    this.isWin = false;
    // 是否成功
    this.clickTime = 0;
    // 技能点击次数
    this.skillScore = 0;
    // 技能分数
    this.useSkill = false;
    // 是否点击了使用技能
    this.skillNum = {x1: -1, y1: -1, x2: -1, y2: -1};
    // 技能交换坐标
    this.score = 0;
    // 分数
    this.randomCraft={x:-1,y:-1,isFull:false};
    // 随机生成的坐标

    // 重置数据
    this.resetAll = function(){
        this.score = 0;
        this.isOver = false;
        this.isGo = false;
        this.isWin = false;
        this.clickTime = 0;
        this.skillScore = 0;
        this.useSkill = false;
        this.skillNum = {x1: -1, y1: -1, x2: -1, y2: -1};
        this.randomCraft={x:-1,y:-1,isFull:false};

        for (var i = 0; i < this.n; i++) {
            this.arr[i] = [];
            this.dir[i] = [];
            this.destory[i] = [];
            this.combine[i] = [];
            for (var j = 0; j < this.n; j++) {
                this.arr[i][j] = 0;
                this.dir[i][j] = -1;
                this.combine[i][j] = -1;
                this.destory[i][j] = -1;
            }
        }
    }

    // 重置方向，包含合并方向、是否被合并、是否合并了别的
    this.resetDirection = function () {
        for (var i = 0; i < this.n; i++)
            for (var j = 0; j < this.n; j++) {
                this.dir[i][j] = -1;
                this.destory[i][j] = -1;
                this.combine[i][j] = -1;
            }
    }


    // 随机生成
    this.createRandom = function (NumberTwoProbabilityOfOccurrence) {
        var arr2 = [];
        for (var i = 0; i < this.n; i++)
            for (var j = 0; j < this.n; j++) {
                if (this.arr[i][j] == 0) arr2[i * this.n + j] = i * this.n + j;
                else arr2[i * this.n + j] = -1;
            }
        for (var i = arr2.length - 1; i >= 0; i--)
            if (arr2[i] == -1) arr2.splice(i, 1);

        var k = parseInt(Math.random() * arr2.length);
        var num = Math.random() < NumberTwoProbabilityOfOccurrence ? 2 : 4;
        var x = parseInt(arr2[k] / this.n);
        var y = parseInt(arr2[k] % this.n);
        this.arr[x][y] = num;
        this.randomCraft.x=x;
        this.randomCraft.y=y;
        if (arr2.length <= 1) {this.randomCraft.isFull=true;}
            else this.randomCraft.isFull=false;
    }

    // 随机生成的数字出现动画
    this.newCraftAnimate=function(divName,numName,width,time){
        var $newDiv=$("."+divName+(this.randomCraft.x+1)+(this.randomCraft.y+1));
        $newDiv.css({"height":"0px","width":"0px","top":"+="+parseInt(width/2)+"px",left:"+="+parseInt(width/2)+"px"}).text(this.arr[this.randomCraft.x][this.randomCraft.y]).addClass(numName+this.arr[this.randomCraft.x][this.randomCraft.y])
            .animate({"height":width+"px","width":width+"px","top":"-="+parseInt(width/2)+"px",left:"-="+parseInt(width/2)+"px"},time);
    }

    // 放大一下合并的
    this.enlargeCraft=function(divName,width,large,time){
        var larger=parseInt(large/2);
        for (var i=0;i<this.n;i++)
            for (var j=0;j<this.n;j++)
            {
                if (this.combine[i][j]==1){
                    var $targetDiv = $("."+divName+(i+1)+(j+1));
                    $targetDiv.animate({"height":width+large+"px","width":width+large+"px","top":"-="+larger+"px","left":"-="+larger+"px"},time,function(){
                        $(this).animate({"height":width+"px","width":width+"px","top":"+="+larger+"px","left":"+="+larger+"px"},time);
                    });
                }
            }
    }

    // 判断结束
    this.endGame = function () {
        var endThis=true;
        for (var i = 0; i < this.n; i++)
            for (var j = 0; j < this.n; j++) {
                if (this.arr[i][j] == 0) endThis = false;
                if (i + 1 < this.n && this.arr[i][j] == this.arr[i + 1][j]) endThis = false;
                if (j + 1 < this.n && this.arr[i][j] == this.arr[i][j + 1]) endThis = false;
                if (!endThis){
                    this.isOver = false;
                    // alert(3);
                    return;
                }
            }
        // alert(3);
        this.isOver = true;
    }

    // 判断胜利
    this.winGame=function(maxNum){
        for (var i=0;i<this.n;i++)
            for (var j=0;j<this.n;j++)
                if (this.arr[i][j]>=maxNum)
                {
                    this.isWin=true;
                    return;
                }
        this.isWin=false;
    }

    // 核心，移动数据，进行移动判断
    this.changeFunc=function(direction){
        var isChange = false;
        if (direction == "up")
        {
            for (var i=0;i<this.n;i++)
            {
                // alert(i);
                for (var j=0;j<this.n;j++)
                {
                    if (this.arr[j][i] == 0) continue;
                    // alert(2);
                    for (var k=j+1;k<this.n;k++)
                    {
                        if (this.arr[k][i]==0) continue;
                        if (this.arr[j][i] !=this.arr[k][i]) break;
                        this.arr[j][i]+=this.arr[k][i];
                        this.score+=this.arr[j][i];
                        this.arr[k][i]=0;
                        this.dir[k][i]=j;
                        this.destory[k][i]=1;
                        this.combine[j][i]=1;
                        isChange = true;
                        break;
                    }
                }
                for (var j=0;j<this.n;j++){
                    if (this.arr[j][i]!=0) continue;
                    // alert(3);
                    for (var k=j+1;k<this.n;k++)
                    {
                        if (this.arr[k][i]==0) continue;
                        this.arr[j][i]=this.arr[k][i];
                        this.arr[k][i]=0;
                        this.dir[k][i]=j;
                        if (this.combine[k][i]==1) {
                            this.combine[j][i]=1;
                            this.combine[k][i]=-1;
                        }
                        isChange = true;
                        break;
                    }
                }
            }
        } else
        if (direction == "left")
        {
            for (var i=0;i<this.n;i++)
            {
                for (var j=0;j<this.n;j++)
                {
                    if (this.arr[i][j] == 0) continue;
                    for (var k=j+1;k<this.n;k++)
                    {
                        if (this.arr[i][k]==0) continue;
                        if (this.arr[i][j] !=this.arr[i][k]) break;
                        this.arr[i][j]+=this.arr[i][k];
                        this.score+=this.arr[i][j];
                        this.arr[i][k]=0;
                        this.dir[i][k]=j;
                        this.destory[i][k]=1;
                        this.combine[i][j]=1;
                        isChange = true;
                        break;
                    }
                }
                for (var j=0;j<this.n;j++){
                    if (this.arr[i][j]!=0) continue;
                    for (var k=j+1;k<this.n;k++)
                    {
                        if (this.arr[i][k]==0) continue;
                        this.arr[i][j]=this.arr[i][k];
                        this.arr[i][k]=0;
                        this.dir[i][k]=j;
                        isChange = true;
                        if (this.combine[i][k]==1) {
                            this.combine[i][j]=1;
                            this.combine[i][k]=0;
                        }
                        break;
                    }
                }
            }
        } else
        if (direction == "right")
        {
            for (var i=0;i<this.n;i++)
            {
                for (var j=this.n-1;j>=0;j--)
                {
                    if (this.arr[i][j] == 0) continue;
                    for (var k=j-1;k>=0;k--)
                    {
                        if (this.arr[i][k]==0) continue;
                        if (this.arr[i][j] !=this.arr[i][k]) break;
                        this.arr[i][j]+=this.arr[i][k];
                        this.score+=this.arr[i][j];
                        this.arr[i][k]=0;
                        this.dir[i][k]=j;
                        this.destory[i][k]=1;
                        this.combine[i][j]=1;
                        isChange = true;
                        break;
                    }
                }
                for (var j=this.n-1;j>=0;j--){
                    if (this.arr[i][j]!=0) continue;
                    for (var k=j-1;k>=0;k--)
                    {
                        if (this.arr[i][k]==0) continue;
                        this.arr[i][j]=this.arr[i][k];
                        this.arr[i][k]=0;
                        this.dir[i][k]=j;
                        if (this.combine[i][k]==1) {
                            this.combine[i][j]=1;
                            this.combine[i][k]=0;
                        }
                        isChange = true;
                        break;
                    }
                }
            }
        } else
        if (direction=="down")
        {
            for (var i=0;i<this.n;i++)
            {
                for (var j=this.n-1;j>=0;j--)
                {
                    if (this.arr[j][i] == 0) continue;
                    for (var k=j-1;k>=0;k--)
                    {
                        if (this.arr[k][i]==0) continue;
                        if (this.arr[j][i] !=this.arr[k][i]) break;
                        this.arr[j][i]+=this.arr[k][i];
                        this.score+=this.arr[j][i];
                        this.arr[k][i]=0;
                        this.dir[k][i]=j;
                        this.destory[k][i]=1;
                        this.combine[j][i]=1;
                        isChange = true;
                        break;
                    }
                }
                for (var j=this.n-1;j>=0;j--){
                    if (this.arr[j][i]!=0) continue;
                    for (var k=j-1;k>=0;k--)
                    {
                        if (this.arr[k][i]==0) continue;
                        this.arr[j][i]=this.arr[k][i];
                        this.arr[k][i]=0;
                        this.dir[k][i]=j;
                        if (this.combine[k][i]==1) {
                            this.combine[j][i]=1;
                            this.combine[k][i]=0;
                        }
                        isChange = true;
                        break;
                    }
                }
            }
        }
        return isChange;
    }

    // 核心，在页面上生成棋盘
    this.createChess = function(containerName,craftName,divName,numName){
        var $container = $("."+containerName);
        $container.empty();
        for (var i=0;i<this.n;i++)
            for (var j=0;j<this.n;j++)
            {
                var $div = $("<div class='"+craftName+" "+divName+(i+1)+(j+1)+"'></div>");
                if (this.arr[i][j]!=0){
                    $div.text(this.arr[i][j]).addClass(numName+this.arr[i][j]);
                }
                $div.appendTo($container);
            }
    }
    // 核心，移动动画效果
    this.craftAnimate=function(direction,divName,width,border,time){
        if (direction=="up")
        {
            for (var i=0;i<this.n;i++)
                for (var j=this.n-1;j>=0;j--)
                if (this.dir[j][i]!=-1)
                {
                    var k=this.dir[j][i];
                    // if (this.dir[k][i]!=-1 && this.combine[k][i] == 1) k=this.dir[k][i];
                    if (this.destory[j][i]==1 && this.dir[k][i]!=-1){k=this.dir[k][i];}
                    var $targetDiv = $("."+divName+(j+1)+(i+1));
                    $targetDiv.css("z-index",(5-j)*100).animate({"top":width*k+border+"px"},time);
                    // if (this.destory[j][i] && this.dir[k][i]!=-1){k=this.dir[k][i];}
                    // $targetDiv.animate({"top":width*k+"px"},time);
                }
        } else
        if (direction == "left")
        {
            for (var i=0;i<this.n;i++)
                for (var j=this.n-1;j>=0;j--)
                    if (this.dir[i][j]!=-1)
                    {
                        var k=this.dir[i][j];
                        if (this.destory[i][j]==1 && this.dir[i][k]!=-1){k=this.dir[i][k];}
                        var $targetDiv = $("."+divName+(i+1)+(j+1));
                        $targetDiv.css("z-index",(5-j)*100).animate({"left":width*k+border+"px"},time);
                    }
        } else
        if (direction == "right")
        {
            for (var i=0;i<this.n;i++)
                for (var j=0;j<this.n;j++)
                    if (this.dir[i][j]!=-1)
                    {
                        var k=this.dir[i][j];
                        if (this.destory[i][j]==1 && this.dir[i][k]!=-1){k=this.dir[i][k];}
                        var $targetDiv = $("."+divName+(i+1)+(j+1));
                        $targetDiv.css("z-index",(5-j)*100).animate({"left":width*k+border+"px"},time);
                    }
        } else
        if (direction=="down")
        {
            for (var i=0;i<this.n;i++)
                for (var j=0;j<this.n;j++)
                    if (this.dir[j][i]!=-1)
                    {
                        var k=this.dir[j][i];
                        // if (this.dir[k][i]!=-1 && this.combine[k][i] == 1) k=this.dir[k][i];
                        if (this.destory[j][i]==1 && this.dir[k][i]!=-1){k=this.dir[k][i];}
                        var $targetDiv = $("."+divName+(j+1)+(i+1));
                        $targetDiv.css("z-index",(5-j)*100).animate({"top":width*k+border+"px"},time);
                        // if (this.destory[j][i] && this.dir[k][i]!=-1){k=this.dir[k][i];}
                        // $targetDiv.animate({"top":width*k+"px"},time);
                    }
        }
    }

    // 技能判断是否可以使用
    this.skillCanUse=function(num,target){
        if (this.skillScore>=num){
            this.skillScore = num;
            this.useSkill = true;
            var $skillButton = $(target);
            $skillButton.show();
        }
    }
}


// 结束界面显示
function endGameAnimate(isWin,isOver,divId){
    var $disabled = $(divId);
    if (isWin){
        $disabled.children("p").text("You Win!!!");
        $disabled.children("div").text("PLAYAGAIN");
        $disabled.fadeIn(500);
    } else {
        if (isOver) {
            $disabled.children("p").text("Game Over");
            $disabled.children("div").text("REPLAY");
            $disabled.fadeIn(500);
        } else {
            $disabled.children("p").text("Start Game");
            $disabled.children("div").text("PLAY");
            $disabled.fadeIn();
        }
    }
    // $disabled.show();
}

// 加分效果显示
function addScore(score,increase,target,scoreGain,top,leng,time){
    var $targetScore = $(target);
    var $scoreGain = $(scoreGain);
    $targetScore.text(score);
    if (increase!=0){
        $scoreGain.show().text("+"+increase).animate({"top":"-="+leng+"px","opacity":"1"},time,function(){
            $scoreGain.animate({"top":"-=10"+leng+"px","opacity":"0"},time,function(){
                $scoreGain.hide().css("top",top+"px");
            })
        });
    }
}

// 点击效果
function divClick(divName,Craft,shineDivName,shineSkillName,width,border,time){
    var $targetDiv = $(divName);
    $targetDiv.on("click",ckickEvent=function() {
        if ($(this).text()!="" && !Craft.useSkill) {
            if (Craft.clickTime == 0) {
                // 点击一次,记录下x1 y1；
                Craft.skillNum.x1=parseInt($(this).index()/Craft.n);
                Craft.skillNum.y1=parseInt($(this).index()%Craft.n);
                Craft.clickTime++;
                $(this).addClass(shineDivName);
                // if ()
            } else
            // 如果第二次点击相同的方块
            if (parseInt($(this).index()/Craft.n)==Craft.skillNum.x1 && parseInt($(this).index()%Craft.n)==Craft.skillNum.y1){
                Craft.clickTime--;
                $(this).removeClass(shineDivName);
            }
            else
            // 点击不同的方块，交换并结束,注意判断一下是否结束
            {
                Craft.skillNum.x2=parseInt($(this).index()/Craft.n);
                Craft.skillNum.y2=parseInt($(this).index()%Craft.n);

                var $div1=$(".div"+(Craft.skillNum.x1+1)+(Craft.skillNum.y1+1));
                var $div2=$(".div"+(Craft.skillNum.x2+1)+(Craft.skillNum.y2+1));

                var k=Craft.arr[Craft.skillNum.x1][Craft.skillNum.y1];
                Craft.arr[Craft.skillNum.x1][Craft.skillNum.y1]=Craft.arr[Craft.skillNum.x2][Craft.skillNum.y2];
                Craft.arr[Craft.skillNum.x2][Craft.skillNum.y2]=k;

                // 执行动画
                $div1.animate({"top":Craft.skillNum.x2*width+border+"px","left":Craft.skillNum.y2*width+border+"px"},time);
                $div2.animate({"top":Craft.skillNum.x1*width+border+"px","left":Craft.skillNum.y1*width+border+"px"},time);

                var suicide = false;

                Craft.endGame();

                suicide = Craft.isOver;
                // alert(suicide);
                skillBackground(0,500,524);

                setTimeout(function() {
                    Craft.createChess("container","craft","div","num");

                    Craft.clickTime = 0;
                    $targetDiv.off("click");
                    $(".craft").removeClass(shineDivName);
                    $("#skill").hide().removeClass(shineSkillName);
                    Craft.skillScore = 0;
                    // alert("up");
                    Craft.isGo = true;

                    if (suicide) {
                        endGameAnimate(Craft.isWin,suicide,"#disabled");
                        saveBestScore(Craft.score,"bestScore");
                    }
                    // $("")
                },time);
            }
        }
    });
}

// 重置技能背景
function skillBackground(now,max,height){
    var $target = $("#ability");
    var leng=height;

    if (now<max) {
        leng = parseInt(now / max * height);
        $target.removeClass("abilityShine");
    } else {
        $target.addClass("abilityShine");
    }
    // var leng = height;
    // if (num<leng)
    $target.css({"height":leng+"px","top":height-leng});
}


// 在cookie中找最高分
function findBestScore(cookieName){
    var bestScore=getCookie(cookieName);
    // alert(bestScore);
    if (bestScore!=null && bestScore!=""){
        return bestScore;
    }
    else
    {
        return 0;
    }
    // document.cookie="bestScore="+score;
}
// 检查cookie
function getCookie(bestScore_name)
{
    if (document.cookie.length>0)
    {
        var bestScore_start=document.cookie.indexOf(bestScore_name + "=");
        if (bestScore_start!=-1)
        {
            bestScore_start=bestScore_start + bestScore_name.length+1;
            var bestScore_end=document.cookie.indexOf(";",bestScore_start);
            if (bestScore_end==-1) bestScore_end=document.cookie.length;
            return unescape(document.cookie.substring(bestScore_start,bestScore_end));
        }
    }
    return "";
}

// 保存最高分
function saveBestScore(score,cookieName){
    if (score > parseFloat(findBestScore(cookieName)))
        document.cookie=cookieName+"="+escape(score);
    // alert(score);
}

// 显示最高分
function showBestScore(target,cookieName){
    var $showBestScore = $(target);
    var bestScore = findBestScore(cookieName);
    $showBestScore.text(bestScore);
    // alert(bestScore);
}


$(function(){
    var craft = new CreateCraft();
    function beginGame(){
        hideSkill(craft);
        craft.resetAll();
        craft.createRandom();
        craft.createRandom();
        craft.createChess("container","craft","div","num");
        addScore(craft.score,0,"#showScore span","#scoreGain",40,10,100);
        craft.isGo=true;
        showBestScore("#showBestScore span","bestScore");
    }
    // beginGame();

    // 按键开始
    $("#disabled>div").click(function(){
        beginGame();
        $("#disabled").hide();
    });

    // 按键重新开始
    $("#replay").click(function(){
        beginGame();
        $("#disabled").hide();
    });

    // 按键使用技能
    $("#skill").click(function(){
       if (craft.useSkill){
           craft.useSkill = false;
           craft.isGo = false;
           divClick(".craft",craft,"craftShine","skillShine",130,5,100);
           $(this).addClass("skillShine");
       } else {
           craft.useSkill = true;
           craft.isGo = true;
           $(this).removeClass("skillShine");
           $(".craft").removeClass("craftShine").off("click");
           craft.clickTime = 0;
       }

    });

    // 重置技能键
    function hideSkill(Craft){
        Craft.clickTime = 0;
        $(".craft").removeClass("craftShine").off("click");
        $("#skill").hide().removeClass("skillShine");
        Craft.skillScore = 0;
        Craft.isGo = true;
        skillBackground(0,3000,525);
    }


    // craft.n=5;
    var increase=0;
    $("body").keydown(function(e){
        if (craft.isGo){
            // craft.isGo=false;
            var ev=e || window.event;
            ev.stopPropagation();
            ev.preventDefault();
            var isChanged=false;
            increase=craft.score;
            // alert(ev.keyCode);
            switch (ev.keyCode){
                case 38:isChanged=craft.changeFunc("up");break;
                case 37:isChanged=craft.changeFunc("left");break;
                case 39:isChanged=craft.changeFunc("right");break;
                case 40:isChanged=craft.changeFunc("down");break;
            }
            if (isChanged){
                craft.isGo = false;
                switch (ev.keyCode){
                    case 38:craft.craftAnimate("up","div",130,5,130);break;
                    case 37:craft.craftAnimate("left","div",130,5,130);break;
                    case 39:craft.craftAnimate("right","div",130,5,130);break;
                    case 40:craft.craftAnimate("down","div",130,5,130);break;
                }

                increase = craft.score-increase;

                setTimeout(function(){
                    // craft.isGo=true;
                    addScore(craft.score,increase,"#showScore span","#scoreGain",40,10,100);
                    craft.createChess("container","craft","div","num");
                    craft.createRandom(0.8);
                    craft.newCraftAnimate("div","num",120,160);
                    craft.enlargeCraft("div",120,8,80);

                    craft.skillScore+=increase;
                    craft.skillCanUse(100,"#skill");
                    skillBackground(craft.skillScore,100,524);

                    setTimeout(function(){
                        craft.resetDirection();

                        craft.winGame(2048);
                        // $("#testshow").html(craft.arr[0] + "<br/>" + craft.arr[1] + "<br/>" + craft.arr[2] + "<br/>" + craft.arr[3]);

                        if (craft.randomCraft.isFull) {craft.endGame();}
                        if (!craft.isWin  &&  !craft.isOver){
                            // alert(1);
                            craft.isGo=true;
                        } else {
                            // alert("end");
                            hideSkill(craft);
                            endGameAnimate(craft.isWin,craft.isOver,"#disabled");
                            saveBestScore(craft.score,"bestScore");
                        }
                    },160);
                },130);
                // $("#testshow").html(craft.arr[0] + "<br/>" + craft.arr[1] + "<br/>" + craft.arr[2] + "<br/>" + craft.arr[3]);
                // $("#testshow2").html(craft.dir[0] + "<br/>" + craft.dir[1] + "<br/>" + craft.dir[2] + "<br/>" + craft.dir[3]);
                // $("#testshow3").html(craft.destory[0] + "<br/>" + craft.destory[1] + "<br/>" + craft.destory[2] + "<br/>" + craft.destory[3]);
            }
        }
        return false;
    });
})