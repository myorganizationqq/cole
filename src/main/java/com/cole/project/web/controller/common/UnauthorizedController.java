package com.cole.project.web.controller.common;
 
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cole.web.util.XssUtils;

import javax.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/**
 * 未授权控制类
 */
@Controller
public class UnauthorizedController {

	@RequestMapping("/unauthorized")
	public String page(HttpServletRequest request, String msg, Model model) throws UnsupportedEncodingException {

		if (msg != null && !"".equals(msg.trim())) {
			model.addAttribute("unauth_msg", XssUtils.encode(URLDecoder.decode(msg,"UTF-8")));
		} else {
			model.addAttribute("unauth_msg", "你没有此页面访问权限");
		}

		return "../unauthorized";
	}

}
