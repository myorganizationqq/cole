//扩展jquery对下拉菜单进行显示和隐藏控制
(function ($) {    
    var constant = {
        //键盘键值
        keyCode: {
            up: 38,
            down: 40,
            enter: 13,
            backspace: 8
        },
        initOffset: 2	//加载列表后，选中元素距离可视区域顶部的偏移量

    };
    $.fn.comBox = function (options) {
        var defaults = {
            ev: 'click',  //默认事件
            evObj: '.numIconWrap',  //鼠标点击显示的区域
            changeObj: '.toggleNum',//改变文字区域
            showObj: '.manyNum', //可选择的文字区域
            arrowObj: '.icon_items',//箭头图标元素
            keyName: 'id',	//作为数据的键的名称
            valName: 'name',	//作为数据的值的名称
            inputCallBack: function (valObj) {
            },	//输入框输入后的回调函数
            selectCallBack: function () {
            }	//enter键选中后的回调函数
        };

        var opts = $.extend(defaults, options);

        return this.each(function () {
            var _this = $(this),
                obj = _this.find(opts.evObj),
                changeTxtObj = obj.find(opts.changeObj),
                showUlObj = _this.find(opts.showObj),
                arrowUDObj = _this.find(opts.arrowObj),
                isInput = changeTxtObj.hasClass("inputTxt"),
                keyName = opts.keyName,
                valueName = opts.valName,
                containerHeight = 0,
                itemheight = 0,	//每条元素所占高度
                /*以下变量用于模糊查询时*/
                curIndex = 0,
                totalItems = null,
                activedItemVal = null,
                initFlag = true,
                //additional
                allItemCache = null,
                initTotalItems = 0;


            obj.on(opts.ev, function () {  //显示隐藏的的选项指
                showUlObj.toggle();
                _this.addClass('maxIndex');
                var itemList = showUlObj.find('li');

                /*----------initial global statement start，该代码块只执行一次----------*/
                if (initFlag && isInput) {
                    initFlag = false;
                    initTotalItems = totalItems = itemList.length;
                    var activedItem = showUlObj.find('li.active');
                    curIndex = activedItem.prevAll('li').length;
                    activedItemVal = activedItem.attr('data');
                    containerHeight = showUlObj.height();
                    itemheight = $(itemList[0]).outerHeight(true);
                    _initScrollTo(showUlObj, containerHeight, itemheight, curIndex);

                    //additional
                    allItemCache = showUlObj.find('li').clone(true);
                }
                /*----------initial global statement end，该代码块只执行一次----------*/

                if (showUlObj.is(':visible') && isInput && !initFlag) {
                    showUlObj.empty().append(allItemCache);
                    allItemCache = allItemCache.clone(true);
                    totalItems = initTotalItems;
                    showUlObj.find('li').removeClass('active');
                    var activedItem = showUlObj.find('li[data=' + activedItemVal + ']');
                    activedItem.addClass('active');
                    curIndex = showUlObj.find('li.active').prevAll('li').length;
                    _initScrollTo(showUlObj, containerHeight, itemheight, curIndex);
                }

            });

            /**
             * 当控件要带模糊查询功能，则执行以下的代码块
             * */
            if (isInput) {
                var timer = 0;	//定时器标记，用作清除定时器

                changeTxtObj.on('keyup', function (event, fake) {	//参数fake表示是否是由真正的键盘事件触发，true为假，false为真
                    var e = event || window.event;
                    var ecode = e.keyCode;
                    clearTimeout(timer);

                    if (ecode == constant.keyCode.up ||
                        ecode == constant.keyCode.down ||
                        ecode == constant.keyCode.enter) {

                        if (showUlObj.is(':visible')) {
                            var itemList = showUlObj.find('li');

                            if (totalItems) {

                                if (ecode == constant.keyCode.up && curIndex) {
                                    curIndex--;
                                    var scrollToP = showUlObj.scrollTop() - itemheight;
                                    showUlObj.scrollTop(scrollToP > 0 ? scrollToP : 0);
                                } else if (ecode == constant.keyCode.down && curIndex < totalItems - 1) {
                                    curIndex++;
                                    if ((curIndex + 1) * itemheight > containerHeight) {
                                        var scrollToP = showUlObj.scrollTop() + itemheight;
                                        showUlObj.scrollTop(scrollToP);
                                    }
                                } else if (ecode == constant.keyCode.enter) {
                                    changeTxtObj.blur();
                                    itemList.filter(':eq(' + curIndex + ')').click();
                                    opts.selectCallBack(curIndex);
                                }

                                if (ecode == constant.keyCode.up || ecode == constant.keyCode.down) {
                                    itemList.removeClass('highlight');
                                    showUlObj.find('li:eq(' + curIndex + ')').addClass('highlight');
                                }
                            }
                        }

                    } else {
                        var inpVal = $(this).val();
                        timer = setTimeout(function () {
                            var callBackObj = {};
                            callBackObj[valueName] = inpVal;
                            opts.inputCallBack(callBackObj);

                            var activedItem = showUlObj.find('li[data=' + activedItemVal + ']');
                            if (activedItem.length > 0) {
                                activedItem.addClass('active');
                            } else {
                                showUlObj.find('li:first').addClass('highlight');
                            }
                            totalItems = showUlObj.find('li').length;
                            curIndex = showUlObj.find('li.active').prevAll('li').length;
                            _initScrollTo(showUlObj, containerHeight, itemheight, curIndex);

                            if (!fake) {
                                showUlObj.show();
                            }

                        }, 300);
                    }
                });

                arrowUDObj.on('click', function () {
                    changeTxtObj.focus();
                });
            }

            showUlObj.on(opts.ev, 'li', function () {   //取值
                var txt = $(this).text();
                $(this).addClass('active').siblings().removeClass('active');
                _this.removeClass('maxIndex');
                if (isInput) {
                    changeTxtObj.val(txt);
                    showUlObj.hide().find('li').removeClass('highlight');
                    curIndex = $(this).index();
                    activedItemVal = $(this).attr('data');
                    //changeTxtObj.trigger('keyup', true);//选择后列表重新以该选择项为条件重新加载列表
                } else {
                    changeTxtObj.text(txt);
                }
                changeTxtObj.prop("title", $(this).prop("title"));
            });

            var documentHideOptsEvent = "click." + new Date().getTime();

            $(document).on(documentHideOptsEvent, function (e) {  //点击页面取消显示
                var _target = $(e.target).closest(obj);
                if (!_target.is(obj) && showUlObj.is(':visible')) {
                    showUlObj.hide();
                    _this.removeClass('maxIndex');
                    if (isInput) {
                        showUlObj.find('li').removeClass('highlight');
                        curIndex = showUlObj.find('li.active').prevAll('li').length;
                    }
                }
            });

        });
    };

    //列表加载完毕，调整初始滚动位置
    function _initScrollTo(showUlObj, containerHeight, itemheight, index) {

        var scrollToP = index * itemheight - constant.initOffset * itemheight;
        showUlObj.scrollTop(scrollToP > 0 ? scrollToP : 0);
    }
    $.fn.disableComBox = function () {
        return this.each(function () {
            $(this).children('.overlay').remove();
            var overlay = $(this).children('.numIconWrap').clone();
            overlay.appendTo($(this)).addClass('overlay')
                .css({
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'border': '0 none',
                    'backgroundColor': '#F4F4F4',
                    'z-index': 999
                })
                .click(function (event) {
                    event.stopPropagation();
                });
        });
    };
    $.fn.enableComBox = function (options) {

        return this.each(function () {

            $(this).find('.overlay').remove();
        });
    };
})(jQuery);