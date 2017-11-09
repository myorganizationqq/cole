package com.cole.project.shiro.realm;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.DisabledAccountException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cole.project.web.entity.User;
import com.cole.project.web.service.authorization.ResourceService;
import com.cole.project.web.service.authorization.RoleService;
import com.cole.project.web.service.authorization.UserService;

public class ShiroDbRealm extends AuthorizingRealm {

	private static final Logger log = LoggerFactory.getLogger(ShiroDbRealm.class);

	
	RoleService roleService;
	UserService userService;
	ResourceService resourceService;

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		if (log.isDebugEnabled()) {
			log.debug("doGetAuthorizationInfo begin...");
		}
		// 获取用户帐号
		String username = (String) principals.getPrimaryPrincipal();
		SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
		// 通过用户帐号获取用户信息
		User user = userService.findUserByUsername(username);
		if (user != null) {
			// 获取角色信息添加进权限认证
			simpleAuthorizationInfo.addRoles(roleService.findRolesByUid(user.getUid()));
			// 获取权限资源信息添加进权限认证
			simpleAuthorizationInfo.addStringPermissions(resourceService.findVisitUrlByUid(user.getUid()));
		}
		if (log.isDebugEnabled()) {
			log.debug("doGetAuthorizationInfo end...");
		}
		return simpleAuthorizationInfo;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		if (log.isDebugEnabled()) {
			log.debug("doGetAuthenticationInfo begin...");
		}
		// 获取传入的帐号密码参数
		String username = (String) token.getPrincipal();
		String password = "";
		if (token.getCredentials() != null) {
			password = new String((char[]) token.getCredentials());
		}
		// 验证数据库中是否存在
		User user = null;
		try {
			user = userService.login(username, password);
		} catch (Exception e) {
			log.error("login error", e);
			throw new AuthenticationException("user.unknown.error");
		}
		// 帐号不存在
		if (user == null)
			throw new UnknownAccountException("UnknownAccount");
		if (user.getUserstatus() == 2)
			throw new LockedAccountException("LockedAccount");
		if (user.getUserstatus() == 1)
			throw new DisabledAccountException("DisabledAccount");

		// 验证成功
		SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(user.getUsername(), password.toCharArray(),
				getName());
		if (log.isDebugEnabled()) {
			log.debug("doGetAuthenticationInfo end...");
		}
		return info;
	}

	public void setRoleService(RoleService roleService) {
		this.roleService = roleService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public void setResourceService(ResourceService resourceService) {
		this.resourceService = resourceService;
	}
	
	

}
