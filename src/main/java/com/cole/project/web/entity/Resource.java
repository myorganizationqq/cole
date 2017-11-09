package com.cole.project.web.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;


public class Resource implements Serializable {

	private static final long serialVersionUID = 6411369294782124363L;
	// 唯一ID
	private long resid;
	// 栏目名称
	private String name;
	// url地址
	private String url;
	// 父ID
	private long parentid;
	// 操作
	private byte operate;
	// 层级
	private int layer;
	// 排序
	private String ord;
	// 是否显示菜单,1为菜单，0为不是菜单
	private byte display;
	// 默认显示图标的样式，特别是菜单前的图标效果
	private String iconclass;
	// 是否记录日志，0为不记录，1为记录
	private byte recordlog;
	// 目标地址，0非目标地址表示需要展示的页面是下一级或者下下一级栏目的地址，1为目标地址
	private int target;
	// 创建时间
	private Date createtime;
	// 描叙
	private String description;
	
	private List<Resource> childrens;

	public List<Resource> getChildrens() {
		return childrens;
	}

	public void setChildrens(List<Resource> childrens) {
		this.childrens = childrens;
	}

	public long getResid() {
		return resid;
	}

	public void setResid(long resid) {
		this.resid = resid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public long getParentid() {
		return parentid;
	}

	public void setParentid(long parentid) {
		this.parentid = parentid;
	}

	public byte getOperate() {
		return operate;
	}

	public void setOperate(byte operate) {
		this.operate = operate;
	}

	public int getLayer() {
		return layer;
	}

	public void setLayer(int layer) {
		this.layer = layer;
	}

	public String getOrd() {
		return ord;
	}

	public void setOrd(String ord) {
		this.ord = ord;
	}

	public byte getDisplay() {
		return display;
	}

	public void setDisplay(byte display) {
		this.display = display;
	}

	public byte getRecordlog() {
		return recordlog;
	}

	public void setRecordlog(byte recordlog) {
		this.recordlog = recordlog;
	}

	public int getTarget() {
		return target;
	}

	public void setTarget(int target) {
		this.target = target;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getIconclass() {
		return iconclass;
	}

	public void setIconclass(String iconclass) {
		this.iconclass = iconclass;
	}

}
