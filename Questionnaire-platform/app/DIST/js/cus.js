
define('util',[],function() {
    
/*工具*/

/*Query简单方法*/
var $ = function(selector) {
	var childs = function(element) {
		return element.getElementsByTagName("*");
	}
	// 获取html
	var ele = document.getElementsByTagName("html")[0];
	// 把多余的空格变成一个，然后分割
	var sele = selector.replace(/\s+/, " ").split(" ");
	
	for (var i = 0, len = sele.length; i < len; i++) {
		ele = childs(ele);
		var eleLen = ele.length;
		var isGet = false;
		switch(sele[i][0]) {
            // 寻找到id值
			case "#":
				for(var j = 0; j < eleLen; j++) {
					if(ele[j].id === sele[i].substring(1)) {
						ele = ele[j];
						isGet = true;
						break;
					}
				}
				break;
				
            // 获取所有同class的数组
            case "*":
                var eles = [];
				for(var j = 0; j < eleLen; j++) {
					var classes = ele[j].className.split(" ");
					if (classes.indexOf(sele[i].substring(1)) !== -1) {
                        eles.push(ele[j]);
					}
                    if (j === eleLen && eles !== []) {
                        ele = eles;
                        isGet = true;
						break;
                    }
				}
				break;
                
            // 获取某一个class的第一个
			case ".":
				for(var j = 0; j < eleLen; j++) {
					var classes = ele[j].className.split(" ");
					if (classes.indexOf(sele[i].substring(1)) !== -1) {
						ele = ele[j];
						isGet = true;
						break;
					}
				}
				break;
				
            // 获取有某一种属性的节点
			case "[":
				var valueLoc = sele[i].indexOf("=");
				if (valueLoc !== -1) {
					var key = sele[i].substring(1, valueLoc);
					var value = sele[i].substring(valueLoc + 1, sele[i].length - 1);
					for (var j = 0; j < eleLen; j++) {
						if(ele[j][key] === value){
							ele = ele[j];
							isGet = true;
							break;
						}
					}
				}
				else {
					var key = sele[i].substring(1, sele[i].length - 1);
					for (var j = 0; j < eleLen; j++) {
						if (ele[j][key]) {
							ele = ele[j];
							isGet = true;
							break;
						}
					}
				}
				break;
				
			default:
				for(var j = 0; j < eleLen; j++) {
					if (ele[j].tagName === sele[i].toUpperCase()) {
						ele = ele[j];
						isGet = true;
						break;
					}
				}
				break;
		}
	}
	
	if(!isGet) {
		ele = null;
	}
	
	return ele;
}

/*深度克隆*/
function cloneObject(src) {
	// 数字，字符串，布尔，null，undefined
	if (src == null || typeof src != "object") {
		return src;
	}
	
	// Date
	if (src instanceof Date) {
		var clone = new Date(src.getData());
		return clone;
	}
	
	// 数组
	if (src instanceof Array) {
		var clone = new Array();
		for (var i = 0, len = src.length; i < len; i++) {
			clone[i] = src[i];
		}
		return clone;
	}
	
	// 对于Object
	if (src instanceof Object) {
		var clone = new Object();
		for (var key in src) {
			// 忽略继承来的属性
			if (src.hasOwnProperty(key)) {
				clone[key] = cloneObject(src[key]);
			}
		}
		return clone;
	}
}

/*跨浏览器事件*/
var EventUtil = {
	
	//事件处理程序，绑定事件
	addHandler: function(element, type, handler) {
		if(element.addEventListener){
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	
    // 移除事件
	removeHandler: function(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent(type, handler, false);
		} else {
			element["on" + type] = null;
		}
	},
	
	//事件对象
	getEvent: function(event) {
		return event ? event : window.event;
	},
	
    // 获取target
	getTarget: function(event) {
		return event.target || event.srcElement;
	},
	
    // 阻止默认行为
	preventDefault: function(event) {
		if(event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	
    // 防止冒泡
	stopPropagation: function(event) {
		if(event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}
	
};

/*
EventUtil.addHandler(document, "click", function(event){
	console.log("click");
	console.log(EventUtil.getTarget(event).nodeName);
})
*/

// 常用
// 添加一个事件
function addEvent(element, event, listener) {
	EventUtil.addHandler(element, event, listener);
}
// 移除一个事件
function removeEvent(element, event, listener) {
	EventUtil.removeHandler(element, event, listener);
}
// 添加一个click事件
function addClickEvent(element, listener) {
	EventUtil.addHandler(element, "click", listener);
}
// 添加一个Enter事件
function addEnterEvent(element, listener) {
	element.onkeydown = function(event) {
		event = EventUtil.getEvent(event);
		if (event.keyCode === 13) {
			listener();
		}
	}
}
// 添加一个事件代理
function delegateEvent(element, tag, eventName, listener) {
	EventUtil.addHandler(element, eventName, function(event) {
		var e = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);
		var name = target.nodeName.toLowerCase();
		// 以防其他类型节点添加了事件。
		if (name === tag) {
			EventUtil.addHandler(target, eventName, listener);
		}
	})
}

// 通过type在数组里找对象
function findObjectBy(type, anArray, target) {
	var objectIneed = [];
	var position = [];
	for (var i = 0; i < anArray.length; i++) {
		if (anArray[i][type] === target) {
			objectIneed.push(anArray[i]);
			position.push(i);
		}
	}
	
	return {
		objectIneed: objectIneed,
		position: position
	}
}

// 数组id去重， 逆向相减以免length改变的影响
function unique(arr) {
	var len = arr.length;
	for (var i = len - 2; i > 0; i--) {
		var item = arr[i].id;
		for (var j = i + 1; j < arr.length; j++) {
			if (item === arr[j].id) {
				arr.splice(j, 1);
			}
		}
	}
	return arr;
}

function returnToListPage() {
    var header = document.getElementsByTagName("header")[0];
    var logo1 = header.getElementsByTagName("h3")[0];
    var logo2 = header.getElementsByTagName("h4")[0];
    
	addEvent(logo1, "click", function() {
		window.location.hash = "#listpage";
        //location.reload();
    });
        
    addEvent(logo2, "click", function() {
		window.location.hash = "#listpage";
        //location.reload();
    });
}

// 简化的常用方法
$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;
$.delegate = delegateEvent;

$.EventUtil = EventUtil;
$.cloneObject = cloneObject;
$.findObjectBy = findObjectBy;
$.unique = unique;
$.returnToListPage = returnToListPage;

// 这个pos用于存放一个编号，记录listPage按下的那个元素在“数据库”中的位置。绕路为了浏览器前后逻辑。
var pos;
$.pos = pos;

// 这个
var iAmNew = false;
$.iAmNew = iAmNew;

return {
    U : $      
};

});
define('storage',[],function() {
    
    
    // 初始化的时候默认有的数据
    var initData = {
        // 初始化默认的问卷
        qn: '['
          + '{'
          +     '"id" : 1,'
          +     '"title" : "第一份问卷",'
          +     '"endTime" : "2016-4-30",'
          +     '"textarea" : [1],'
          +     '"checkbox" : [1],'
          +     '"radio" : [1],'   
          +     '"status" : "发布中"'
          + '},'
          + '{'
          +     '"id" : 2,'
          +     '"title" : "第二份问卷",'
          +     '"endTime" : "2016-4-20",'
          +     '"textarea" : [2],'
          +     '"checkbox" : [2],'
          +     '"radio" : [2],'   
          +     '"status" : "已结束"'
          + '},'
          + '{'
          +     '"id": 3,'
          +     '"title": "第三份问卷",'
          +     '"endTime": "2016-5-20",'
          +     '"textarea" : [3],'
          +     '"checkbox" : [3],'
          +     '"radio" : [3],'   
          +     '"status" : "未开始"'
          + '}'
        + ']',
        
        // 初始化默认的文本框
        textarea: '['
                + '{'
                +     '"id" : 1,'
                +     '"title" : "文本框一",'
                +     '"father" : 1,'
                +     '"order" : 3,'
                +     '"necessary" : true,'
                +     '"type": "textarea"'
                + '},'
                + '{'
                +     '"id" : 2,'
                +     '"title" : "文本框二",'
                +     '"father" : 2,'
                +     '"order" : 3,'
                +     '"necessary" : true,'
                +     '"type": "textarea"'
                + '},'
                + '{'
                +     '"id" : 3,'
                +     '"title" : "文本框三",'
                +     '"father" : 3,'
                +     '"order" : 3,'
                +     '"necessary" : true,'
                +     '"type": "textarea"'
                + '}'
        + ']',
        
        // 初始化默认的多选题
        checkbox: '['
                + '{'
                +     '"id" : 1,'
                +     '"title" : "多选题一",'
                +     '"father" : 1,'
                +     '"options" : ["选项一", "选项二", "选项三"],'
                +     '"necessary" : true,'
                +     '"order" : 2,'
                +     '"type": "checkbox"'
                + '},'
                + '{'
                +     '"id" : 2,'
                +     '"title" : "多选题二",'
                +     '"father" : 2,'
                +     '"options" : ["选项一", "选项二", "选项三"],'
                +     '"necessary" : true,'
                +     '"order" : 2,'
                +     '"type": "checkbox"'
                + '},'
                + '{'
                +     '"id" : 3,'
                +     '"title" : "多选题三",'
                +     '"father" : 3,'
                +     '"options" : ["选项一", "选项二", "选项三"],'
                +     '"necessary" : true,'
                +     '"order" : 2,'
                +     '"type": "checkbox"'
                + '}'
        + ']',
        
        // 初始化默认的单选题
        radio: '['
             + '{'
             +     '"id" : 1,'
             +     '"title" : "单选题一",'
             +     '"father" : 1,'
             +     '"options" : ["选项一", "选项二", "选项三"],'
             +     '"necessary" : true,'
             +     '"order" : 1,'
             +     '"type": "radio"'
             + '},'
             + '{'
             +     '"id" : 2,'
             +     '"title" : "单选题二",'
             +     '"father" : 2,'
             +     '"options" : ["选项一", "选项二", "选项三"],'
             +     '"necessary" : true,'
             +     '"order" : 1,'
             +     '"type": "radio"'
             + '},'
             + '{'
             +     '"id" : 3,'
             +     '"title" : "单选题三",'
             +     '"father" : 3,'
             +     '"options" : ["选项一", "选项二", "选项三"],'
             +     '"necessary" : true,'
             +     '"order" : 1,'
             +     '"type": "radio"'
             + '}'          
        + ']'
    };
    
    // 保存数据，当不需要保存某一个值时候，就用undefined代替
    function save() {
        var qn = arguments[0].qn,
            textarea = arguments[0].textarea,
            checkbox = arguments[0].checkbox,
            radio = arguments[0].radio;  // unexpected token {
        
        if (qn !== "not change") {
            localStorage.qn = JSON.stringify(qn);
        }
        if (textarea !== "not change") {
            localStorage.textarea = JSON.stringify(textarea);
        }
        if (checkbox !== "not change") {
            localStorage.checkbox = JSON.stringify(checkbox);
        }
        if (radio !== "not change") {
            localStorage.radio = JSON.stringify(radio);
        }
    }
    
    // 获取数据
    function getData() {
        var qn,
            textarea,
            checkbox,
            radio;
        
        // 默认数据装填
        if (!localStorage.qn) {
            localStorage.qn = initData.qn;
            localStorage.checkbox = initData.checkbox;
            localStorage.textarea = initData.textarea;
            localStorage.radio = initData.radio;
        }
        
        
        // 从localStroge中获取数据
        //qn = JSON.parse(localStorage.qn);
        checkbox = JSON.parse(localStorage.checkbox);
        textarea = JSON.parse(localStorage.textarea);
        radio = JSON.parse(localStorage.radio);
        qn = JSON.parse(localStorage.qn);
        
        return {
            qn: qn,
            checkbox : checkbox,
            textarea : textarea,
            radio : radio    
        };
    }
    
    // 返回保存和获取数据两个接口
    return {
        save: save,
        getData: getData  
    };
});
require([
    'util',
    'storage'
], function($, Storage) {
    
    
    var cus = function() {
        // 如果是移动设备而且还没跳转的时候，就跳转到相应的页面
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i) && !(/mobile/.test(location.href))) {
            location.href = "mobile.html";
        }
    };
    
    var getMessage = function() {
        
        // 加载完毕！
        window.opener.postMessage('ready', 'http://harveyprofile.tk'/*'http://localhost:3000'*/);
        
        // 接收数据
        window.addEventListener("message", function(e) {
            console.log(e.data);
            refresh(e.data);
        }, false);
        
        // 窗口已经关闭！
        window.addEventListener("unload", function(e) {
           e.currentTarget.opener.postMessage('closed', 'http://harveyprofile.tk'/*'http://localhost:3000'*/);
        }, false);
        
        setTimeout(function() {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
                refresh(localStorage.pos);
            }
        }, 100); 
    }
    
    var refresh = function(pos) {
        var main = document.getElementById("main");
        var qn = Storage.getData().qn[pos];
        var allQuestions = init(qn);
        var ihtml = "";
        for (var i = 0, len = allQuestions.length; i < len; i++) {
            ihtml += generate(allQuestions[i]);
        }
        ihtml = 
        '<div id="new-build-qn">'
		+	'<div id="new-build-qn-head">'
		+		'<h3>' + qn.title + '</h3>'
		+	'</div>'
        +   '<div id="new-build-content">'
        +   ihtml
		+	'</div>'
		+	'<div id="new-build-result-foot">'
		+		'<button>提交</button>'
		+	'</div>'
        +   '</div>';
            
        main.innerHTML = ihtml;
        
        // 按logo和返回按键都会回到原本的页面
        var btn = document.getElementsByTagName("button")[0];
        var header = document.getElementsByTagName("header")[0];
        var h3 = header.getElementsByTagName("h3")[0];
        var h4 = header.getElementsByTagName("h4")[0];
        $.U.click(btn, function() {
            location.href = "../index.html";
        });
        $.U.click(h3, function() {
            location.href = "../index.html";
        });
        $.U.click(h4, function() {
            location.href = "../index.html";
        });
    }
     
    var generate = function(obj) {
        console.log(obj.type)
        var con = "";
        var check = ""; // 是否必要
        check = obj.necessary? "*": "";
        var option = "";
        var funcs = "";
        if(obj.type === "checkbox") {    
            // checkbox的情况
            for (var i = 0, len = obj.options.length; i < len; i++) {
                option += '<label for=""><input type="checkbox">' + obj.options[i] + '</label>';
            }
            con = 
            	'<h4>Q' + obj.order + " " + obj.title + '（多选题）' + check + '</h4>'
            +   option;
        } else if (obj.type === "radio") {
            // radio的情况
            for (var j = 0, len1 = obj.options.length; j < len1; j++) {
                option += '<label for=""><input type="radio" name="' + obj.order + '">' + obj.options[j] + '</label>';
            }
            con = 
            	'<h4>Q' + obj.order + " " + obj.title + '（单选题）' + check + '</h4>'
            +   option;   
        } else {
            // textarea的情况
			con = 
				'<h4>Q' + obj.order + " " + obj.title + '（文本题）' + check + '</h4>'
            +   '<textarea></textarea>';
        }
            
        con = '<div>' + con + '</div>';
            
        return con;
    }
        
    var init = function(qn) {
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
        
        // 对问题进行排序
        allQuestions.sort(function(obj1, obj2) {
            if (obj1.order < obj2.order) {
                return -1;
            } else {
                return 1;
            }
        });
        
        return allQuestions;
    }
                        
    cus();
    getMessage();

});
define("customer", function(){});
