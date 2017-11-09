 
var $JQueryExtUtils = {
    pageContorlDisabled: function (contorls) {//用dialog来屏蔽页面
        var entry = $(".loading");
        if (!(entry.length > 0)) {
            var info = "<div class=\"loading\" style=\"position: absolute; z-index: 999; top: 0px; left: 0px;width: 550px; display: none\">";
            if (arguments && arguments.length == 2) {
                info = info + arguments[1] + "</div>";
            } else {
                info = info + "数据加载中</div>";
            }
            $(info).appendTo("body");
        } else {
            var info1 = "";
            if (arguments && arguments.length == 2) {
                info1 = arguments[1];
            } else {
                info1 = "数据加载中";
            }
            entry.html(info1);
        }
        $(contorls).embox({
            el: $('.loading'),
            layerTop: 0,
            layerLeft: 0,
            leftOffset: -230,
            topOffset: -200,
            allowScroll: true
        });
    },
    pageContorlRemoveDisabled: function () {//取消dialog屏蔽的页面
        $('.loading').fadeOut(600, function () { $("#emboxbg").remove(); });
    },
    JsonAjaxRequest: function (url, jsondataobject, successp, errorp, asyncp, timeoutp, ismark, remark) {
        //url为请求地址，请直接写文件名路径，不要加..等之类，例如直接写:user/list.ashx
        var sremark = remark;
        if (sremark == null || $.trim(sremark) == "") sremark = "数据加载中...";
        if (ismark) $JQueryExtUtils.pageContorlDisabled(this, sremark);
        var sTData = $JSonExtendObject.ObjecttoJSONString(jsondataobject);
        $.post(
            ((url.indexOf("?") > 0 ? (url + "&rnd=" + Math.random()) : (url + "?rnd=" + Math.random()))),
            {json:sTData}, 
             function (result) {               
                if (successp != null) successp($JSonExtendObject.JsontoObject(result));
                if (ismark) $JQueryExtUtils.pageContorlRemoveDisabled();
            } ,"json").error(function(err){alert(err.responseText());});
    },
    pageShowErrorInfo: function (contorls) {//用dialog来屏蔽页面
        var entry = $("#divInfoDialog");
        if (!(entry.length > 0)) {
            var info = "<div id=\"divInfoDialog\" class=\"pop_box\" style=\"position:absolute; z-index:999; top:1350px; left:50px;\"><div class=\"close\"><a onclick=\"javascript:$JQueryExtUtils.pageHideErrorInfo();\" href=\"javascript:void(0);\"><img src=\"" + $JQueryExtUtils.getCurPageRelativePathPrefix() + "images/pop_close.png\" width=\"40\" height=\"40\" /></a></div><div class=\"pop_tips_n\">";
            if (arguments && arguments.length == 2) {
                info = info + arguments[1] + "</div></div>";
            } 
            $(info).appendTo("body");
        } else {
            var info1 = "";
            if (arguments && arguments.length == 2) {
                info1 = arguments[1];
            } 
            entry.find(".pop_tips_n").html(info1);
        }
        $(((!contorls || contorls == null || typeof contorls == "undefined") ? $("body") : contorls)).embox({
            el: $('#divInfoDialog'),
            layerTop: 0,
            layerLeft: 0,
            leftOffset: -130,
            topOffset: -100,
            allowScroll: true
        });
    },
    replaceParamVal:function(paramName,replaceWith) {
        var oUrl = String(location.href);
        var re=eval('/('+ paramName+'=)([^&]*)/gi');
        var nUrl = oUrl;
        if(re.test(oUrl))
        { 
            nUrl = oUrl.replace(re,paramName+'='+replaceWith);
        }
        else
        {
            nUrl = oUrl.indexOf("?") > 0 ? (oUrl + "&" + paramName +"=" + replaceWith) : (oUrl + "?" + paramName +"=" +replaceWith);
        }
        location.href = nUrl;
    },
    replaceParamVal2:function(paramName,replaceWith,paramName1,replaceWith1,paramName2,replaceWith2) {
        var oUrl = String(location.href);
        var re=eval('/('+ paramName+'=)([^&]*)/gi');
         var re1=eval('/('+ paramName1+'=)([^&]*)/gi');
          var re2=eval('/('+ paramName2+'=)([^&]*)/gi');
        var nUrl = oUrl;
        if(re.test(oUrl))
        { 
            nUrl = oUrl.replace(re,paramName+'='+replaceWith);
        }
        else
        {
            nUrl = oUrl.indexOf("?") > 0 ? (oUrl + "&" + paramName +"=" + replaceWith) : (oUrl + "?" + paramName +"=" +replaceWith);
        }
        
        if(re1.test(nUrl))
        { 
            nUrl = nUrl.replace(re1,paramName1+'='+replaceWith1);
        }
        else
        {
            nUrl = nUrl.indexOf("?") > 0 ? (nUrl + "&" + paramName1 +"=" + replaceWith1) : (nUrl + "?" + paramName1 +"=" +replaceWith1);
        }
        
        if(re2.test(nUrl))
        { 
            nUrl = nUrl.replace(re2,paramName2+'='+replaceWith2);
        }
        else
        {
            nUrl = nUrl.indexOf("?") > 0 ? (nUrl + "&" + paramName2 +"=" + replaceWith2) : (nUrl + "?" + paramName2 +"=" +replaceWith2);
        }
        location.href = nUrl;
    },
    replaceParamVal1:function(paramName,replaceWith) {
        var oUrl = String(location.href);
        var re=eval('/('+ paramName+'=)([^&]*)/gi');
        var re1=eval('/(&rnd=)([^&]*)/gi');
        var re2=eval('/(#help)([^&]*)/gi');
        var nUrl = oUrl;
        if(re2.test(oUrl))
        { 
            nUrl = oUrl.replace(re2,'');
        }
        if(re1.test(nUrl))
        { 
            nUrl = nUrl.replace(re1,'');
        }
        if(re.test(nUrl))
        { 
            nUrl = nUrl.replace(re,paramName+'='+replaceWith);
        }
        else
        {
            nUrl = nUrl.indexOf("?") > 0 ? (nUrl + "&" + paramName +"=" + replaceWith) : (nUrl + "?" + paramName +"=" +replaceWith);
        }
        location.href = nUrl;
    },
    getCurPageRelativePathPrefix: function () {//获取当前页面的相对路径前缀
        var jsArray = $("head script");
        var srcArray = $(jsArray[jsArray.length - 1]).attr("src").split("/");
        var i = 0;
        var srcPrefix = "";
        for (i = 0; i <= srcArray.length; i++) {
            if (srcArray[i] == "..") {
                srcPrefix = srcPrefix + srcArray[i] + "/";
            }
            else {
                break;
            }
        }
        return srcPrefix;
    },
    addCommas: function (nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    cutString: function (str, len, showSymbol) {
        if (!str) return str;
        var leftStr = str;
        var curLen = 0;
        for (var i = 0; i < str.length; i++) {
            curLen += str.charCodeAt(i) > 255 ? 2 : 1;
            if (curLen > len) {
                leftStr = str.substring(0, i);
                break;
            } else if (curLen == len) {
                leftStr = str.substring(0, i + 1);
                break;
            }
        }
        if (showSymbol) {
            if (leftStr != str) {
                leftStr += "...";
            }
        }
        return leftStr;
    },
    getJQDialogWH: function (jqdialog) {//限制jquery dialog 的高宽
        var width = 700;
        if ($(window).width() <= 700) {
            width = $(window).width();
        } else {
            width = $(window).width() * 0.8;
        }
        if (jqdialog.width() > width) {
            jqdialog.dialog({ width: width });
        }
        var height = 500;
        if ($(window).height() <= 500) {
            height = $(window).height();
        } else {
            height = $(window).height() * 0.8;
        }
        if (jqdialog.height() > height) {
            jqdialog.dialog({ height: height });
        }
        jqdialog.dialog({ position: 'center' });
    },
    initFormValue: function (regexObj) {
        $.each(regexObj, function (i) {
            var selector = i;
            var formObj = $(selector);
            switch (formObj.attr("type").toLowerCase()) {
                case "button":
                case "reset":
                case "submit":
                    break;
                case "radio":
                    $(i + "[value='" + regexObj[i] + "']").attr("checked", true);
                    break;
                case "checkbox":
                    if (regexObj[i].length > 0) {
                        var array = regexObj[i].split(',');
                        $.each(array, function (j) {
                            $(i + "[value='" + array[j] + "']").attr("checked", true);
                        });
                    } else {
                        formObj.attr("checked", false);
                    }
                    break;
                default:
                    formObj.val(regexObj[i]);
                    break;
            }
        });
    },
    verifyQueryValue: function (regexObj, lineBreak) {//验证传递的值
        var tips = "";
        var formQueryString = "";
        var url = window.location.href;
        $.each(regexObj, function (i) {
            var array = regexObj[i];
            var patrnStr = "";
            var tip = "";
            $.each(array, function (i) {
                patrnStr = i;
                tip = array[i];
            });
            var tempQueryVal = $.trim($JQueryExtUtils.queryString(i, url));
            var partn = new RegExp(patrnStr);
            if (!partn.exec(tempQueryVal)) {
                tips = tips == "" ? tip : tips + lineBreak + lineBreak + tip;
            }
            formQueryString = $JQueryExtUtils.ajaxPostSerializeForKeyVal(formQueryString, i, tempQueryVal);
        });
        var array = new Array();
        array[0] = formQueryString;
        array[1] = tips;
        return array;
    },
    getTopLevelWindow: function () {//获取最外层的window
        var w = window;
        while (true) {
            if (w.parent == w) {
                return w;
            }
            w = w.parent;
        }
    },
    substrString: function (str, len) {//判断字符串长度。以字节为单位（即一个中文算2个单位）
        var tempStr = $JQueryExtUtils.htmlDecode(str);
        var strResult = "";
        var i;
        for (i = 0; i < tempStr.length && len > 0; i++) {
            var patrnStr = /^[\uFF00-\uFFFF\u4e00-\u9fa5]$/;
            var strTemp = tempStr.substr(i, 1);
            if (patrnStr.exec(strTemp)) {
                len = len - 2;
            } else {
                len = len - 1;
            }

            strResult = strResult + strTemp;
        }
        if (len <= 0 && i != str.length) {
            strResult = strResult + "…";
        }
        return strResult;
    },
    ie6SelectHide: function () {//在IE6下将已显示的select打包入数组并屏蔽
        var selects = "nothing";
        if ($.browser.msie && parseInt($.browser.version) <= 6) {
            selects = [];
            $("select").each(function () {
                if (!$(this).is(":hidden") && $(this).css("visibility") != 'hidden') {
                    selects.push(this);
                    $(this).css("visibility", "hidden");
                }
            });
        }
        return selects;
    },
    //在IE6下恢复被屏蔽的select
    ie6SelectDisplay: function (selects) {
        if (selects != null) {
            $(selects).each(function () {
                $(this).css("visibility", "visible");
            });
        }
    },
    showDivTip: function (e, obj, width, height) {//显示弹出层		
        var cx, cy;
        //获得当前鼠标所在的位置
        e = window.event ? window.event : e;
        cx = e.clientX;
        cy = e.clientY;
        //获得当前滚动条的位置
        var dobumentObj = $JQueryExtUtils.getBody();
        var sl, st;
        if (typeof window.pageYOffset != 'undefined') {
            st = window.pageYOffset;
            sl = window.pageXOffset;
        } else {
            st = dobumentObj.scrollTop;
            sl = dobumentObj.scrollLeft;
        }
        //获得整个窗口大小
        var TotalWidth = dobumentObj.clientWidth;
        var TotalHeight = dobumentObj.clientHeight;
        var iPositonLeft = sl + cx;
        var iPositonTop = st + cy;
        if ((iPositonTop + height + 10) > TotalHeight) {
            iPositonLeft = iPositonLeft - width - 10;
            iPositonTop = iPositonTop;
        } else {
            iPositonLeft = iPositonLeft - width - 10;
            iPositonTop = iPositonTop;
        }
        var sLeft = iPositonLeft + "px";
        var sTop = iPositonTop + "px";
        $(obj).css("left", sLeft);
        $(obj).css("top", sTop);
        $(obj).css("display", "block");
    },
    getBody: function () {//获得body对象
        if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
            return document.documentElement;
        } else {
            return document.body;
        }
    },
    waitForReady: function (query, callback, callbackpre) {//等待加载是否可用
        var tryTimes = 0;
        var done = false;
        if (callbackpre) callbackpre();
        checkReady();
        if (!done) {
            var intervalId = setInterval(checkReady, 300);
        }
        function checkReady() {
            tryTimes++;
            try {
                var result = eval(query);
                if (result || tryTimes > 200) {
                    done = true;
                    if (intervalId) clearInterval(intervalId);
                    callback();
                }
            } catch (ex) {
                alert(ex); //对象尚不可用
            }
        }
    },
    htmlEncode: function (str) {//对html编码
        if (!str) return str;
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/\"/g, "&quot;");
        str = str.replace(/ /g, "&nbsp;");
        return str;
    },
    htmlDecode: function (str) {//对html解码
        if (!str) return str;
        str = str.replace(/&amp;/g, "&");
        str = str.replace(/&lt;/g, "<");
        str = str.replace(/&gt;/g, ">");
        str = str.replace(/&quot;/g, "\"");
        str = str.replace(/&nbsp;/g, " ");
        return str;
    },
    htmlSimpleDecode: function (str) {//对html解码
        if (!str) return str;
        str = str.replace(/<br\/>/g, "\n");
        str = str.replace(/<br>/g, "\n");
        return str;
    },
    getFileNameByPath: function (path) {//获得文件名字
        var fileName = "";
        var charIndex = path.lastIndexOf("\\");
        if (charIndex != -1) {
            fileName = path.substr(charIndex + 1);
        }
        return fileName;
    },
    requestByScript: function (scriptId, dataHref, callback) {//增加或替换脚本
        var head = document.getElementsByTagName("head")[0];
        var objScript = document.getElementById(scriptId);
        if (objScript != null) {
            objScript.parentNode.removeChild(objScript);
        }
        var dataScript = document.createElement("script");
        if (callback) {
            if (document.all) {
                dataScript.onreadystatechange = function () {
                    if (dataScript.readyState == "loaded" || dataScript.readyState == "complete") {
                        if (callback) callback();
                    }
                };
            } else {
                dataScript.onload = callback;
            }
        }
        dataScript.id = scriptId;
        dataScript.charset = "utf-8";
        dataScript.src = dataHref;
        dataScript.defer = true;
        dataScript.type = "text/javascript";
        head.appendChild(dataScript);
    },
    requestByCss: function (sId, fileUrl) {//动态加载css
        var cssTag = document.getElementById(sId);
        var oHead = document.getElementsByTagName('HEAD')[0];
        if (cssTag) {
            oHead.removeChild(cssTag);
        }
        var oCss = document.createElement('link');
        oCss.id = sId;
        oCss.href = fileUrl;
        oCss.rel = 'stylesheet';
        oCss.type = 'text/css';
        oHead.appendChild(oCss);
    },
    queryString: function (param, url) {//url具体参数的值
        if (!url) {
            url = location.search;
        }
        url = url.replace(eval('/(#)([^&]*)/gi'), "");
        var svalue = url.match(new RegExp("[?&]" + param + "=([^&]*)", "i"));
        return svalue ? unescape(svalue[1]) : null;
    },
    getPosition: function (obj) {//获得元素的绝对位置
        var top = 0;
        var left = 0;
        var width = obj.offsetWidth;
        var height = obj.offsetHeight;
        while (obj.offsetParent) {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        return { "top": top, "left": left, "width": width, "height": height };
    },
    preloadImages: function () {//预加载图片
        var imgs = [];
        for (var i = 0; i < arguments.length; i++) {
            imgs[i] = new Image();
            imgs[i].src = arguments[i];
        }
    },
    toArray: function (obj, nameFlag) {//将object转换为数组
        var arr = new Array();
        for (elem in obj) {
            if (nameFlag) {
                arr.push(elem);
            } else {
                arr.push(obj[elem]);
            }
        }
        return arr;
    },
    getLength: function (obj) {//获得对象的长度
        var i = 0;
        for (elem in obj) {
            i++;
        }
        return i;
    },
    LoadXML: function (XmlStr) {//将Xml字符串转换成XmlDocment
        var xmlDoc = null;
        try {
            if ($.browser.msie) {
                xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = false;
                xmlDoc.loadXML(XmlStr);
            } else {// 用于 Mozilla, Firefox, Opera, 等浏览器的代码： 
                var oParser = new DOMParser();
                xmlDoc = oParser.parseFromString(XmlStr, "text/xml");
            }
        } catch (e) { }
        return xmlDoc;
    },
    Load: function (XmlFile) {//读取XML文件
        var xmlDoc = null;
        try {
            if ($.browser.msie) {
                xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = false;
                xmlDoc.load(XmlFile);
            } else {// 用于 Mozilla, Firefox, Opera, 等浏览器的代码：
                xmlDoc = document.implementation.createDocument("", "", null);
                xmlDoc.async = false;
                xmlDoc.load(XmlFile);

                var oSerializer = new XMLSerializer();
                xmlDoc = oSerializer.serializeToString(xmlDoc);
            }
        } catch (e) { }
        return xmlDoc;
    },
    encodeURI: function (s) {//对url编码
        var URI_E_CHARS = new Array();
        for (var i = 0x00; i < 0x80; i++) {
            var c = String.fromCharCode(i);
            if (i < 0x10) {
                URI_E_CHARS[c] = "%0" + i.toString(16);
            }
            else if (c >= '0' && c <= '9')
            { }
            else if (c >= 'A' && c <= 'Z')
            { }
            else if (c >= 'a' && c <= 'z')
            { }
            else {
                URI_E_CHARS[c] = "%" + i.toString(16);
            }
        }
        URI_E_CHARS[" "] = "+";
        var s1 = "";
        for (i = 0; i < s.length; i++) {
            var c0 = s.charAt(i);
            var c1 = URI_E_CHARS[c0];
            s1 += c1 ? c1 : c0;
        }
        return s1;
    },
    parseDate: function (str) {//将字符串转成日期类型
        var tmpArr = str.split(" ");
        var dateStr = tmpArr[0];
        var tmpDateArr = dateStr.split(".");
        var iYear = tmpDateArr[0];
        var iMonth = tmpDateArr[1];
        var iDate = tmpDateArr[2];
        var timeStr = tmpArr[1];
        var tmpTimeArr = timeStr.split(":");
        var iHour = tmpTimeArr[0];
        var iMinute = tmpTimeArr[1];
        return new Date(iYear, iMonth - 1, iDate, iHour, iMinute);
    },
    parseAccessDate: function (str) {//将字符串转成yyyy-MM-dd hh:mm:ss格式串
        try {
            var iT = str.indexOf("T");
            var sBegin = str.substring(0, iT);
            var iP = str.indexOf("\.");
            var sEnd;
            if (iP > 0) {
                sEnd = str.substring(iT + 1, iP);
            } else {
                iP = str.indexOf("\+");
                sEnd = str.substring(iT + 1, iP);
            }
            return sBegin + " " + sEnd;
        } catch (ex) {
            return str;
        }
    },
    //检查是否浏览器支持cookies
    checkcookie: function () {
        var result = false;
        if (navigator.cookiesEnabled) return true;
        document.cookie = "testcookie=yes;";
        var cookieSet = document.cookie;
        if (cookieSet.indexOf("testcookie=yes") > -1) result = true;
        document.cookie = "";
        return result;
    },
    //设置cookie
    setCookie: function (name, value, expiry) {
        //24 * 60 * 60//小时，分，秒
        var exp = new Date();
        exp.setTime(exp.getTime() + expiry);
        document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
    },
    //获取cookie
    getCookie: function (name) {
        var tempName = $JQueryExtUtils.JSRegexEscape(name);
        var arr, reg = new RegExp("(^| )" + tempName + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) return unescape(arr[2]);
        else return 0;
    },
    //删除cookie
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 2 * 24 * 60 * 60 * 1000);
        var cval = getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    urlHref: function () {//获取当前访问的页面的地址
        return window.location.href;
    },
    urlHost: function () {
        return window.location.host;
    },
    urlPort: function () {
        return window.location.port;
    },
    urlDomain: function () {
        var port = $JQueryExtUtils.urlPort();
        if ($.trim(port) == "") {
            return $JQueryExtUtils.urlHost();
        } else {
            if ($JQueryExtUtils.urlHost().indexOf(":") > 0) {
                return $JQueryExtUtils.urlHost();
            } else {
                var sDomain = $JQueryExtUtils.urlHost() + ":" + $JQueryExtUtils.urlPort();
                return sDomain;
            }
        }
    },
    getPagePosition: function () {
        var ret = {};
        var dstWin = window;
        ret.scrollLeft = dstWin.pageXOffset || dstWin.document.documentElement.scrollLeft || dstWin.document.body.scrollLeft || 0;
        ret.scrollTop = dstWin.pageYOffset || dstWin.document.documentElement.scrollTop || dstWin.document.body.scrollTop || 0;
        ret.clientWidth = dstWin.innerWidth || dstWin.document.documentElement.clientWidth || dstWin.document.body.clientWidth || 0;
        ret.clientHeight = dstWin.innerHeight || dstWin.document.documentElement.clientHeight || dstWin.document.body.clientHeight || 0;
        return ret;
    },
    getPageSize: function () {
        var xScroll, yScroll;
        if (window.innerHeight && window.scrollMaxY) {
            xScroll = document.body.scrollWidth;
            yScroll = window.innerHeight + window.scrollMaxY;
        } else {
            if (document.body.scrollHeight > document.body.offsetHeight) {
                xScroll = document.body.scrollWidth;
                yScroll = document.body.scrollHeight;
            } else {
                xScroll = document.body.offsetWidth;
                yScroll = document.body.offsetHeight;
            }
        }
        var windowWidth, windowHeight;
        if (self.innerHeight) {
            windowWidth = self.innerWidth;
            windowHeight = self.innerHeight;
        } else {
            if (document.documentElement && document.documentElement.clientHeight) {
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            } else {
                if (document.body) {
                    windowWidth = document.body.clientWidth;
                    windowHeight = document.body.clientHeight;
                }
            }
        }
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }
        if (xScroll < windowWidth) {
            pageWidth = windowWidth;
        } else {
            pageWidth = xScroll;
        }
        arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
        return arrayPageSize;
    },
    getEmail: function (email) {//从发件人中提取邮件地址和姓名
        var result = [];
        email = this.htmlDecode(email);
        var m = email.match(/"(.+?)"\W+<(\w+([.-]?\w)*@\w+([.-]?\w)*\.\w+([.-]?\w)*)>/i);
        if (m) {
            result[0] = m[1];
            result[1] = m[2];
        } else {
            var idx = email.indexOf("@");
            result[0] = email.substr(0, idx);
            result[1] = email;
        }
        return result;
    },
    focusTextBox: function (objTextBox) {
        try {
            if (document.all) {
                var r = objTextBox.createTextRange();
                r.moveStart("character", objTextBox.value.length);
                r.collapse(true);
                r.select();
            } else {
                objTextBox.setSelectionRange(objTextBox.value.length, objTextBox.value.length);
                objTextBox.focus();
            }
        } catch (e) { }
    },
    clipboardCopy: function (txt) {//剪切板
        if (window.clipboardData) {
            window.clipboardData.clearData();
            window.clipboardData.setData("Text", txt);
            return true;
        } else {
            if (!!window.opera) {
                window.location = txt;
                return true;
            } else if (navigator.appName.lastIndexOf('Netscape') != -1) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

                    var clip = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);

                    if (!clip) {
                        return false;
                    }

                    var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);

                    if (!trans) {
                        return false;
                    }

                    trans.addDataFlavor("text/unicode");

                    var str = new Object();
                    var len = new Object();
                    str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
                    var copytext = txt;
                    str.data = copytext;

                    trans.setTransferData("text/unicode", str, copytext.length * 2);
                    var clipid = Components.interfaces.nsIClipboard;

                    if (!clipid) {
                        return false;
                    }

                    clip.setData(trans, null, clipid.kGlobalClipboard);

                    return true;
                } catch (e) {
                    alert("您的浏览器安全限制设置限制您进行剪贴板操作。\n请在地址栏输入\"about:config\"将\"signed.applets.codebase_principal_support\"设置为\"true\"之后重试。");
                    return false;
                }
            }

            return false;
        }
    },
    addFavorite: function (url, title) {//添加收藏夹
        if (!!(window.ActiveXObject && !window.opera)) {
            window.external.addFavorite(url, title);
        } else if (window.sidebar) {
            window.sidebar.addPanel(title, url, "");
        } else {
            alert("当前浏览器不支持收藏夹功能。");
        }
    },
    getLeftStr: function (str, len, showSymbol) {
        if (!str) return str;
        var leftStr = str;
        var curLen = 0;
        for (var i = 0; i < str.length; i++) {
            curLen += str.charCodeAt(i) > 255 ? 2 : 1;
            if (curLen > len) {
                leftStr = str.substring(0, i);
                break;
            } else if (curLen == len) {
                leftStr = str.substring(0, i + 1);
                break;
            }
        }
        if (showSymbol) {
            if (leftStr != str) {
                leftStr += "...";
            }
        }
        return leftStr;
    },
    getCharLen: function (str) {
        var curLen = 0;
        for (var i = 0; i < str.length; i++) {
            curLen += str.charCodeAt(i) > 255 ? 2 : 1;
        }
        return curLen;
    },
    GetExtName: function (str) {
        return str.replace(/.+\./, "").toLowerCase();
    },
    ConvertSize: function (str) {
        var Size = Number(str);
        if (Size == 0) {
            return "";
        }
        var ret = "";
        var cSize = 0;
        if (Size > 1024) {
            cSize = Math.round(Size / 1024);
            if (cSize > 1024) {
                try {
                    cSize = (cSize / 1024).toFixed(2);
                }
                catch (e) {//低版本的IE可能不支持toFixed();
                    cSize = Math.round(cSize / 1024 * 100) / 100;
                }
                ret = cSize + "M";
            } else {
                ret = cSize + "K";
            }
        } else {
            ret = Size + "字节";
        }
        return ret;
    },
    JSRegexEscape: function (str) {//Js正则转义
        //^ $ . * + ? = ! : | \ / () [] {}
        var s = "";
        var strTemp = "";
        for (var i = 0; i < str.length; i++) {
            s = str.substr(i, 1);
            switch (s) {
                case "^":
                    strTemp += "\\^";
                    break;
                case "$":
                    strTemp += "\\$";
                    break;
                case ".":
                    strTemp += "\\.";
                    break;
                case "*":
                    strTemp += "\\*";
                    break;
                case "+":
                    strTemp += "\\+";
                    break;
                case "?":
                    strTemp += "\\?";
                    break;
                case "=":
                    strTemp += "\\=";
                    break;
                case "!":
                    strTemp += "\\!";
                    break;
                case ":":
                    strTemp += "\\:";
                    break;
                case "|":
                    strTemp += "\\|";
                    break;
                case "\\":
                    strTemp += "\\\\";
                    break;
                case "/":
                    strTemp += "\\/";
                    break;
                case "(":
                    strTemp += "\\(";
                    break;
                case ")":
                    strTemp += "\\)";
                    break;
                case "[":
                    strTemp += "\\[";
                    break;
                case "]":
                    strTemp += "\\]";
                    break;
                case "{":
                    strTemp += "\\{";
                    break;
                case "}":
                    strTemp += "\\}";
                    break;
                default:
                    strTemp += s;
                    break;
            }
        }
        return strTemp;
    },
    verifyinterceptor: function (vregobj) {
        var oResult = {
            name: "",
            error: ""
        }
        var sEleName = "";
        var sEleValue = "";
        var sSelector = "";
        var sType = "";
        var oSelector = null;
        var vType = "";
        var vMsg = "";
        var vRule = "";
        var oTempSelector = null;
        var bCustom = false;
        var bExit = true;
        $.each(vregobj.EleList, function (i) {
            sEleName = this.EleName;
            sSelector = "*[name='" + sEleName + "']";
            oSelector = $(sSelector);
            if (oSelector.attr("type") == null || typeof oSelector.attr("type") == "undefined") {
                sType = "textarea";
            } else {
                sType = oSelector.attr("type").toLowerCase();
            }
            switch (sType) {
                case "button":
                case "reset":
                case "submit":
                    break;
                case "radio":
                    oTempSelector = oSelector.filter(":checked");
                    if (oTempSelector == null || typeof oTempSelector == "undefined") {
                        sEleValue = "";
                    } else {
                        sEleValue = oSelector.filter(":checked").val();
                    }
                    break;
                case "checkbox":
                    sEleValue = "";
                    oTempSelector = oSelector.filter(":checked");
                    if (oTempSelector == null || typeof oTempSelector == "undefined") {
                        sEleValue = "";
                    } else {
                        oTempSelector.each(function (j) {
                            if (j == 0) {
                                sEleValue = $(this).val();
                            } else {
                                sEleValue = sEleValue + "," + $(this).val();
                            }
                        });
                    }
                    break;
                default:
                    sEleValue = oSelector.val();
                    break;
            };
            $.each(this.ValRule, function (k) {
                vType = this.VType;
                vMsg = this.VMsg;
                vRule = this.VRule;

                switch (vType.toLowerCase()) {
                    case "required":
                        if (sEleValue == null || typeof sEleValue == "undefined" || $.trim(sEleValue) == "") {
                            oResult.name = sEleName;
                            oResult.error = vMsg;
                            bExit = false;
                        } else {
                            if ($.trim(sEleValue) == "") {
                                oResult.name = sEleName;
                                oResult.error = vMsg;
                                bExit = false;
                            }
                        }
                        break;
                    case "stringlength":
                        if (sEleValue == null || typeof sEleValue == "undefined" || $.trim(sEleValue) == "") {
                            oResult.name = sEleName;
                            oResult.error = vMsg;
                            bExit = false;
                        } else {
                            if ($JQueryExtUtils.getCharLen($.trim(sEleValue)) != parseInt(vRule)) {
                                oResult.name = sEleName;
                                oResult.error = vMsg;
                                bExit = false;
                            }
                        }
                        break;
                    case "regularexpression":
                        if (sEleValue != null && typeof sEleValue != "undefined") {
                            var patt1 = new RegExp(vRule);
                            var result = patt1.test(sEleValue);
                            if (!result) {
                                oResult.name = sEleName;
                                oResult.error = vMsg;
                                bExit = false;
                            }
                        }
                        break;
                    case "custom":
                        bCustom = eval("(" + vRule + "())");
                        if (!bCustom) {
                            oResult.name = sEleName;
                            oResult.error = vMsg;
                            bExit = false;
                        }
                        break;
                    default:
                        break;
                }
                return bExit;
            });
            return bExit;
        });
        return oResult;
    }
}

var $JSonExtendObject = {//json处理
    Filter: { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' },
    ArraytoJSONString: function (obj, w) {//将数组转换成json格式
        var a = [], i, l = obj.length, v;
        for (i = 0; i < l; i += 1) {
            v = obj[i];
            switch (typeof v) {
                case 'object':
                    if (v) {
                        a.push($JSonExtendObject.ObjecttoJSONString(v, w));
                    } else {
                        a.push('null');
                    }
                    break;
                case 'string':
                    a.push($JSonExtendObject.StringtoJSONString(v));
                    break;
                case 'number':
                    a.push($JSonExtendObject.NumbertoJSONString(v));
                    break;
                case 'boolean':
                    a.push($JSonExtendObject.BooleantoJSONString(v));
                    break;
                default:
                    a.push('null');
            }
        }
        return '[' + a.join(',') + ']';
    },
    BooleantoJSONString: function (obj) {
        return String(obj);
    },
    DatetoJSONString: function (obj) {
        function f(n) {
            return n < 10 ? '0' + n : n;
        }
        return '"' + obj.getUTCFullYear() + '-' + f(obj.getUTCMonth() + 1) + '-' + f(obj.getUTCDate()) + 'T' + f(obj.getUTCHours()) + ':' + f(obj.getUTCMinutes()) + ':' + f(obj.getUTCSeconds()) + 'Z"';
    },
    NumbertoJSONString: function (obj) {
        return isFinite(obj) ? String(obj) : 'null';
    },
    StringtoJSONString: function (obj) {
        if (/["\\\x00-\x1f]/.test(obj)) {
            return '"' + obj.replace(/[\x00-\x1f\\"]/g, function (a) { var c = $JSonExtendObject.Filter[a]; if (c) { return c; } c = a.charCodeAt(); return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16); }) + '"';
        }
        return '"' + obj + '"';
    },
    ObjecttoJSONString1:function(obj,w){
            var a=[],k,i,v;
            if(w){
                for(i=0;i<w.length;i+=1){
                    k=w[i];
                    if(typeof k==='string'){
                        v=obj[k];
                        switch(typeof v){
                            case 'object':
                                if(v){                                
                                    a.push($JSonExtendObject.StringtoJSONString(k) +':'+ $JSonExtendObject.ObjecttoJSONString(v,w));
                                }else{
                                    a.push($JSonExtendObject.StringtoJSONString(k)+':null');
                                }
                                break;
                            case 'string':
                                a.push($JSonExtendObject.StringtoJSONString(k) +':'+ $JSonExtendObject.StringtoJSONString(v));
                                break;
                            case 'number':
                                a.push($JSonExtendObject.StringtoJSONString(k) +':'+ $JSonExtendObject.NumbertoJSONString(v));
                                break;
                            case 'boolean':
                                a.push($JSonExtendObject.StringtoJSONString(k) +':'+ $JSonExtendObject.BooleantoJSONString(v));
                                break;
                        }
                    }
                }
            }else{
                for(k in obj){
                    if(typeof k==='string'&&Object.prototype.hasOwnProperty.apply(obj,[k])){
                        v=obj[k];
                        switch(typeof v){
                            case 'object':
                                if(v){                                
                                    a.push($JSonExtendObject.StringtoJSONString(k) +':'+ $JSonExtendObject.ObjecttoJSONString(v));
                                }else{
                                    a.push($JSonExtendObject.StringtoJSONString(k)+':null');
                                }
                                break;
                            case 'string':
                                a.push($JSonExtendObject.StringtoJSONString(k) +':'+ $JSonExtendObject.StringtoJSONString(v));
                                break;
                            case 'number':
                                a.push($JSonExtendObject.StringtoJSONString(k) +':'+ $JSonExtendObject.NumbertoJSONString(v));
                                break;
                            case 'boolean':
                                a.push($JSonExtendObject.StringtoJSONString(k) +':'+ $JSonExtendObject.BooleantoJSONString(v));
                                break;
                        }
                    }
                }
            }
            return '{'+a.join(',')+'}';
        },
    ObjecttoJSONString: function (obj, w) {
        return JSONConverter.stringify(obj);
    },
    StringparseJSON: function (obj, filter) {
        var j;
        function walk(k, v) {
            var i, n;
            if (v && typeof v === 'object') {
                for (i in v) {
                    if (Object.prototype.hasOwnProperty.apply(v, [i])) {
                        n = walk(i, v[i]);
                        if (n !== undefined) {
                            v[i] = n;
                        } else {
                            delete v[i];
                        }
                    }
                }
            }
            return filter(k, v);
        }
        try {
            j = eval('(' + obj + ')');
            return j;
        } catch (ex) { }
        if (!j) {
            if (/^[\],:{}\s]*$/.test(obj.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + obj + ')');
                return typeof filter === 'function' ? walk('', j) : j;
            }
        }
        return null;
    },
    JsontoObject: function (json, filter) { 
        if (!json) return null;
        var obj = null;
        if (typeof json == "string") {
            try {
                obj = $JSonExtendObject.StringparseJSON(json, filter);
            } catch (e) {
                return null;
            }
        } else {
            var s;
            switch (typeof json) {
                case 'object':
                    if (v) {
                        s = $JSonExtendObject.ObjecttoJSONString(json);
                    } else {
                        s = 'null';
                    }
                    break;
                case 'string':
                    s = $JSonExtendObject.StringtoJSONString(json);
                    break;
                case 'number':
                    s = $JSonExtendObject.NumbertoJSONString(json);
                    break;
                case 'boolean':
                    s = $JSonExtendObject.BooleantoJSONString(json);
                    break;
                default:
                    s = 'null';
            }
            if (s) {
                try {
                    obj = $JSonExtendObject.StringparseJSON(s, filter);
                } catch (e) {
                    return null;
                }
            }
        }
        return obj;
    }
};

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

Date.prototype.Format = function(fmt)   
{   
   var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
     };   
    if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;   
}  


if (typeof JSONConverter !== 'object') {
    JSONConverter = {};
}

(function () {
    'use strict';
    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];
        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    if (typeof JSONConverter.stringify !== 'function') {
        JSONConverter.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', { '': value });
        };
    }
    if (typeof JSONConverter.parse !== 'function') {
        JSONConverter.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function'
                    ? walk({ '': j }, '')
                    : j;
            }
            throw new SyntaxError('JSONConverter.parse');
        };
    }
}());

function BindControlEventListen(oElement, sName, fObserver, bUseCapture) {
    bUseCapture = !!bUseCapture;
    if (oElement.addEventListener) {
        oElement.addEventListener(sName, fObserver, bUseCapture);
    } else if (oElement.attachEvent) {
        oElement.attachEvent('on' + sName, fObserver);
    }
}