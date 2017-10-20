define([
    'storage',
    'util'
], function(Storage, $) {
    'use strict';
    
    // 所有 id 自动分配
    
    // 问卷
    var qn = function() {
        var title = arguments[0].title,
            endTime = arguments[0].endTime,
            status = arguments[0].status,
            textarea = arguments[0].textarea,
            radio = arguments[0].radio,
            checkbox = arguments[0].checkbox; // unexpected token {
            
        this.title = title;
        this.endTime = endTime;
        this.status = status;
        this.textarea = textarea;
        this.radio = radio;
        this.checkbox = checkbox;
        this.id = assignId("qn");
    };
    
    var form = function() {
        var title = arguments[0].title,
            father = arguments[0].father,
            options = arguments[0].options,
            order = arguments[0].order,
            type = arguments[0].type,
            necessary = arguments[0].necessary; // unexpected token {
        
        this.title = title;
        this.father = father;
        this.options = options;
        this.order = order;
        this.type = type;
        this.necessary = necessary;
        this.id = assignId(type);
    };
    
    // 找出空位
    function assignId(type) {
        var inStorage = Storage.getData()[type];    
        console.log(inStorage);
        for (var i = 1; i <= inStorage.length + 1; i++) {
            if($.U.findObjectBy("id", inStorage, i).objectIneed.length === 0) {
                return i;
            }
        }
    }
    
    return {
        qns: qn,
        form: form
    };
});