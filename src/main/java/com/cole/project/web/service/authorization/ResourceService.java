package com.cole.project.web.service.authorization;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.cole.project.web.dao.authorization.ResourceMapper;
import com.cole.project.web.dao.authorization.RoleMapper;
import com.cole.project.web.entity.Resource;
import com.cole.project.web.entity.Role;

@Service
@Transactional(value = "common")
public class ResourceService {

	@Autowired
	ResourceMapper resourceMapper;
	@Autowired
	RoleMapper roleMapper;

	/**
	 * 根据uid查找有权限的url
	 * 
	 * @param uid
	 * @return
	 */
	public Set<String> findVisitUrlByUid(long uid) {
		List<Resource> list = resourceMapper.findResourceByUid(uid);
		if (list != null && !list.isEmpty()) {
			Set<String> sets = new HashSet<String>();
			Iterator<Resource> iterator = list.iterator();
			while (iterator.hasNext()) {
				sets.add(iterator.next().getUrl());
			}
			return sets;
		}
		return null;
	}

	/**
	 * 根据uid查找有权限的资源
	 * 
	 * @param uid
	 * @return
	 */
	public Map<String, Object> findResourceByUid(long uid) {
		List<Resource> rootMenu = resourceMapper.findResourceByUid(uid);
		List<Resource> menuList = new ArrayList<Resource>();
		Map<String, Resource> urls = new HashMap<String, Resource>();
		// 先找到所有的一级菜单
		for (int i = 0; i < rootMenu.size(); i++) {
			// 一级菜单没有parentId
			if (rootMenu.get(i).getParentid() == 0) {
				menuList.add(rootMenu.get(i));
			}
			urls.put(rootMenu.get(i).getUrl(), rootMenu.get(i));
		}
		// 为一级菜单设置子菜单，getChild是递归调用的
		for (Resource menu : menuList) {
			menu.setChildrens(getChild(menu.getResid(), rootMenu));
		}
		Map<String, Object> ps = new HashMap<String, Object>();
		ps.put("resource", menuList);
		ps.put("urls", urls);
		return ps;
	}

	/**
	 * 递归获取子菜单
	 * 
	 * @param id
	 * @param rootMenu
	 * @return
	 */
	private List<Resource> getChild(long id, List<Resource> rootMenu) {
		// 子菜单
		List<Resource> childList = new ArrayList<>();
		for (Resource menu : rootMenu) {
			// 遍历所有节点，将父菜单id与传过来的id比较
			if (menu.getParentid() != 0) {
				if (menu.getParentid() == id) {
					childList.add(menu);
				}
			}
		}
		// 递归退出条件
		if (childList.size() == 0) {
			return null;
		} else {
			// 把子菜单的子菜单再循环一遍
			for (Resource menu : childList) {
				// 递归
				menu.setChildrens(getChild(menu.getResid(), rootMenu));
			}
			return childList;
		}
	}

	/**
	 * 插入资源及角色对应关系
	 * 
	 * @param resource
	 * @param rids
	 * @throws Exception
	 */
	@Transactional(value = "common", readOnly = false, propagation = Propagation.REQUIRED)
	public void insertResource(Resource resource, List<Long> rids) throws Exception {
		resourceMapper.insertResource(resource);
		for (long rostr : rids) {
			Map<String, Long> params = new HashMap<String, Long>();
			params.put("resid", resource.getResid());
			params.put("rid", rostr);
			roleMapper.insertRoleResource(params);
		}
	}

	/**
	 * 获取所有的资源
	 * 
	 * @return
	 */
	public List<Map<Object, Object>> findAllResource() {
		List<Map<Object, Object>> datas = new ArrayList<Map<Object, Object>>();
		List<Resource> ps = resourceMapper.findALLResource();
		if (ps != null && !ps.isEmpty()) {
			Map<Long, Resource> idps = new HashMap<Long, Resource>();
			for (Resource resource : ps) {
				idps.put(resource.getResid(), resource);
			}
			for (Resource resource : ps) {
				Map<Object, Object> p = new HashMap<Object, Object>();
				p.put("resid", resource.getResid());
				p.put("name", resource.getName());
				p.put("url", resource.getUrl());
				p.put("parentid", resource.getParentid());
				p.put("iconclass", resource.getIconclass());
				p.put("operate", resource.getOperate());
				p.put("layer", resource.getLayer());
				p.put("ord", resource.getOrd());
				p.put("display", resource.getDisplay());
				p.put("recordlog", resource.getRecordlog());
				p.put("target", resource.getTarget());
				p.put("description", resource.getDescription());

				// 获取此资源所属的角色
				List<Map<String, Object>> rs = roleMapper.getRoleByResid(resource.getResid());
				StringBuffer sb = new StringBuffer();
				if (rs != null && !rs.isEmpty()) {
					for (Map<String, Object> role : rs) {
						sb.append(",");
						sb.append(role.get("rid"));
						sb.append(":");
						sb.append(role.get("name"));
					}
				}

				if (sb.toString().startsWith(",")) {
					sb.deleteCharAt(0);
				}

				p.put("roles", sb.toString());
				datas.add(p);
			}
		}
		return datas;
	}

	@Transactional(value = "common", readOnly = false, propagation = Propagation.REQUIRED)
	public void deleteResource(Long resid) {
		roleMapper.deleteRoleResource(resid);
		resourceMapper.deleteResourceByResid(resid);
	}

	@Transactional(value = "common", readOnly = false, propagation = Propagation.REQUIRED)
	public void updateResource(Resource resource, String roles) {

		roleMapper.deleteRoleResource(resource.getResid());
		String[] ro = null;
		for (String name : roles.split(",")) {
			ro = name.split(":");
			Role role = roleMapper.getRoleByRid(Long.parseLong(ro[0]));
			if (role != null) {
				Map<String, Long> params = new HashMap<String, Long>();
				params.put("resid", resource.getResid());
				params.put("rid", role.getRid());
				roleMapper.insertRoleResource(params);
			}
		}
		resourceMapper.updateResourceByResid(resource);
	}
}
