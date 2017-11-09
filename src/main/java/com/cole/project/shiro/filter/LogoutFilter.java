package com.cole.project.shiro.filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogoutFilter extends org.apache.shiro.web.filter.authc.LogoutFilter {

	private static final Logger logger = LoggerFactory.getLogger(LogoutFilter.class);

	@Override
	protected void issueRedirect(ServletRequest request, ServletResponse response, String redirectUrl)
			throws Exception {
		logger.info("issueRedirect begin...");
		String context = "";
		if (context == null || context.trim().equals("")) {
			context = request.getServletContext().getContextPath();
		}
		if (context.endsWith("/")) {
			context = context.substring(0, context.length() - 1);
		}
		if (redirectUrl == null) {
			redirectUrl = "";
		}
		if (!redirectUrl.startsWith("/")) {
			redirectUrl += "/";
		}

		redirectUrl = context + redirectUrl; 

		 
		WebUtils.issueRedirect(request, response, redirectUrl, null, false);
		logger.info("issueRedirect end...");
	}
}
