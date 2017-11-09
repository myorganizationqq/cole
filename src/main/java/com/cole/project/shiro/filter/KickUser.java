package com.cole.project.shiro.filter;

import java.io.Serializable;
import java.util.Deque;
import java.util.LinkedList;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.DefaultSessionKey;
import org.apache.shiro.session.mgt.SessionManager;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
 
public class KickUser {
	private static final Logger LOGGER = LoggerFactory.getLogger(KickUser.class);

	private int maxSession = 1;
	private boolean kickBefore = true;
	private Cache<String, Deque<Serializable>> cache;
	private CacheManager cacheManager;
	private SessionManager sessionManager;
	private String cacheName = "defaultCache";

	public void init() {
		cache = cacheManager.getCache(cacheName);
	}

	@SuppressWarnings("unchecked")
	public void kickUser(String username) {
		if (username == null) {
			return;
		}
		Object d = cache.get(username);
		Deque<Serializable> deque = null;
		if (d != null && d instanceof Deque) {
			deque = (Deque<Serializable>) d;
		}

		if (deque == null) {
			return;
		}
		Session kickSession = null;
		for (Serializable serializable : deque) {
			try {
				kickSession = sessionManager.getSession(new DefaultSessionKey(serializable));
				if (kickSession != null) {
					// 设置会话的kickout属性表示踢出了
					kickSession.setAttribute("kickout2", true);
				}
			} catch (Exception e) {
				LOGGER.warn(e.getMessage(), e);
			}
		}
	}

	@SuppressWarnings("unchecked")
	protected void notifyUser(ServletRequest request, ServletResponse response) {
		Subject subject = SecurityUtils.getSubject();
		if (!subject.isAuthenticated() && subject.isRemembered()) {
			LOGGER.info("no authentication and remember return true");
			return;
		}

		Session session = subject.getSession();
		String username = (String)subject.getPrincipal();
		Serializable sessionId = session.getId();

		Deque<Serializable> deque = null;
		Object o = cache.get(username);
		if (o != null && o instanceof Deque) {
			deque = (Deque<Serializable>) o;
		}
		if (deque == null) {
			deque = new LinkedList<Serializable>();
		}

		if (!deque.contains(sessionId) && session.getAttribute("kickout") == null) {
			deque.push(sessionId);
		}

		if (deque.size() > maxSession) { // 删除一些无效的session
			try {
				DefaultWebSessionManager sm = (DefaultWebSessionManager) sessionManager;
				for (Object d : deque.toArray()) {
					if (!sm.isValid(new DefaultSessionKey((Serializable) d))) {
						deque.remove(d);
					}
				}
			} catch (Exception e) {
				LOGGER.warn(e.getMessage(), e);
			}
		}

		while (deque.size() > maxSession) {
			Serializable kickSessionId = null;
			if (kickBefore) { // 如果踢出前者
				kickSessionId = deque.removeLast();
			} else { // 否则踢出后者
				kickSessionId = deque.removeFirst();
			}
			LOGGER.debug("notice user kick out -> " + kickSessionId);
			try {
				Session kickSession = sessionManager.getSession(new DefaultSessionKey(kickSessionId));
				if (kickSession != null) {
					// 设置会话的kickout属性表示踢出了
					kickSession.setAttribute("kickout", true);
				}
			} catch (Exception e) { // ignore exception
				LOGGER.warn(e.getMessage(), e);
			}
		}

		cache.put(username, deque);
	}

	public int check(Session session) {
		if (session.getAttribute("kickout") != null) {
			LOGGER.debug(session.getId() + "-->kickout ");
			return 2;
		} else if (session.getAttribute("kickout2") != null) {
			LOGGER.debug(session.getId() + "-->kickout2 ");
			return 3;
		}
		return 0;
	}

	public void setMaxSession(int maxSession) {
		this.maxSession = maxSession;
	}

	public void setKickBefore(boolean kickBefore) {
		this.kickBefore = kickBefore;
	}

	public void setCacheManager(CacheManager cacheManager) {
		this.cacheManager = cacheManager;
	}

	public void setSessionManager(SessionManager sessionManager) {
		this.sessionManager = sessionManager;
	}

	public void setCacheName(String cacheName) {
		this.cacheName = cacheName;
	}

}