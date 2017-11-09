package com.cole.project.shiro.filter;

import java.util.Date;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.DisabledAccountException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cole.project.web.entity.Logs;
import com.cole.project.web.service.authorization.LogsService;
import com.cole.web.bean.AjaxResult;
import com.cole.web.util.HttpAjaxUtils;
import com.cole.web.util.HttpUtils;
import com.cole.web.util.PromptMessage;

public class LoginFormAuthenticationFilter extends FormAuthenticationFilter {
	private static final Logger logger = LoggerFactory.getLogger(LoginFormAuthenticationFilter.class);

	private KickUser kickUser;
	private PreventCracking preventCracking;
	private LogsService logsService;

	public LoginFormAuthenticationFilter() {
		super();
	}

	@Override
	public boolean onPreHandle(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {
		logger.info("onPreHandle begin");
		Subject subject = getSubject(request, response);
		if (subject == null) {
			logger.info("onPreHandle subject is null");
			return false;
		}
		String username = (String) subject.getPrincipal();
		if (username == null) {
			if (HttpAjaxUtils.isAjaxRequest(request)) {
				AjaxResult ajaxResult = new AjaxResult();
				ajaxResult.setCode(PromptMessage.LOGIN_TIMEOUT.getCode());
				ajaxResult.setMsg(PromptMessage.LOGIN_TIMEOUT.getMessage());
				HttpAjaxUtils.sendAjaxResponse(request, response, ajaxResult);
				logger.info("onPreHandle is json");
				return true;
			}
		}
		logger.info("onPreHandle end");
		return super.onPreHandle(request, response, mappedValue);
	}

	@Override
	protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request,
			ServletResponse response) throws Exception {
		logger.info("onLoginSuccess begin");
		subject.getSession().stop();
		subject.login(token);

		String username = (String) subject.getPrincipal();
		preventCracking.clearCount(username);

		kickUser.notifyUser(request, response);

		// 记录登录日志
		try {
			Logs log = new Logs();
			log.setUsername(username);
			log.setCreatetime(new Date());
			log.setIp(HttpUtils.getClientIp(WebUtils.toHttp(request)));
			log.setType(1);
			logsService.logRecord(log);
		} catch (Exception e) {
			e.printStackTrace();
		}

		// 若验证成功，跳转到首页
		WebUtils.issueRedirect(request, response, getSuccessUrl(), null, true, true);
		logger.info("onLoginSuccess end");
		return false;
	}

	@Override
	protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request,
			ServletResponse response) {
		logger.info("onLoginFailure begin");
		try {
			preventCracking.countFail((String) token.getPrincipal());
		} catch (Exception e1) {
			e.printStackTrace();
		}

		if (e instanceof DisabledAccountException) {
			request.setAttribute(getFailureKeyAttribute(), PromptMessage.DISABLED_USER.getCode());
		} else if(  e instanceof LockedAccountException) {
			request.setAttribute(getFailureKeyAttribute(), PromptMessage.LOCK_USER.getCode());			
		}else {
			request.setAttribute(getFailureKeyAttribute(), PromptMessage.INCORRECT_ACCOUNT_OR_PASSWORD.getCode());			
		}
		
		logger.info("onLoginFailure end");
		return true;
	}

	public void setKickUser(KickUser kickUser) {
		this.kickUser = kickUser;
	}

	public void setPreventCracking(PreventCracking preventCracking) {
		this.preventCracking = preventCracking;
	}

	public void setLogsService(LogsService logsService) {
		this.logsService = logsService;
	}
}
