
var textHtml = [];
textHtml.push('<div class="post_right">');
textHtml.push('<h2 class="post_title1">{title}</h2>');
textHtml.push('<div class="post_property">');
textHtml.push('<div class="post_author">{years} {author}</div>');
textHtml.push('</div>');
textHtml.push('<div class="post_brief r_main show" id="ddidi-1">{content}</div>');
textHtml.push('</div>');

var arrLines = [];
var arrCenterChart = ["，", "。", "；", "？", "！"];

function addContent() {
    var title = $("#title").val();
    var author = $("#author").val();
    var years = $("#years").val();
    var content = $("#content").val();
    // content.split("\n");
    var bolIsExist = false;
    $.each(content.split("\n"), function(index, value) {
        var objJson = {};
        objJson.title = title;
        objJson.author = author;
        objJson.years = years;
        var arrContents = [];
        var strLastChart = value.charAt(value.length - 1);
        if (arrCenterChart.indexOf(strLastChart) > -1) {
            var strValueLostLastChart = value.substr(0, value.length - 1);
            $.each(arrCenterChart, function(index1, strChart) {
                if (strValueLostLastChart.indexOf(strChart) > -1) {
                    strValueLostLastChart = strValueLostLastChart.replaceAll(strChart, strChart + "|||" + strChart);
                }
            });
            value = strValueLostLastChart + strLastChart;
        } else {
            $.each(arrCenterChart, function(index1, strChart) {
                if (value.indexOf(strChart) > -1) {
                    value = value.replaceAll(strChart, strChart + "|||" + strChart);
                }
            });
        }
        objJson.content = value.split("|||");
        $.each(arrLines, function(index1, obj) {
            if (obj.content == value) {
                bolIsExist = true;
            }
        });
        if (!bolIsExist) {
            arrLines.push(objJson);
        }
    });
    if (!bolIsExist) {
        var $contentBody = $(".contentBody");
        $contentBody.append(textHtml.join("").replace("{title}", title).replace("{author}", author).replace("{years}", years)
            .replace("{content}", content.replaceAll("\n", '<br>')));
    }
}

function createProblem() {
    var badChar = "，。？！";
    $(".problemBody p").remove();
    var arr = [];
    var arr = JSON.parse(JSON.stringify(arrLines));
    arr = roa(arr);
    // downloadTextFile(JSON.stringify(arr));
    for (var i = 0; i < 20; i++) {
        var arrContent = arr[i]["content"];
        // debugger;
        var arrAnswerNums = createAnswerNumArr(arrContent);
        var arrAnswers = [];
        $.each(arrAnswerNums, function(index, value) {
            arrAnswers.push(arrContent[value].replace("，", "").replace("？", "").replace("？", "").replace("。", ""));
            if (badChar.indexOf(arrContent[value].charAt(arrContent[value].length - 1)) > -1) {
                arrContent[value] = "_____________________" + arrContent[value].charAt(arrContent[value].length - 1);
            } else {
                arrContent[value] = "_____________________。";
            }
        });
        var strContent = arrContent.toString().replaceAll(",", "").replaceAll("，，", "，").replaceAll("。。", "。").replaceAll("？？", "？").replaceAll("！！", "！") +
            " （《" + arr[i]["title"] + "》 " + arr[i]["author"] + "）";
        $(".problemBody").append($("<p>").text(strContent));
        $(".problemBody").append($("<p style='color:red'>").text(arrAnswers.toString().replaceAll(",", " ")));
    }
    
    $(".contentFrom").hide();
    createPdfFiles();
    $(".contentFrom").show();
}

function createPdfFiles(){
    html2canvas($(".renderPdf")[0], {
        onrendered:function(canvas) {
            //返回图片URL，参数：图片格式和清晰度(0-1)
            var pageData = canvas.toDataURL('image/jpeg', 1.0);
            //方向默认竖直，尺寸ponits，格式a4【595.28,841.89]
            var pdf = new jsPDF('', 'pt', 'a4');
            //需要dataUrl格式
            pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/canvas.width * canvas.height );
            pdf.save('content.pdf');
        }
    });
}

function roa(arr) //arr为可能出现的元素集合
{
    var temp = []; //temp存放生成的随机数组
    var count = arr.length;
    for (i = 0; i < count; i++) {
        var num = Math.floor(Math.random() * arr.length); //生成随机数num
        temp.push(arr[num]); //获取arr[num]并放入temp
        arr.splice(num, 1);
    }
    return temp;
}

function createMain() //arr为可能出现的元素集合
{
    var badChar = "，。？！";
    $(".container p").remove();
    var arr = [];
    var cloneGushiObj = JSON.parse(JSON.stringify(gushiObj));
    $.each(cloneGushiObj, function(title, value) {
        $.each(value["content"], function(index1, value1) {
            var obj = {};
            obj.title = title;
            obj.author = value["author"];
            obj.years = value["years"];
            obj.content = value1;
            arr.push(obj);
        });
    });
    arr = roa(arr);
    // downloadTextFile(JSON.stringify(arr));
    for (var i = 0; i < 20; i++) {
        if(arr[i]){
            var arrContent = arr[i]["content"];
            // debugger;
            var arrAnswerNums = createAnswerNumArr(arrContent);
            var arrAnswers = [];
            $.each(arrAnswerNums, function(index, value) {
                arrAnswers.push(arrContent[value].replace("，", "").replace("？", "").replace("？", "").replace("。", ""));
                if (badChar.indexOf(arrContent[value].charAt(arrContent[value].length - 1)) > -1) {
                    arrContent[value] = "_____________________" + arrContent[value].charAt(arrContent[value].length - 1);
                } else {
                    arrContent[value] = "_____________________。";
                }
            });
            var strContent = arrContent.toString().replaceAll(",", "").replaceAll("，，", "，").replaceAll("。。", "。").replaceAll("？？", "？").replaceAll("！！", "！") +
                " （《" + arr[i]["title"] + "》 " + arr[i]["author"] + "）";
            $(".container").append($("<p>").text(strContent));
            $(".container").append($("<p style='color:red'>").text(arrAnswers.toString().replaceAll(",", " ")));
        }
    }
}

function createAnswerNumArr(arr) {
    var cloneArr = JSON.parse(JSON.stringify(arr));
    var temp = []; //temp存放生成的随机数组
    var answerNum = Math.floor(cloneArr.length / 2);
    for (i = 0; i < answerNum; i++) {
        var num = Math.floor(Math.random() * cloneArr.length); //生成随机数num
        temp.push(arr.indexOf(cloneArr[num])); //获取arr[num]并放入temp
        cloneArr.splice(num, 1);
    }
    return arrSort(temp);
}

function arrSort(arr) {
    var asc = function(a, b) {
        return a - b;
    }
    var desc = function(a, b) {
        return b - a;
    }
    return arr.sort(asc);
}

function downloadTextFile(mobileCode, fileName) {
    fileName = fileName || "Library.json";
    //mobileCode 为写入文件的内容，可以通过获取文本框的value写入
    var file = new File([mobileCode], fileName, {
        type: "text/plain;charset=utf-8"
    });
    saveAs(file);
}

function exportLibrary(){
    var badChar = "，。？！";
    $(".container p").remove();
    var arr = [];
    var cloneGushiObj = JSON.parse(JSON.stringify(gushiObj));
    $.each(cloneGushiObj, function(title, value) {
        $.each(value["content"], function(index1, value1) {
            var obj = {};
            obj.title = title;
            obj.author = value["author"];
            obj.years = value["years"];
            obj.content = value1;
            arr.push(obj);
        });
    });
    downloadTextFile(JSON.stringify(arr),"Library.json");
}

function removeContent(){
    $(".contentBody").html("");
    arrLines = [];
}

function importLibrary(){
    $("#files").click();
}

function importFile(){
    var selectedFile = document.getElementById("files").files[0];//获取读取的File对象
    var name = selectedFile.name;//读取选中文件的文件名
    var size = selectedFile.size;//读取选中文件的大小
    // console.log("文件名:"+name+"大小："+size);

    var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
    reader.readAsText(selectedFile);//读取文件的内容

    reader.onload = function(){
        // console.log(this.result);//当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
        arrLines=JSON.parse(this.result);
    };
    document.getElementById("files").files[0] = "";
}

$("#export").click(function(){
    var content = "这是直接使用HTML5进行导出的";
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "file.txt");//saveAs(blob,filename)
});