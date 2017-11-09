package com.cole.project.web.entity;

import java.io.Serializable;
import java.util.Date;
/**
 * 用户信息实体
 * @author cole
 *
 */
public class User implements Serializable {

	private static final long serialVersionUID = -601286090192161567L;

	// 用户唯一编号
	private long uid;
	// 用户名(4~14字符)
	private String username;
	// 用户密码（6~）
	private String userpwd;
	//全名
	private String fullname;
	// 安全码
	private String seccode;
	// 用户头像
	private String usericon;
	// 性别 0保密1男2女
	private byte gender;
	// 手机号码
	private String mobile;
	// 邮箱
	private String email;
	// 微信Id
	private String weixinid;
	// 0、用户可用 1、用户禁用(手动设置) 2、用户锁定(非法登录) 3、用户删除
	private byte userstatus;
	// 访问次数
	private int visitcount;
	// 上次访问时间
	private Date lastvisit;
	// 注册时间
	private Date regtime;
	// 修改用户信息基本信息,初次和注册时间相等
	private Date updatetime;

	public long getUid() {
		return uid;
	}

	public void setUid(long uid) {
		this.uid = uid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUserpwd() {
		return userpwd;
	}

	public void setUserpwd(String userpwd) {
		this.userpwd = userpwd;
	}

	public String getSeccode() {
		return seccode;
	}

	public void setSeccode(String seccode) {
		this.seccode = seccode;
	}

	public String getUsericon() {
		return usericon;
	}

	public void setUsericon(String usericon) {
		this.usericon = usericon;
	}

	public byte getGender() {
		return gender;
	}

	public void setGender(byte gender) {
		this.gender = gender;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getWeixinid() {
		return weixinid;
	}

	public void setWeixinid(String weixinid) {
		this.weixinid = weixinid;
	}

	public byte getUserstatus() {
		return userstatus;
	}

	public void setUserstatus(byte userstatus) {
		this.userstatus = userstatus;
	}

	public int getVisitcount() {
		return visitcount;
	}

	public void setVisitcount(int visitcount) {
		this.visitcount = visitcount;
	}

	public Date getLastvisit() {
		return lastvisit;
	}

	public void setLastvisit(Date lastvisit) {
		this.lastvisit = lastvisit;
	}

	public Date getRegtime() {
		return regtime;
	}

	public void setRegtime(Date regtime) {
		this.regtime = regtime;
	}

	public Date getUpdatetime() {
		return updatetime;
	}

	public void setUpdatetime(Date updatetime) {
		this.updatetime = updatetime;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

}
