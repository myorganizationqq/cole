package com.cole.project.shiro.filter;

public interface PreventCracking {
	public void countFail(String username);

	public void clearCount(String username);
}
