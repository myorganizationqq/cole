package com.cole.project.shiro.filter;

import org.apache.shiro.cache.CacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cole.project.web.service.authorization.UserService;

public class PreventCrackingByEhCache implements PreventCracking {
	private static final Logger LOGGER = LoggerFactory.getLogger(PreventCrackingByEhCache.class);

	private CacheManager cacheManager;
	private int failureCount;
	private String cacheName;
	private UserService userService;

	public void countFail(String username) {

		Integer count = (Integer) cacheManager.getCache(cacheName).get(username);

		if (count == null || count == 0)
			count = 1;
		LOGGER.debug("{} failure time:{}", username, count);
		if (count >= failureCount) {
			try {
				userService.lockUserByUsername(username);
				cacheManager.getCache(cacheName).put(username, 0);
			} catch (Exception e2) {
			}
		} else {
			cacheManager.getCache(cacheName).put(username, count + 1);
		}
	}

	public void clearCount(String username) {
		cacheManager.getCache(cacheName).put(username, 0);
	}

	public void setCacheManager(CacheManager cacheManager) {
		this.cacheManager = cacheManager;
	}

	public void setFailureCount(int failureCount) {
		this.failureCount = failureCount;
	}

	public void setCacheName(String cacheName) {
		this.cacheName = cacheName;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

}
