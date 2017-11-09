package com.cole.project.web.controller.system;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.cole.web.util.PromptMessage;

import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;

@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String loginfirst(HttpServletRequest request, Model model) {
		logger.debug("loginfirst end...");
		Subject subject = SecurityUtils.getSubject();
		if (subject.isAuthenticated()) {
			subject.logout();
			logger.debug("loginfirst logout...");
			return "redirect:/logout";
		}
		logger.debug("loginfirst end...");

		// 显示错误信息
		showError(request, model);

		return "login";
	}

	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String index(HttpServletRequest request) {
		logger.debug("index ...");
		return "index";
	}

	/**
	 * 用户登录
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public String login(ServletRequest request, ServletResponse response,
			@RequestParam(FormAuthenticationFilter.DEFAULT_USERNAME_PARAM) String userName,
			@RequestParam(FormAuthenticationFilter.DEFAULT_PASSWORD_PARAM) String password, Model model) {
		logger.debug("login  begin...");
		Subject subject = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(userName, password);
		try {
			subject.login(token);

			if (subject.isAuthenticated()) {
				return "redirect:/index";
			}
		} catch (Exception e) {
			// request.setAttribute(authenticationFilter.getFailureKeyAttribute(),
			// e.getMessage());
		}

		// 显示错误信息
		showError(request, model);
		return "login";

	}

	private void showError(ServletRequest request, Model model) {
		HttpServletRequest req = (HttpServletRequest) request;
		String flag = req.getParameter(FormAuthenticationFilter.DEFAULT_ERROR_KEY_ATTRIBUTE_NAME);
		if (flag == null || "".equals(flag))
			flag = String.valueOf(req.getAttribute(FormAuthenticationFilter.DEFAULT_ERROR_KEY_ATTRIBUTE_NAME));
		if (flag == null || "".equals(flag))
			return;
		flag = flag.trim();
		for (PromptMessage s : PromptMessage.values()) {
			if (Integer.toString(s.getCode()).equals(flag)) {
				model.addAttribute("errormsg", s.getMessage());
				return;
			}
		}

	}

}
