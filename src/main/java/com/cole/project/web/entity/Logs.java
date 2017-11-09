package com.cole.project.web.entity;

import java.io.Serializable;
import java.util.Date;

public class Logs implements Serializable {
		

	private static final long serialVersionUID = 2540272953740599738L;

	private long id;
	private String username;
	private String ip;
	private String content;
	/**
	 * 日志类型 1、系统日志 2、操作日志
	 */
	private int type;
	private String url;
	private Date createtime;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

}
