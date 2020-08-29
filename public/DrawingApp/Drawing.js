var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var flag = false;

//從localStorage中讀圖
var str = localStorage.getItem("d1");
if (str != null) {
    var img = new Image();
    img.src = str;
    img.addEventListener("load", function () {
        context.drawImage(img, 0, 0);
    })
}




//開始畫圖
canvas.addEventListener("mousedown", function (event) {
    flag = true;
    //console.log(event.offsetX + "," + event.offsetY)
    //to do 開始一個新路徑，產生後再使用繪圖指令來設定路徑。
    context.beginPath();

    //to do 移動畫筆到指定的滑鼠點選的位置上
    //使用event.offsetX 取得滑鼠的x軸座標點
    //使用event.offsetY 取得滑鼠的y軸座標點
    context.moveTo(event.offsetX,event.offsetY)

    //讀取使用者選取的顏色
    var color = document.querySelector("#color1").value;
    //讀取使用者設定線條的寬度
    var w = document.querySelector("#number1").value;

    //to do 設定線條顏色
    context.strokeStyle = color;

    //to do 設定線條寬度
    context.lineWidth = w;
}, false);

//畫圖中
canvas.addEventListener("mousemove", function (event) {
    if (flag) {
        //to do 從目前繪圖點畫一條直線到滑鼠點選的位置上
        //使用event.offsetX 取得滑鼠的x軸座標點
        //使用event.offsetY 取得滑鼠的y軸座標點
        //console.log(event.offsetX + "," + event.offsetY)
        context.lineTo(event.offsetX,event.offsetY);
        //to do 畫出圖形的線條
        context.stroke();
    }
}, false);

//結束畫圖
canvas.addEventListener("mouseup", function (event) {
    flag = false;
}, false);




//儲存
document.querySelector("#buttonSave").addEventListener("click", function () { 
        var myImg = document.querySelector("#img1");
        myImg.src = canvas.toDataURL("image/png");

        //連線 navigator.onLine回傳true    
    if (navigator.onLine) {
        //連線
        //檔案傳到Server
        console.log('online')
        //透過fetch上傳檔案
        var formData = new FormData();
        var canvasData = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
        formData.append("imageData", canvasData);
        formData.append("id", new Date().getTime());
        fetch('/api/base64', {
            'method': 'post',
            'body': formData
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (txt) {
                alert(txt);
                //清除Canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
                //刪除localStorage中的資料
                localStorage.removeItem("d1")
            })
    } else {
        //離線
        //檔案存到Client
        //localstorage
        console.log('offline')
        localStorage.setItem("d1", canvas.toDataURL("image/png"));

    }

}, false);


//清除
document.querySelector("#buttonClear").addEventListener("click", function () {
    location.reload();
}, false);