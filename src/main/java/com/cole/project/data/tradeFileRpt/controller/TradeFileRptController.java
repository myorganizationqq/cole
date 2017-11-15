package com.cole.project.data.tradeFileRpt.controller;

import com.cole.project.common.controller.BasicController;
import com.cole.project.data.tradeFileRpt.entity.TradeFileRptVO;
import com.cole.project.data.tradeFileRpt.service.ITradeFileRptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author JiangFeng
 * @date 2017/11/14
 * @Description
 */
@Controller
@RequestMapping("/data/tradeFileRpt/TradeFileRpt")
public class TradeFileRptController extends BasicController{
    @Autowired
    private ITradeFileRptService tradeFileRptService;
    @RequestMapping("/getList")
    public ModelAndView getList(HttpServletRequest request, HttpServletResponse response, TradeFileRptVO tradeFileRptVO,long id){
        TradeFileRptVO tr = tradeFileRptService.getOne(id);
        System.out.println(tr.getBalanceWaterNo()+"---------------------------------");
        return null;
    }
}
