package com.cole.project.web.controller.common;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import com.cole.web.bean.AjaxResult;
import com.cole.web.util.HttpAjaxUtils;
import com.cole.web.util.PromptMessage;

/**
 * 异常捕获类
 */
@Component
public class ExceptionHandler implements HandlerExceptionResolver {
  private static final Logger LOGGER = LoggerFactory.getLogger(ExceptionHandler.class);

  @Override
  public ModelAndView resolveException(HttpServletRequest request,
                                       HttpServletResponse response, Object handler, Exception ex) {
    LOGGER.error(ex.getMessage(), ex);
    if(HttpAjaxUtils.isAjaxRequest(request)){
    	AjaxResult ajaxResult=new AjaxResult();
		ajaxResult.setCode(PromptMessage.SYSTEM_ERROR.getCode());
		ajaxResult.setMsg(PromptMessage.SYSTEM_ERROR.getMessage());
		HttpAjaxUtils.sendAjaxResponse(request, response, ajaxResult);
		return new ModelAndView();
    }else{
    	 return new ModelAndView("../500");
    }
  }

}
