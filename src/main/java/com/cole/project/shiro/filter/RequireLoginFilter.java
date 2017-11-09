package com.cole.project.shiro.filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.web.filter.authc.UserFilter;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cole.web.bean.AjaxResult;
import com.cole.web.util.HttpAjaxUtils;
import com.cole.web.util.PromptMessage;

public class RequireLoginFilter extends UserFilter {
	private static final Logger logger = LoggerFactory.getLogger(RequireLoginFilter.class);

	@Override
	protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
		logger.info("onAccessDenied begin-->" + WebUtils.toHttp(request).getRequestURI());
		
		if(HttpAjaxUtils.isAjaxRequest(request)){
			AjaxResult ajaxResult=new AjaxResult();
			ajaxResult.setCode(PromptMessage.NOT_LOGIN.getCode());
			ajaxResult.setMsg(PromptMessage.NOT_LOGIN.getMessage());
			HttpAjaxUtils.sendAjaxResponse(request, response, ajaxResult);
		}
		WebUtils.issueRedirect(request, response, getLoginUrl(), null);
		logger.info("onAccessDenied end-->");
		return false;
	}
}
