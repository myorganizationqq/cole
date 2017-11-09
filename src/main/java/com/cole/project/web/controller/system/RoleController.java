package com.cole.project.web.controller.system;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cole.project.web.service.authorization.RoleService;
import com.cole.web.bean.AjaxResult;
 
@Controller
@RequestMapping("/sysmanage/role")
public class RoleController {

	private static final Logger LOGGER = LoggerFactory.getLogger(RoleController.class);
	
	@Autowired
	RoleService roleService;
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/listdata", headers = "x-requested-with")
	@ResponseBody
	public AjaxResult listData() {
		AjaxResult result = new AjaxResult();
		
		try {
			result.setData(roleService.findAllRoles());
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return AjaxResult.getFailResult();
		}
		return result;
	}
}
