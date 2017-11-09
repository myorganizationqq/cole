package com.cole.project.web.service.authorization;

import java.util.Date;
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.cole.bean.Page;
import com.cole.project.web.dao.authorization.UserMapper;
import com.cole.project.web.entity.User; 

@Service
@Transactional(value = "common")
public class UserService {
	@Autowired
	UserMapper userMapper;

	public User login(String username, String password) {
		// 空值判断
		if (StringUtils.isEmpty(username) || StringUtils.isEmpty(password))
			return null;
		// 数据库验证
		User user = userMapper.findUserByUsername(username);
		// 判断密码是否正确
		if (user != null && user.getUserpwd().equals(password))
			return user;

		return null;
	}

	public User findUserByUsername(String username) {
		// 空值判断
		if (StringUtils.isEmpty(username))
			return null;
		// 数据库验证
		User user = userMapper.findUserByUsername(username);
		return user;
	}

	public int lockUserByUsername(String username) {
		return userMapper.lockUserByUsername(username);
	}

	public List<User> findUserListPage(String username, String fullname, Date startTime, Date endTime, Long rid,
			Page page) {
		return userMapper.findUserListPage(username, fullname, startTime, endTime, rid, page);
	}
}
