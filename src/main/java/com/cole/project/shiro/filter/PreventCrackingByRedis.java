package com.cole.project.shiro.filter;

 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cole.cache.CacheManager;
 

public class PreventCrackingByRedis  implements PreventCracking {
	  private static final Logger LOGGER = LoggerFactory.getLogger(PreventCrackingByRedis.class);

	  private CacheManager cacheManager;
	  private int failureCount;
	  private String cacheName;

	  private long expreTime;


	  public void countFail(String username) {

	    String countStr = (String) cacheManager.getCache(cacheName).get(username);
	    int count = 0;
	    if (countStr != null) {
	      try {
	        count = Integer.parseInt(countStr);
	      } catch (Exception e) {
	        LOGGER.warn(e.getMessage(), e);
	      }
	    }
	    String flag = (String) cacheManager.getCache(cacheName).get(username + "_ACCOUNT_$DISABLE");
	    if (flag != null && "true".equalsIgnoreCase(flag)) {
	      return;
	    }
	    count++;
	    if (count >= failureCount) {
	      try {

	        cacheManager.getCache(cacheName).set(username + "_ACCOUNT_$DISABLE", "true", expreTime);

	      } catch (Exception e2) {
	        LOGGER.warn(e2.getMessage(), e2);
	      }
	    } else {
	      if (LOGGER.isDebugEnabled()) {
	        LOGGER.debug("failure time:" + count);
	      }
	      cacheManager.getCache(cacheName).set(username, count + "", expreTime);
	    }
	  }

	  public void clearCount(String username) {
	    cacheManager.getCache(cacheName).set(username, "0", expreTime);
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

	  public void setExpreTime(long expreTime) {
	    this.expreTime = expreTime;
	  }


	}
