package com.cole.project.web.service.authorization;

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cole.project.web.dao.authorization.RoleMapper;
import com.cole.project.web.entity.Role;

@Service
@Transactional(value = "common")
public class RoleService {

	@Autowired
	RoleMapper roleMapper;

	public Set<String> findRolesByUid(long uid) {
		List<Role> list = roleMapper.findRolesByUid(uid);
		if (list != null && !list.isEmpty()) {
			Set<String> sets = new HashSet<String>();
			Iterator<Role> iterator = list.iterator();
			while (iterator.hasNext()) {
				sets.add(iterator.next().getRolecode());
			}
			return sets;
		}
		return null;
	}

	public List<Role> findAllRoles() {
		return roleMapper.findALLRoles();
	}

}
