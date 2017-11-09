/*
package com.test;

import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.cole.bean.Page;
import com.cole.project.web.dao.demo.DynamicSqlMapper;
import com.cole.project.web.entity.Logs;
import com.cole.project.web.service.authorization.LogsService;
import com.cole.project.web.service.authorization.ResourceService;
import com.cole.project.web.service.authorization.UserService;
import com.cole.project.web.service.demo.DynamicSqlService;
import com.cole.project.web.service.demo.TransactionFunService;
import com.cole.util.StringUtils;
import com.cole.util.timecategories.TimePoints;
import com.cole.web.bean.AjaxResult;

//首先指定Junit的Runner
@RunWith(SpringJUnit4ClassRunner.class)
// 指明配置文件所在
@ContextConfiguration(locations = "classpath:config/application.xml")
// 指定事务管理器
@Transactional(value = "commonTransactionManager")
// 继承AbstractTransactionalJUnit4SpringContextTests来获取Spring上下文环境来获取Bean
public class PrivilegeTest extends AbstractTransactionalJUnit4SpringContextTests {

	// @Autowired
	// PrivilegeManagementController privilegeManagementController;
	@Autowired
	ResourceService resourceService;

	@Autowired
	TransactionFunService transactionFunService;
	@Autowired
	DynamicSqlService dynamicSqlService;
	@Autowired
	UserService userService;
	@Autowired
	LogsService logsService;


	// JUnit注解 ，表明这是一个需要运行的测试方法
	@Test
	public void test0(){
		logsService.getDataList(new Logs(), null, null, new Page());
	}

	@Test
	public void test() {
		// AjaxResult ajaxResult=AjaxResult.getFailResult();
		// System.out.println(ajaxResult.toJsonString());
		// resourceService.findAllResource();
		Date startTime = new Date(2017 - 1900, 01, 14, 17, 00, 0);
		Date endTime = new Date(2017 - 1900, 01, 14, 18, 00, 00);
		// AjaxResult ajaxResult =
		// transactionFunService.findTransactionFun(startTime,endTime);

		AjaxResult ajaxResult = dynamicSqlService.findAllDataListPage("Redis GET", startTime, endTime);
		System.out.println(ajaxResult.toJsonString());

		List<Date> categories = TimePoints.getTimePoints(startTime, endTime);
		System.out.println(categories.toString());

	}

	@Test
	public void test1() {
		// AjaxResult ajaxResult=AjaxResult.getFailResult();
		// System.out.println(ajaxResult.toJsonString());
		// resourceService.findAllResource();
		Date startTime = new Date(2017 - 1900, 01, 14, 17, 00, 0);
		Date endTime = new Date(2017 - 1900, 01, 14, 18, 00, 00);
		// AjaxResult ajaxResult =
		// transactionFunService.findTransactionFun(startTime,endTime);

		AjaxResult ajaxResult = dynamicSqlService.findAllData("Redis GET", startTime, endTime);
		System.out.println(ajaxResult.toJsonString());

		List<Date> categories = TimePoints.getTimePoints(startTime, endTime);
		System.out.println(categories.toString());

	}

}
*/
