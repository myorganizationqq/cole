package com.cole.project.web.dao.authorization;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.cole.bean.Page;
import com.cole.project.web.entity.User; 

@Repository
public interface UserMapper {

	User findUserById(long uid);

	User findUserByUsername(String username);

	int enableUserByUid(long uid);

	int disableUserByUid(long uid);

	int lockUserByUsername(String username);

	int addUser(User user);

	int deleteUserByUid(long uid);

	int updateUserPasswordByUid(@Param("userpwd") String userpwd, @Param("updatetime") Date updatetime,
			@Param("uid") long uid);

	int updateUserByUid(User user);

	List<User> findUserListPage(@Param("username") String username, @Param("fullname") String fullname,
			@Param("startTime") Date startTime, @Param("endTime") Date endTime, @Param("rid") Long rid,
			@Param("page") Page page);

}
