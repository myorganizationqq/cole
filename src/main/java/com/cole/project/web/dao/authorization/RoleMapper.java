package com.cole.project.web.dao.authorization;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.cole.project.web.entity.Role;

@Repository
public interface RoleMapper {

	List<Role> findRolesByUid(long uid);
	
	List<Map<String, Object>> getRoleByResid(long resid);
	
	Role getRoleByRid(long rid);
	
	List<Role> findALLRoles();
	
	int insertRoleResource(Map<String, Long> params);
	
	int deleteRoleResource(long resid);
}
