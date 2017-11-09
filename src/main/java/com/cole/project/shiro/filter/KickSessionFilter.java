package com.cole.project.shiro.filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cole.web.bean.AjaxResult;
import com.cole.web.util.HttpAjaxUtils;
import com.cole.web.util.PromptMessage;

public class KickSessionFilter extends AccessControlFilter {
	private static final Logger LOGGER = LoggerFactory.getLogger(KickSessionFilter.class);

	private KickUser kickUser;

	private LoginFormAuthenticationFilter loginFormAuthenticationFilter;

	@Override
	protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue)
			throws Exception {
		return false;
	}

	@Override
	protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
		Subject subject = SecurityUtils.getSubject();
		if (!subject.isAuthenticated() && subject.isRemembered()) {
			LOGGER.info("no authentication and remember return true");
			return false;
		}
		int flag = kickUser.check(subject.getSession());

		if (flag != 0) {
			// 会话被踢出了
			try {
				subject.logout();
			} catch (Exception e) { // ignore
				LOGGER.error(e.getMessage(), e);
			}
			if (HttpAjaxUtils.isAjaxRequest(request)) {
				LOGGER.info("isAccessAllowed fail json");
				
				AjaxResult ajaxResult = new AjaxResult();
				ajaxResult.setCode(PromptMessage.NOT_LOGIN.getCode());
				ajaxResult.setMsg(PromptMessage.NOT_LOGIN.getMessage());
				if (flag == 2) {
					ajaxResult.setCode(PromptMessage.KICK_USER.getCode());
					ajaxResult.setMsg(PromptMessage.KICK_USER.getMessage());
				} else {
					ajaxResult.setCode(PromptMessage.MODIFY_USER_INFORMATION.getCode());
					ajaxResult.setMsg(PromptMessage.MODIFY_USER_INFORMATION.getMessage());
				}
				HttpAjaxUtils.sendAjaxResponse(request, response, ajaxResult);
				
				return false;
			}

			String url = loginFormAuthenticationFilter.getLoginUrl();

			url += "?shiroLoginFailure=" + flag;
			WebUtils.issueRedirect(request, response, url, null);
			return false;
		}

		return true;
	}

	public void setKickUser(KickUser kickUser) {
		this.kickUser = kickUser;
	}

	public void setLoginFormAuthenticationFilter(LoginFormAuthenticationFilter loginFormAuthenticationFilter) {
		this.loginFormAuthenticationFilter = loginFormAuthenticationFilter;
	}

}
