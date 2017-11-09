package com.cole.project.shiro.filter;

import java.util.List;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.cole.project.web.entity.Resource;
import com.cole.project.web.entity.User;
import com.cole.project.web.service.authorization.ResourceService;
import com.cole.project.web.service.authorization.UserService;
import com.cole.web.bean.AjaxResult;
import com.cole.web.util.HttpAjaxUtils;
import com.cole.web.util.PromptMessage;

public class ResourceAccessFilter extends AccessControlFilter {

	private static final Logger logger = LoggerFactory.getLogger(ResourceAccessFilter.class);

	private ResourceService resourceService;
	private UserService userService;

	@Override
	protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue)
			throws Exception {
		logger.info("isAccessAllowed begin");
		HttpServletRequest req = WebUtils.toHttp(request);
		String url = getPathWithinApplication(WebUtils.toHttp(request));

		if (url.endsWith("/")) {
			url = url.substring(0, url.length() - 1);
		}
		Subject subject = getSubject(request, response);
		if (!subject.isAuthenticated()) {
			logger.info("isAccessAllowed subject no authenticated!!");
			WebUtils.issueRedirect(request, response, getLoginUrl(), null);
			return false;
		}
		logger.info("isAccessAllowed url:" + url);
		boolean isPermitted = subject.isPermitted(url);
		if (isPermitted == true) {
			logger.info("isAccessAllowed success");
			// 获取当前登录用户名
			String username = (String) subject.getPrincipal();
			User user = userService.findUserByUsername(username);
			Map<String, Object> ps = resourceService.findResourceByUid(user.getUid());
			// 获取当前用户的菜单权限
			@SuppressWarnings("unchecked")
			List<Resource> menu = (List<Resource>) ps.get("resource");
			@SuppressWarnings("unchecked")
			Map<String, Resource> urls = (Map<String, Resource>) ps.get("urls");

			req.setAttribute("menu_list", menu);
			// 获取当前选择的菜单id，方便前端切换选中状态
			Resource resource = urls.get(url);
			if (resource != null) {
				req.setAttribute("current_resource",resource);
				if (resource.getDisplay() == 0) {
					req.setAttribute("current_url", resource.getParentid());					
				} else {
					req.setAttribute("current_url", resource.getResid());
				}
			}
			return true;
		} else {
			 
			if (HttpAjaxUtils.isAjaxRequest(request)) {
				logger.info("isAccessAllowed fail json");
				 AjaxResult ajaxResult=new AjaxResult();
				 ajaxResult.setCode(PromptMessage.NOT_PERMISSION.getCode());
				 ajaxResult.setMsg(PromptMessage.NOT_PERMISSION.getMessage());
				 HttpAjaxUtils.sendAjaxResponse(request, response, ajaxResult);
			} else {
				logger.info("isAccessAllowed fail other");
				WebUtils.issueRedirect(request, response,  getLoginUrl(), null);
			}
		}
		return false;
	}

	@Override
	protected boolean onAccessDenied(ServletRequest arg0, ServletResponse arg1) throws Exception {
		return false;
	}

	@Autowired
	public void setResourceService(ResourceService resourceService) {
		this.resourceService = resourceService;
	}

	@Autowired
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

}
