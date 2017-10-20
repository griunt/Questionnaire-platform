define([
    'util',
    'darken',
    'calendar',
    'listPage',
    'storage',
    'types'
], function($, Darken, Calendar, ListPage, Storage, T) {
    'use strict';
    
    var edit = function() {
        // 对外接口
        var objPos = $.U.pos;
        var newE = new Edit(objPos);
        
    };
    
    var Edit = function(objPos) {
        this.objPos = objPos;
        this.allQns = Storage.getData().qn;
        this.eQn = this.allQns[objPos];
        this.allQuestions = undefined;
        this.allQuestions = this.init(this.eQn);
        this.refresh();
    };
    
    Edit.prototype = {
        // 刷新整个页面
        refresh: function() {
            var main = $.U("#main");
            var ihtml = "";
            var eCon = ""; 
             
            // 把问题排好序
            this.allQuestions.sort(function(obj1, obj2) {
                if (obj1.order < obj2.order) {
                    return -1;
                } else {
                    return 1;
                }
            });
            
            // 把问题生成dom
            for (var n = 0, len4 = this.allQuestions.length; n < len4; n++) {
                this.allQuestions[n].order = n + 1;
                if (n === 0) {
                    eCon += this.generate(this.allQuestions[n], "first");
                } else if (n === len4 - 1){
                    eCon += this.generate(this.allQuestions[n], "last");
                } else {
                    eCon += this.generate(this.allQuestions[n], "");
                }
            }
            
            ihtml = 
            '<div id="new-build-qn">'
		    +	'<div id="new-build-qn-head">'
		    +		'<h3>' + this.eQn.title + '</h3>'
		    +	'</div>'
		    +	'<div id="new-build-content">'
		    +   eCon		
		    +	'</div>'
		    +	'<div id="new-build-btns">'
		    +		'<div style="height:0px">'	   
		    +		'</div>'
		    +		'<div>'
		    +			'<button>+ 添加问题</button>'
		    +		'</div>'
		    +	'</div>'
		    +	'<div id="new-build-qn-foot">'
		    +		'<label for="">问卷截止日期</label>'
		    +		'<input type="text" readonly>'
            +       '<div class="calendar1">'
            +       '</div>'
            +   '<button>发布问卷</button>'
			+   '<button>保存问卷</button>'	
		    +	'</div>'
	        +	'</div>';
            
            main.innerHTML = ihtml;
            
            // 刷新时间
            var calInput = document.getElementById("new-build-qn-foot").getElementsByTagName("input")[0];
            calInput.value = this.eQn.endTime;
            
            this.showBtnEvent();
            this.editEvent();   
            this.cal();
        },   
        
        // 初始化问题列表
        init: function(qn) {
            
            var allQuestions = [];
            // 三个循环把要放进去的问题放进去
            if (qn.textarea !== [])
            {
                for(var i = 0, len = qn.textarea.length; i < len; i++) {
                    allQuestions.push($.U.findObjectBy("id", Storage.getData().textarea, qn.textarea[i]).objectIneed[0]);
                }
            }
            
            if (qn.checkbox !== [])
            {
                for(var j = 0, len2 = qn.checkbox.length; j < len2; j++) {
                    allQuestions.push($.U.findObjectBy("id", Storage.getData().checkbox, qn.checkbox[j]).objectIneed[0]);
                }
            }
            
            if (qn.radio !== [])
            {
                for(var k = 0, len3 = qn.radio.length; k < len3; k++) {
                    allQuestions.push($.U.findObjectBy("id", Storage.getData().radio, qn.radio[k]).objectIneed[0]);
                }
            }
            
            allQuestions.sort(function(obj1, obj2) {
                if (obj1.order < obj2.order) {
                    return -1;
                } else {
                    return 1;
                }
            });
            
            return allQuestions;
        },
        
        // 生成每一个问题的dom
        generate: function(obj, mode) {
            var con = "";
            var check = ""; // 是否必要
            check = obj.necessary? "checked": "";
            var option = "";
            var funcs = "";
            if(obj.type === "checkbox") {    
                // checkbox的情况
                for (var i = 0, len = obj.options.length; i < len; i++) {
                    option += '<label for=""><input type="checkbox">' + obj.options[i] + '</label>';
                }
			    con = 
                '<div>'
			    +	'<h4>Q' + obj.order + " " + obj.title + '（多选题）</h4>'
			    +	'<label class="new-build-ne"><input type="checkbox" ' + check + '>此题是否必填</label>' 
                +   option;
            } else if (obj.type === "radio") {
                // radio的情况
                for (var j = 0, len1 = obj.options.length; j < len1; j++) {
                    option += '<label for=""><input type="radio" name="' + obj.order + '">' + obj.options[j] + '</label>';
                }
			    con = 
                '<div>'
			    +	'<h4>Q' + obj.order + " " + obj.title + '（单选题）</h4>'
			    +	'<label class="new-build-ne"><input type="checkbox" ' + check + '>此题是否必填</label>' 
                +   option;   
            } else {
                // textarea的情况
			    con = 
                '<div>'
			    +	'<h4>Q' + obj.order + " " + obj.title + '（文本题）</h4>'
			    +	'<label class="new-build-ne"><input type="checkbox" ' + check + '>此题是否必填</label>' 
                +   '<textarea></textarea>';
            }
            
            if (mode === "first") {
                funcs =
                            '<li><a>下移</a></li>'
			    +			'<li><a>复用</a></li>'
			    +			'<li><a>删除</a></li>';
            } else if (mode === "last") {
                funcs = 
                            '<li><a>上移</a></li>'
		    	+			'<li><a>复用</a></li>'
			    +			'<li><a>删除</a></li>';
            } else {
                funcs =     
                            '<li><a>上移</a></li>'
			    +			'<li><a>下移</a></li>'
			    +			'<li><a>复用</a></li>'
			    +			'<li><a>删除</a></li>';
            }
            
            con += 
               '<div>'
			+		'<ul>'
			+			funcs
			+		'</ul>'
			+	'</div>'
			+	'</div>';
            
            return con;
        },
        
        // 显示，上移，下移，删除，复用
        showBtnEvent: function() {
            var content = $.U("#new-build-content");
            var qus = content.childNodes;
            var that = this;
            for (var i = 0, len = qus.length; i < len; i++) {
                (function(i) {
                    var nece = qus[i].getElementsByTagName("label")[0].getElementsByTagName("input")[0];
                    that.necessaryFun(nece, i);
                    var as = qus[i].getElementsByTagName("a");
                    // 三四
                    that.copy(as[as.length - 2], i);
                    that.del(as[as.length - 1], i); 
                    if (len !== 1) {
                        if (i === 0) {
                            // 第一个 
                            that.goDown(as[0], i);
                        } else if (i === len - 1) {
                            // 第二个
                            that.goTop(as[0], i);
                        } else {
                            // 一二
                            that.goTop(as[0], i);
                            that.goDown(as[1], i);
                        }   
                    }  
                })(i);              
            }    
        },
        
        // 上移按钮
        goTop: function(a, pos){
            var that = this;
            // 获取包含的div
            $.U.click(a, function() {
                var current = a.parentNode.parentNode.parentNode.parentNode;
                var aBefore = current.previousSibling;

                // 交换allQuestion里面的两个元素的order
                var temp = that.allQuestions[pos].order;
                that.allQuestions[pos].order = that.allQuestions[pos - 1].order;
                that.allQuestions[pos - 1].order = temp;
                // 交换两个元素的dom
                var tHtml = current.innerHTML;
                current.innerHTML = aBefore.innerHTML;
                aBefore.innerHTML = tHtml;
                // 重新刷新
                that.refresh();
            });
        },
        
        // 下移按钮
        goDown: function(a, pos){
            var that = this;
            // 获取包含的div
            $.U.click(a, function() {
                var current = a.parentNode.parentNode.parentNode.parentNode;
                var aNext = current.nextSibling;
                console.log(current, aNext)
                // 交换allQuestion里面的两个元素的order
                var temp = that.allQuestions[pos].order;
                that.allQuestions[pos].order = that.allQuestions[pos + 1].order;
                that.allQuestions[pos + 1].order = temp;
                // 交换两个元素的dom
                var tHtml = current.innerHTML;
                current.innerHTML = aNext.innerHTML;
                aNext.innerHTML = tHtml;
                // 重新刷新所有的小按钮
                console.log(that.allQuestions)
                that.refresh();
            });
        },
        
        // 复用
        copy: function(a, pos){
            var that = this;
            $.U.click(a, function() {
                var newD = Darken.out({
                    type: "confirm",
                    title: "复用",
                    content: "是否要复用该问题",
                    callback: function () {
                        var current = a.parentNode.parentNode.parentNode.parentNode;
                        var parent = current.parentNode;
                        parent.innerHTML += current; 
                        var newObj = $.U.cloneObject(that.allQuestions[pos]);
                        that.allQuestions.push(newObj);  
                        that.refresh(); 
                    }
                });
            });  
        },
        
        // 是否必要按钮
        necessaryFun: function(i, pos) {
            var that = this;
            $.U.click(i, function() {
                if (i.checked === true) {
                    that.allQuestions[pos].necessary = true;
                } else {
                    that.allQuestions[pos].necessary = false;
                }
            });
        },
        
        // 删除按钮
        del: function(a, pos){
            var that = this;
            $.U.click(a, function() {
                var newD = Darken.out({
                    type: "confirm",
                    title: "删除",
                    content: "是否要删除该问题",
                    callback: function () {
                        var current = a.parentNode.parentNode.parentNode.parentNode;
                        that.allQuestions.splice(pos, 1);
                        that.refresh();
                    }
                });
            });
        },
        
        // 新建按钮，保存按钮，发布按钮，标题
        editEvent: function() {
            var newBuildHead = document.getElementById("new-build-qn-head");
            var h3 = newBuildHead.getElementsByTagName("h3")[0];
            var newBuildBtn = document.getElementById("new-build-btns");
            var btn0 = newBuildBtn.getElementsByTagName("div")[1].getElementsByTagName("button")[0];
            var newBuildFoot = document.getElementById("new-build-qn-foot");
            var btns = newBuildFoot.getElementsByTagName("button");
            var that = this;
            // 按新建时候的动画效果以及dom操作
            $.U.click(newBuildBtn, function() {
                var threeArea = newBuildBtn.getElementsByTagName("div")[0];
                var count = 0;
                if (parseInt(threeArea.style.height, 10) === 0){
                    var setInter = setInterval(function() {
                        count++;
                        threeArea.style.height = (parseInt(threeArea.style.height, 10) + 1) + "px";  
                        if (count === 70){
                            clearInterval(setInter);
                            threeArea.innerHTML = 
                       	    '<button>单选</button>'
		                    +	 '<button>多选</button>'
		                    +    '<button>文本框</button>';
                            that.newThreeBtns();
                        }
                    }, 10);                         
                }     
            });
            
            // 保存
            $.U.click(btns[1], function() {
                if (that.verify()) {
                    var newDarken = Darken.out({
                        type: "confirm", 
                        title: "提示", 
                        content: "保存成功！", 
                        callback: function() {}
                    }); 
                    that.save();                
                }     
            });
            
            // 发布问卷
            $.U.click(btns[0], function() {
                var newD = Darken.out({
                    type: "confirm",
                    title: "发布",
                    content: "是否要发布该问题？",
                    callback: function () {
                        if (that.verify()) {
                            that.eQn.status = "发布中"; 
                            that.save(); 
                            var newDarken = Darken.out({
                                type: "confirm", 
                                title: "提示", 
                                content: "发布成功！", 
                                callback: function() {}
                            }); 
                            window.location.hash = "#listpage";
                        } else {
                            var newDarken = Darken.out({
                                type: "confirm", 
                                title: "提示", 
                                content: "发布失败！", 
                                callback: function() {}
                            }); 
                        }
                    }
                });
            });
            
            // 点击标题
            $.U.click(h3, function() {
                newBuildHead.innerHTML += '<input type="text">';
                var inputHead = document.getElementById("new-build-qn-head").getElementsByTagName("input")[0];
                // 自动对焦
                inputHead.focus();
                $.U.EventUtil.addHandler(inputHead, "blur", function () {
                    var newH = inputHead.value;
                    var re = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                    console.log(re.test(re));
                    if ($.U.findObjectBy("title", that.allQns, newH) !== [] && re.test(newH)) {
                        that.eQn.title = newH;
                        console.log(that.eQn.title)
                        // dom上重新渲染标题
                        h3.innerHTML = newH; 
                    } else {
                        alert("标题只允许是汉字，数字，以及英文字母");
                    }
                    // 移除输入框
                    inputHead.parentNode.removeChild(inputHead);
                    that.refresh(); // 刷新页面
                });
                
                
            });
        },
        
        // 单选，多选，文本
        newThreeBtns: function() {
            var newBuildBtn = document.getElementById("new-build-btns");
            var threeArea = newBuildBtn.getElementsByTagName("div")[0];
            var btns = threeArea.getElementsByTagName("button");
            var that = this;
            
            // 新建单选
            $.U.click(btns[0], function() {
                var newD = Darken.out({
                    type: "radio",
                    title: "新建单选",
                    content: "分别在下面的框中填写问题的名称以及选项，选项用逗号‘,’分隔开。",
                    callback: function (input1, input2) {
                        var newRadio = new T.form({
                            title: input1,
                            father: that.eQn.id,
                            options: that.filter(input2),
                            order: that.allQuestions.length + 1,
                            type: "radio",
                            necessary: true
                        });
                        that.allQuestions.push(newRadio);
                        that.refresh();
                    }
                });
            });
            
            // 新建多选
            $.U.click(btns[1], function() {
                var newD = Darken.out({
                    type: "checkbox",
                    title: "新建多选",
                    content: "分别在下面的框中填写问题的名称以及选项，选项用逗号‘,’分隔开。",
                    callback: function (input1, input2) {
                        var newCheckbox = new T.form({
                            title: input1,
                            father: that.eQn.id,
                            options: that.filter(input2),
                            order: that.allQuestions.length + 1,
                            type: "checkbox",
                            necessary: true
                        });
                        that.allQuestions.push(newCheckbox);
                        that.refresh();
                    }
                });
            });
            
            // 新建文本框
            $.U.click(btns[2], function() {
                var newD = Darken.out({
                    type: "textarea",
                    title: "新建文本框",
                    content: "在下面的框中填写问题的标题",
                    callback: function (input1) {
                        var newCheckbox = new T.form({
                            title: input1,
                            father: that.eQn.id,
                            order: that.allQuestions.length + 1,
                            type: "textarea",
                            necessary: true
                        });
                        
                        console.log(newCheckbox)
                        that.allQuestions.push(newCheckbox);
                        that.refresh(); 
                    }
                });
            });
        },
        
        // 过滤函数，把选项字符串变成数组
        filter: function(text) {
            text = text.replace(/[,\.\s\n\t\u3000\uff0c\u3001\u0020\u3002]+/g, " ");
	        text.trim();
	        var textArray = text.split(" ");
            for (var i = 0, len = textArray.length; i < len; i++) {
                if (textArray[i] === "") {
                    textArray.splice(i, 1);
                }
            }
            return textArray;
        },
        
        // 日历生成函数
        cal: function() {
            var that = this;
            var mu = new Calendar.calendar(1, undefined, 1);
            mu.initC();
            // 再次刷新时仍然保留
            var calInput = document.getElementById("new-build-qn-foot").getElementsByTagName("input")[0];
            var calBoard = $.U(".calendar1");
            $.U.EventUtil.addHandler(calBoard, "click", function() {
                 that.eQn.endTime = calInput.value;
                 console.log(that.eQn.endTime)
            });
        },
        
        // 保存 传入类型，改变后的对象，以及位置
        save: function(/*type, obj, position*/) {
            
            // 按下了保存，不再是新元素了
            $.U.iAmNew = false;
            
            var that = this;
            var data = {
                qn: Storage.getData().qn,
                textarea: Storage.getData().textarea,
                checkbox: Storage.getData().checkbox,
                radio: Storage.getData().radio
            } 
            var aq = this.allQuestions;
            var qn = this.eQn;
            
            // 保存日期
            qn.endTime = document.getElementById("new-build-qn-foot").getElementsByTagName("input")[0].value;
            
            // 遍历三个数据库，然后把father等于该元素的先删除
            for (var i1 = 0, len1 = data.textarea.length; i1 < len1; i1++) {   
                if (data.textarea[i1].father === that.eQn.id) {
                    data.textarea.splice(i1, 1);
                    break;
                }
            }
            for (var i2 = 0, len2 = data.checkbox.length; i2 < len2; i2++) {
                if (data.checkbox[i2].father === that.eQn.id) {
                    data.checkbox.splice(i2, 1);
                    break;
                }
            }
            for (var i3 = 0, len3 = data.radio.length; i3 < len3; i3++) {
                if (data.radio[i3].father === that.eQn.id) {
                    data.radio.splice(i3, 1);
                    break;
                }
            }
            
            console.log(data);
            
            // 把新的push进相应的位置，然后再把新的push进相应的数据库，同时更新qn
            qn.textarea = [];
            qn.checkbox = [];
            qn.radio = [];
            for (var k = 0, len = aq.length; k < len; k++) {
                data[aq[k].type].push(aq[k]);
                qn[aq[k].type].push(aq[k].id);
            }
            
            // 去重
            data.textarea = $.U.unique(data.textarea);
            data.checkbox = $.U.unique(data.checkbox);
            data.radio = $.U.unique(data.radio);
            
            // 更改qn
            data.qn[that.objPos] = qn;
            
            // 最终全部保存
            
            Storage.save({
                qn: data.qn,
                textarea: data.textarea,
                checkbox: data.checkbox,
                radio: data.radio
            })
        },
        
        verify: function() {
            var aq = this.allQuestions;
            var chooseDateStr = document.getElementById("new-build-qn-foot").getElementsByTagName("input")[0].value;
            
            // 检测日期(废弃)
            /*
            if (/\d{4}-\d{1,2}-\d{1,2}/.test(chooseDateStr)) {
                var dateArray = chooseDateStr.split("-");
                // 检测一个日期是否真实存在
                var chooseDate = (new Date(dateArray[0], dateArray[1], dateArray[2]));
                console.log(chooseDate)
                if (isNaN(chooseDate)) {
                    alert("日期请正确输入！");
                    return false;
                }
            } else {
                alert("日期输入格式不正确！");
                return false;
            }
            */
            
            
            // 题目数目
            if (aq.length < 1) {
                alert("题目数量不能少于一个。");
                return false;
            } else if (aq.length > 10) {
                alert("题目数量不能多于十个。");
                return false;
            }
            
            // 题目本身是否符合规范
            for (var i = 0, len = aq.length; i < len; i++) {
                if ((aq[i].title) === "") {
                    alert("问题不能为空！");
                    return false;
                }
                // 每一种的检测
                if (aq[i].type == "checkbox") {
                    // 检测单选
                    if (aq[i] === []) {
                        alert("第" + (i+1) + "个多选题没有选项！" );
                        return false;
                    }
                    for (var n = 0, lenc = aq[i].options.length; n < lenc; n++) {
                        if (aq[i].options[n] === "") {
                            alert("第" + (i+1) + "个多选题选项不能为空！" );
                            return false;
                        }
                    }
                } else if (aq[i].type == "radio") {
                    // 检测单选
                    if (aq[i] === []) {
                        alert("第" + (i+1) + "个单选题没有选项！" );
                        return false;
                    }
                    for (var m = 0, lenr = aq[i].options.length; m < lenr; m++) {
                        if (aq[i].options[m] === "") {
                            alert("第" + (i+1) + "个单选题选项不能为空！" );
                            return false;
                        }
                    }
                }
            }
            
            return true;
        }
    };
    
    return {
        edit: edit,
        init: Edit.prototype.init  
    };
});