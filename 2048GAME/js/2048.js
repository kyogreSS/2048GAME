/**
 * Created by hjxuan on 2017/2/12.
 */
$(function(){
    var arr=[];
    // 数字
    var dir=[];
    // 方向
    var destory=[];
    //是否被合并
    var combine=[];
    // 是否合并了其他方块
    var score=0;
    //得分
    var isOver = false;
    // 结束
    var isGo=false;
    // 键盘是否有效
    var isWin = false;
    // 胜利
    var clickTime=0;
    //点击数量
    var skillScore=0;
    //技能蓄力
    var useSkill=false;
    // 是否使用技能
    var skillNum={x1:-1,y1:-1,x2:-1,y2:-1};
    // 两个相互交换的坐标


    // 初始化各数组
    function resetAll() {
        score=0;
        isOver=false;
        isGo=false;
        isWin=false;
        clickTime=0;
        skillScore=0;
        useSkill=false;
        skillNum={x1:-1,y1:-1,x2:-1,y2:-1};
        for (var i = 0; i <= 3; i++) {
            arr[i] = [];
            dir[i] = [];
            combine[i] = [];
            destory[i] = [];
            for (var j = 0; j <= 3; j++) {
                arr[i][j] = 0;
                dir[i][j] = -1;
                destory[i][j] = -1;
                combine[i][j] = -1;
            }
        }
    }
    resetAll();

    // 清空方向数组
    function resetDirection(){
        for (var i=0;i<=3;i++)
            for (var j=0;j<=3;j++) {
                dir[i][j] = -1;
                destory[i][j]=-1;
                combine[i][j]=-1;
            }

    }



    // 随机生成方块

    function createRandom(){
        var arr2=[];
        for (var i=0;i<=3;i++)
            for (var j=0;j<=3;j++)
            {
                if (arr[i][j]==0) arr2[i*4+j] = i*4+j;
                 else arr2[i*4+j] = -1;
            }
        for (var i=arr2.length-1;i>=0;i--){
            if (arr2[i] == -1){arr2.splice(i,1);}
        }
        // $("#testshow4").html(arr2.join(","));
        // if (arr2.length!=0) {
        var k = parseInt(Math.random() * arr2.length);
        var num = Math.random() <= 0.8 ? 2 : 4;
        var x = parseInt(arr2[k] / 4);
        var y = parseInt(arr2[k] % 4);
        arr[parseInt(arr2[k] / 4)][parseInt(arr2[k] % 4)] = num;
        newCraft(x+1,y+1);
        if (arr2.length == 1){
            //生成最后一个随机数后判断是否结束
            if (endGame()){
                isOver=true;
            } else {
                // 没结束
                // alert("马达马达");
            }
        }
        // }
    }

    // 生成新方块的动画效果
    function newCraft(x,y){
        var $newDiv=$(".div"+x+y);
        // alert(1);
        // alert($newDiv.text());
        $newDiv.css({"height":"0px","width":"0px","top":"+=65px","left":"+=65px","font-size":"0px","line-height":"0px"}).text(arr[x-1][y-1]).addClass("num"+arr[x-1][y-1])
            .animate({"height":"120px","width":"120px","top":"-=65px","left":"-=65px","font-size":"50px","line-height":"120px"},100);
        // alert(1);
    }


    // 判断结束
    function endGame(){
        for (var i=0;i<=3;i++){
            for (var j=0;j<=3;j++){
                if (arr[i][j]==0) return false;
                if (i+1<=3 && arr[i][j]==arr[i+1][j]){
                    return false;
                }
                if (j+1<=3 && arr[i][j]==arr[i][j+1]){
                    return false;
                }
            }
        }
        return true;
    }

    // 判断胜利
    function winGame(){
        for (var i=0;i<=3;i++){
            for (var j=0;j<=3;j++){
                if (arr[i][j]>=2048) return true;
            }
        }
        return false;
    }

    // 结束动画
    function endGameAnimate(isWin,isOver){

        var $disabled = $("#disabled");

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


    // 生成div棋盘
    function createChess(){
        var $container = $(".container");
        $container.empty();
        for (var i=0;i<=3;i++)
            for (var j=0;j<=3;j++){
                var $div = $("<div class='craft div"+(i+1)+(j+1)+"'></div>")
                if (arr[i][j]!=0) {
                    $div.text(arr[i][j]);
                    $div.addClass("num"+arr[i][j]);
                };
                $div.appendTo($container);
            }
    }


    // 执行移动动画
    function chessBoardAnimate(direction){
        if (direction =="up"){
            for (var i=0;i<=3;i++){
                for (var j=3;j>=0;j--)
                if (dir[j][i]!=-1)
                {
                    var k=dir[j][i];

                    if (dir[k][i]!=-1 && destory[k][i]== 1) k=dir[k][i];

                    var $targetDiv = $(".div"+(j+1)+(i+1));
                    $targetDiv.css("z-index",(5-j)*100);

                    // alert("坐标x:"+i+"坐标y:"+j+"坐标z:"+$targetDiv.css("z-index"));
                    $targetDiv.animate({"top":130*(k)+5+"px"},150);


                }
            }
        } else
        if (direction == "left"){
            for (var i=0;i<=3;i++){
                for (var j=3;j>=0;j--)
                    if (dir[i][j]!=-1)
                    {
                        var k=dir[i][j];
                        // if (k==0) continue;
                        if (dir[i][k]!=-1 && destory[i][k]== 1) k=dir[i][k];

                        var $targetDiv = $(".div"+(i+1)+(j+1));
                        $targetDiv.css("z-index",(5-j)*100);
                        $targetDiv.animate({"left":130*(k)+5+"px"},150);
                    }
            }
        } else
        if (direction == "right"){
            for (var i=0;i<=3;i++){
                for (var j=0;j<=3;j++)
                    if (dir[i][j]!=-1)
                    {
                        var k=dir[i][j];
                        // if (k==0) continue;
                        // while (dir[i][k]!=-1 && k!=3){
                        //     k=dir[i][k];
                        // }
                        if (dir[i][k]!=-1 && destory[i][k]== 1) k=dir[i][k];

                        var $targetDiv = $(".div"+(i+1)+(j+1));
                        $targetDiv.css("z-index",j*100);
                        $targetDiv.animate({"left":130*(k)+5+"px"},150);
                    }
            }
        } else
        if (direction == "down"){
            for (var i=0;i<=3;i++){
                for (var j=0;j<=3;j++)
                    if (dir[j][i]!=-1)
                    {
                        var k=dir[j][i];
                        if (dir[k][i]!=-1 && destory[k][i]== 1) k=dir[k][i];
                        var $targetDiv = $(".div"+(j+1)+(i+1));
                        $targetDiv.css("z-index",j*100);
                        $targetDiv.animate({"top":130*(k)+5+"px"},150);
                    }
            }
        }
    }

    //执行合并后放大一下的动画
    function enlarge(){
        for (var i=0;i<=3;i++){
            for (var j=0;j<=3;j++) {
                // alert(1);
                // alert(destory[i][j]);
                if (combine[i][j] == 1) {
                    // alert(1);
                    var $div = $(".div" + (i + 1) + (j + 1));
                    // alert(1);
                    $div.animate({"height": "138px","width":"138px", "top": "-=9px","left":"-=9px"}, 80, function () {
                        $(this).animate({"height": "120px","width":"120px", "top": "+=9px","left":"+=9px"}, 80);
                    })
                }
            }
        }
    }



    // 开始函数
    function beginGame(){
        // resetDirection();

        resetAll();
        hideSkill();
        createRandom();
        createRandom();
        createChess();
        addScore(score,0);
        showBestScore();
        isGo=true;
        // arr[1][1]=2048;
    }


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





    // 修改数组
    function changeFunc(key){
        var isChanged = false;
        if (key == "up"){
            for (var i=0;i<=3;i++){
                for (var j=0;j<=3;j++){
                    // var num=0;
                    if (arr[j][i]==0) continue; else {
                        for (var k = j + 1; k <= 3; k++)
                            if (arr[k][i] != 0 && arr[k][i] == arr[j][i]) {
                                arr[j][i] = arr[j][i] + arr[k][i];
                                score=score+arr[j][i];
                                arr[k][i] = 0;
                                isChanged = true;
                                dir[k][i]=j;
                                destory[j][i]= 1;
                                combine[j][i]= 1;
                                break;
                            }
                            else if (arr[k][i] != 0 && arr[k][i] != arr[j][i]) break;
                    }
                }
                // alert(1);
                for (var j=0;j<=3;j++){
                    // if (arr[j][i]>=2048) {isWin=true;};
                    var k=j+1;
                    var all = false;
                    while(arr[j][i]==0 && k<=3){
                        if (arr[k][i]!=0) {
                            arr[j][i]=arr[k][i];
                            arr[k][i]=0;
                            dir[k][i]=j;
                            if (combine[k][i]==1) {
                                combine[k][i]=-1;
                                combine[j][i]=1;
                            }
                            // alert(1);
                            // alert(arr[k][i]);
                            // alert(dir[k][i]);
                            isChanged = true;
                        }
                        k++;
                        if (k>3) all=true;
                    }
                    if (all) break;
                }
            }
        } else
        if (key == "left"){
            for (var i=0;i<=3;i++){
                for (var j=0;j<=3;j++){
                    // var num=0;
                    if (arr[i][j]==0) continue; else {
                        for (var k = j + 1; k <= 3; k++)
                            if (arr[i][k] != 0 && arr[i][j] == arr[i][k]) {
                                arr[i][j] = arr[i][j] + arr[i][k];
                                score+=arr[i][j];
                                arr[i][k] = 0;
                                dir[i][k]=j;
                                isChanged = true;
                                destory[i][j]=1;
                                combine[i][j]=1;
                                break;
                            }
                            else if (arr[i][k] != 0 && arr[i][k] != arr[i][j]) break;
                    }
                }
                for (var j=0;j<=3;j++) {
                    // if (arr[i][j]>=2048) {isWin=true;alert(1);}
                    var k=j+1;
                    var all = false;
                    while(arr[i][j]==0 && k<=3){
                        if (arr[i][k]!=0) {
                            arr[i][j]=arr[i][k];
                            arr[i][k]=0;
                            dir[i][k]=j;
                            isChanged = true;
                            if (combine[i][k]==1){
                                combine[i][k]=-1;
                                combine[i][j]=1;
                            }
                        }
                        k++;
                        if (k>3) all=true;
                    }
                    if (all) break;
                }
            }
        } else
        if (key == "right"){
            for (var i=0;i<=3;i++){
                for (var j=3;j>=0;j--){
                    // var num=0;
                    if (arr[i][j]==0) continue; else {
                        for (var k = j - 1; k >= 0; k--)
                            if (arr[i][k] != 0 && arr[i][k] == arr[i][j]) {
                                arr[i][j] = arr[i][j] + arr[i][k];
                                score+=arr[i][j];
                                arr[i][k] = 0;
                                dir[i][k]=j;
                                isChanged = true;
                                destory[i][j]=1;
                                combine[i][j]=1;
                                break;
                            }
                            else if (arr[i][k] && arr[i][k] != arr[i][j]) break;
                    }
                }
                for (var j=3;j>=0;j--){
                    // if (arr[i][j]>=2048) isWin=true;
                    var k=j-1;
                    var all = false;
                    while(arr[i][j]==0 && k>=0){
                        if (arr[i][k]!=0) {
                            arr[i][j]=arr[i][k];
                            arr[i][k]=0;
                            dir[i][k]=j;
                            isChanged = true;
                            if (combine[i][k]==1){
                                combine[i][k]=-1;
                                combine[i][j]=1;
                            }
                        }
                        k--;
                        if (k<0) all=true;
                    }
                    if (all) break;
                }
            }
        }
        else
        if (key =="down"){
            for (var i=0;i<=3;i++){
                for (var j=3;j>=0;j--){
                    if (arr[j][i]==0) continue;
                    else {
                        for (var k = j - 1; k >= 0; k--)
                            if (arr[k][i] != 0 && arr[k][i] == arr[j][i]) {
                                arr[j][i] = arr[j][i] + arr[k][i];
                                score+=arr[j][i];
                                arr[k][i] = 0;
                                dir[k][i]=j;
                                isChanged = true;
                                destory[j][i]=1;
                                combine[j][i]=1;
                                break;
                            }
                            else if (arr[k][i] != 0 && arr[k][i] != arr[j][i]) break;
                    }
                }
                for (var j=3;j>=0;j--){
                    // if (arr[j][i]>=2048) isWin=true;
                    var k=j-1;
                    var all = false;
                    while(arr[j][i]==0 && k>=0){
                        if (arr[k][i]!=0) {
                            arr[j][i]=arr[k][i];
                            arr[k][i]=0;
                            dir[k][i]=j;
                            isChanged = true;
                            if (combine[k][i]==1){
                                combine[k][i]=-1;
                                combine[j][i]=1;
                            }
                        }
                        k--;
                        if (k<0) all=true;
                    }
                    if (all) break;
                }
            }
        }
    if (isChanged) return true; else return false;
    }


    // 加分动画效果
    function addScore(score,increase){
        var $targetScore = $("#showScore span");
        var $scoreGain = $("#scoreGain");
        $targetScore.text(score);
        if (increase!=0){
            $scoreGain.show().text("+"+increase).animate({"top":"-=10px","opacity":"1"},100,function(){
                $scoreGain.animate({"top":"-=10px","opacity":"0"},100,function(){
                    $scoreGain.hide().css("top","40px");
                })
            });
        }
    }

    // 在cookie中找最高分
    function findBestScore(){

        var bestScore=getCookie('bestScore')
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
            var bestScore_start=document.cookie.indexOf(bestScore_name + "=")
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
    function saveBestScore(score){
        // document.cookie="BestScore="+score;
        // var exdate=new Date()
            // exdate.setDate(exdate.getDate())
        if (score > parseFloat(findBestScore()))
            document.cookie="bestScore="+escape(score);
        // ((ex==null) ? "" : ";expires="+exdate.toGMTString())
    }

    // 显示最高分
    function showBestScore(){
        var $showBestScore = $("#showBestScore span");
        var bestScore = findBestScore();
        $showBestScore.text(bestScore);
    }

    // alert(parseInt(5%4));
    // alert(parseInt(5/4));
    // alert(1);
    // 点击div事件
    function divClick(){
        var $targetDiv = $(".craft");
        $targetDiv.on("click",ckickEvent=function() {
            if ($(this).text()!="" && !useSkill) {
                // clickTime++;
                // alert(clickTime);
                if (clickTime == 0) {
                    // 点击一次,记录下x1 y1；
                    skillNum.x1=parseInt($(this).index()/4);
                    skillNum.y1=parseInt($(this).index()%4);
                    clickTime++;
                    $(this).addClass("craftShine");
                    // if ()
                } else
                    // 如果第二次点击相同的方块
                if (parseInt($(this).index()/4)==skillNum.x1 && parseInt($(this).index()%4)==skillNum.y1){
                    clickTime--;
                    $(this).removeClass("craftShine");
                    }
                else
                    // 点击不同的方块，交换并结束,注意判断一下是否结束
                {
                    skillNum.x2=parseInt($(this).index()/4);
                    skillNum.y2=parseInt($(this).index()%4);

                    var $div1=$(".div"+(skillNum.x1+1)+(skillNum.y1+1));
                    var $div2=$(".div"+(skillNum.x2+1)+(skillNum.y2+1));

                    var k=arr[skillNum.x1][skillNum.y1];
                    arr[skillNum.x1][skillNum.y1]=arr[skillNum.x2][skillNum.y2];
                    arr[skillNum.x2][skillNum.y2]=k;

                    // 执行动画
                    $div1.animate({"top":skillNum.x2*130+5+"px","left":skillNum.y2*130+5+"px"},100);
                    $div2.animate({"top":skillNum.x1*130+5+"px","left":skillNum.y1*130+5+"px"},100);

                    var suicide = false;

                    suicide = endGame();

                    skillBackground(0,500,524);

                    setTimeout(function() {
                        createChess();
                        clickTime = 0;
                        $targetDiv.off("click");
                        $(".craft").removeClass("craftShine");
                        $("#skill").hide().removeClass("skillShine");
                        skillScore = 0;
                        // alert("up");
                        isGo = true;

                        if (suicide) {
                            endGameAnimate(isWin,suicide);
                            saveBestScore(score);
                        }
                        // $("")
                    },100);
                }
            }
        });
    }

    // divClick();
    //技能能使用
    function skillCanUse(){
        var $skillButton = $("#skill");
        // divClick();
        useSkill=true;
        $skillButton.show();
    }

    // 技能键点击事件
    $("#skill").click(function(){
        if (useSkill) {
            // 如果点击，开始选择
            useSkill=false;
            isGo=false; //不能控制键盘
            divClick(); //加事件
            // alert(1);
            $(this).addClass("skillShine"); //添加光亮
            // alert(1);
        } else {
            // 如果中途点断，全部取消
            useSkill=true;
            isGo=true;
            $(this).removeClass("skillShine");
            $(".craft").removeClass("craftShine").off("click");
            clickTime=0;

            // alert(2);
            // $skillButton.unbind("click");
        }
    });

    // 重置技能键
    function hideSkill(){
        clickTime = 0;
        $(".craft").removeClass("craftShine").off("click");
        $("#skill").hide().removeClass("skillShine");
        skillScore = 0;
        isGo = true;
        skillBackground(0,3000,525);
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



    // 按键的时候运行
    $("body").keydown(function(e){
        if (isGo){
            var ev = e || window.event;
            // isGo=false;
            // alert(ev.keyCode);
            var increase = score;
            // arr[1][2]=2048;
            ev.stopPropagation();
            ev.preventDefault();
            var isChanged=false;
            switch (ev.keyCode){
                case 38:isChanged=changeFunc("up");break;
                case 37:isChanged=changeFunc("left");break;
                case 39:isChanged=changeFunc("right");break;
                case 40:isChanged=changeFunc("down");break;
            }

            if (isChanged) {
                isGo=false;
                switch (ev.keyCode) {
                    case 38:
                        chessBoardAnimate("up");
                        break;
                    case 37:
                        chessBoardAnimate("left");
                        break;
                    case 39:
                        chessBoardAnimate("right");
                        break;
                    case 40:
                        chessBoardAnimate("down");
                        break;
                }
                increase = score - increase;

                // createRandom();
                // resetDirection();
                // createChessBoard();
                setTimeout(function () {
                    addScore(score,increase);
                    createChess();
                    createRandom();
                    // setTimeout(createChess,100);
                    // createRandom();
                    enlarge();
                    resetDirection();

                    skillScore+=increase;
                    // if (skillScore>=10) {skillScore=10;useSkill=true;}
                    if (skillScore>=500) {
                        skillScore=500;
                        // skillBackground(0,3000,525);
                        skillCanUse();
                    }
                    skillBackground(skillScore,500,524);

                    // alert(skillScore);

                    // alert(isWin);
                    setTimeout(function(){
                        isWin=winGame();
                        if (!isOver && !isWin)
                        {
                        isGo=true;}
                        else {
                            hideSkill();
                            endGameAnimate(isWin,isOver);
                            saveBestScore(score);
                        }
                        // if (isWin){
                        //     endGameAnimate(isWin,isOver);
                        // }
                    },120);
                }, 130);
                // setTimeout(enlarge,1001);
                // $("#testshow").html(arr[0] + "<br/>" + arr[1] + "<br/>" + arr[2] + "<br/>" + arr[3]);
                // $("#testshow2").html(dir[0] + "<br/>" + dir[1] + "<br/>" + dir[2] + "<br/>" + dir[3]);
                // $("#testshow3").html(destory[0] + "<br/>" + destory[1] + "<br/>" + destory[2] + "<br/>" + destory[3]);
            }
        }
        return false;
    });
});