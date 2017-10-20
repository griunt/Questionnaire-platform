define(function() {
    'use strict';
    
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