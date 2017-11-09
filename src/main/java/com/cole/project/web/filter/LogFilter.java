package com.cole.project.web.filter;

import java.util.Date;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.cole.project.web.entity.Logs;
import com.cole.project.web.entity.Resource;
import com.cole.project.web.service.authorization.LogsService;
import com.cole.web.util.HttpUtils;

public class LogFilter extends HandlerInterceptorAdapter {
	private Logger logger = LoggerFactory.getLogger(LogFilter.class);

	@Autowired
	private LogsService logsService;

	/**
	 * 日志描述
	 *
	 * @param
	 * @param m
	 * @return
	 */
	@SuppressWarnings("unused")
	private String toDescp(String opString, Resource m) {
		String desc = (m == null || m.getDescription() == null || "".equals(m.getDescription())) ? m.getName()
				: m.getDescription();
		/*
		 * if (opString.indexOf("{menu}") != -1) { opString =
		 * opString.replace("{menu}", desc); } else { opString += desc; } return
		 * opString;
		 */
		return desc;
	}

	/**
	 * 操作URL
	 *
	 * @param request
	 * @return
	 */
	private String getOpContent(HttpServletRequest request) {
		StringBuffer re = new StringBuffer();
		re.append(request.getServletPath());
		Map<String, String[]> map = request.getParameterMap();
		if (map != null && !map.isEmpty()) {
			re.append("?");
			boolean first = true;
			boolean sub = true;
			String v = null;
			for (Entry<String, String[]> kv : map.entrySet()) {
				if (!first) {
					re.append("&");
				}
				first = false;
				if (kv.getValue() != null) {
					sub = true;
					v = "";
					for (String vv : kv.getValue()) {
						if (!sub) {
							v += ",";
						}
						v += vv;
					}
					re.append(kv.getKey() + "=" + v);
				}

			}
		}
		String r = "";
		if (re.length() > 128) {
			r = re.substring(0, 127);
		} else {
			r = re.toString();
		}
		return r;
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {

		if (ex != null) {
			logger.info("have exception no record log");
			return;
		}

		if (!"POST".equalsIgnoreCase(request.getMethod())) {
			return;
		}

		// 获取当前菜单
		Resource m = (Resource) request.getAttribute("current_resource");
		if (m == null || m.getRecordlog() != 1) {
			return;
		}

		String uri = WebUtils.getPathWithinApplication(request);
		if (uri.endsWith("/")) {
			uri = uri.substring(0, uri.length() - 1);
		}

		Subject subject = SecurityUtils.getSubject();
		if (subject == null) {
			return;
		}
		String username = (String) subject.getPrincipal();

		Logs opLog = new Logs();
		opLog.setContent((m.getDescription() == null || "".equals(m.getDescription())) ? "" : m.getDescription());
		opLog.setCreatetime(new Date());
		opLog.setIp(HttpUtils.getClientIp(request));
		opLog.setType(2);
		opLog.setUrl(getOpContent(request));
		opLog.setUsername(username);

		try {
			logsService.logRecord(opLog);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}