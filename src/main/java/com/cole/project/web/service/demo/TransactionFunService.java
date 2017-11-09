package com.cole.project.web.service.demo;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cole.project.web.dao.demo.TransactionFunMapper;
import com.cole.util.timecategories.TimePoints;
import com.cole.web.bean.AjaxResult;

@Service
@Transactional(value = "common")
public class TransactionFunService {

	@Autowired
	TransactionFunMapper transactionFunMapper;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public AjaxResult findTransactionFun(Date startTime, Date endTime) {
		AjaxResult ajaxResult = new AjaxResult();
		Map<String, Object> map = new HashMap<>();

		List<Date> categories = TimePoints.getTimePoints(startTime, endTime);
		Date[] date = TimePoints.ceilDates(startTime, endTime);

		List<Map> series = transactionFunMapper.findTransactionFun(date[0], date[1]);

		map.put("categories", categories);
		map.put("series", series);

		ajaxResult.setCode(0);
		ajaxResult.setData(map);
		return ajaxResult;

	}
}
