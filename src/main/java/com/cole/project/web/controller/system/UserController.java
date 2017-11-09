package com.cole.project.web.controller.system;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cole.bean.Page;
import com.cole.project.web.service.authorization.UserService;
import com.cole.util.StringUtils;
import com.cole.web.bean.AjaxResult;

@Controller
@RequestMapping("/sysmanage/user")
public class UserController {

	private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

	@Autowired
	UserService userService;

	@RequestMapping("")
	public String showUserPage() {
		return "sysmanage/user";
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/listdata", headers = "x-requested-with")
	@ResponseBody
	public AjaxResult listData(String username, String fullname, Long rid,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm") Date endTime,
			@RequestParam(defaultValue = "0") Integer curpage, @RequestParam(defaultValue = "20") Integer pagesize) {
		AjaxResult result = new AjaxResult();
		try {
			System.out.println("curpage:" + curpage + "-pagesize:" + pagesize);
			LOGGER.debug("curpage:" + curpage + "-pagesize:" + pagesize);

			Page page = new Page(curpage, pagesize);
			result.setPage(page);
			result.setCode(0);
			username = StringUtils.toSqlParam(username);
			fullname = StringUtils.toSqlParam(fullname);
			result.setData(userService.findUserListPage(username, fullname, startTime, endTime, rid, page));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return AjaxResult.getFailResult();
		}
		return result;
	}

}
