package com.cole.project.web.controller.demo;
 
import java.util.Date;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller; 
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cole.project.web.service.demo.TransactionFunService;
import com.cole.web.bean.AjaxResult;
import redis.clients.jedis.Jedis;

@Controller
public class TestController {

	@Autowired
	TransactionFunService TransactionFunService;

	@RequestMapping(value = "/test0102")
	public String test0102() {
		return "test0102";
	}

	@RequestMapping(value = "/test103")
	public String test103() {
		return "test103";
	}

	@RequestMapping(value = "/test103/list")
	@ResponseBody
	public AjaxResult test103list(@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm") Date endTime) {
		return TransactionFunService.findTransactionFun(startTime, endTime);
	}

	public static void main(String[] args) {
		Jedis j = new Jedis("104.225.152.150",6379);
		j.append("a","abc");
	}

}
