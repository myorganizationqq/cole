<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="pageSizeWrap clearfix mt20 mb30">
    <input type="hidden" class="currentPage" name="curpage" value="0"/>
    <input type="hidden" class="RecordCount" name="RecordCount" value="0"/>
    <input type="hidden" class="RecordTotal" name="RecordTotal" value="0"/>
    <div class="pageDiv"></div>
    <div class="downSelectWrap1 pr fr mr5 w95" id="pagesize">
        <input type="hidden" class="pageSize" name="pagesize" value="1"/>
        <div class="pa numIconWrap"><span class="toggleNum">1</span><i class="icon icon_items pa">&nbsp;</i></div>
        <ul class="manyNum pa none">
            <li class="active" data="1">1</li>
            <li data="40">40</li>
            <li data="100">100</li>
        </ul>
    </div>
</div>