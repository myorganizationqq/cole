package com.cole.project.web.controller.system;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cole.project.web.entity.Resource;
import com.cole.project.web.entity.Role;
import com.cole.project.web.service.authorization.ResourceService;
import com.cole.project.web.service.authorization.RoleService;

@Controller
@RequestMapping("/privilege")
public class PrivileController {
	private static final Logger logger = LoggerFactory.getLogger(PrivileController.class);

	@Autowired
	ResourceService resourceService;
	@Autowired
	RoleService roleService;

	@RequestMapping(method = RequestMethod.GET)
	public String show() {
		return "privilege/manager";
	}

	@RequestMapping(value = "/insertResource", headers = "x-requested-with")
	@ResponseBody
	public Map<Object, Object> insert(@Validated Resource resource, BindingResult result,
			@RequestParam(required = true) String roles) throws Exception {
		if (logger.isDebugEnabled()) {
			logger.debug("insert resource");
		}
		List<Long> ids = new ArrayList<Long>();
		for (String id : roles.split(",")) {
			if (id != null && !"".equals(id))
				ids.add(Long.parseLong(id));
		}
		resource.setCreatetime(new Date());
		resourceService.insertResource(resource, ids);
		Map<Object, Object> resp = new HashMap<Object, Object>();
		resp.put("code", 0);
		return resp;
	}

	@RequestMapping(value = "/all", headers = "x-requested-with")
	@ResponseBody
	public List<Map<Object, Object>> data() {
		return resourceService.findAllResource();
	}

	@RequestMapping(value = "/updateResource", headers = "x-requested-with")
	@ResponseBody
	public Map<Object, Object> update(@Validated Resource resource, BindingResult result,
			@RequestParam(required = true) String roles) throws Exception {
		resourceService.updateResource(resource, roles);
		Map<Object, Object> resp = new HashMap<Object, Object>();
		resp.put("code", 0);
		return resp;
	}

	@RequestMapping(value = "/deleteResource", headers = "x-requested-with")
	@ResponseBody
	public Map<Object, Object> delete(@RequestParam(required = true) Long resid) {
		resourceService.deleteResource(resid);
		Map<Object, Object> resp = new HashMap<Object, Object>();
		resp.put("code", 0);

		return resp;
	}

	@RequestMapping(value = "/getRoleData", headers = "x-requested-with")
	@ResponseBody
	public List<Map<Object, Object>> getRoleData() {
		List<Map<Object, Object>> map = new ArrayList<Map<Object, Object>>();
		List<Role> roles = roleService.findAllRoles();
		if (roles != null) {
			for (Role role : roles) {
				Map<Object, Object> r = new HashMap<Object, Object>();
				r.put("rid", role.getRid());
				r.put("name", role.getName());
				r.put("parent", null);
				map.add(r);
			}
		}

		return map;
	}
}
