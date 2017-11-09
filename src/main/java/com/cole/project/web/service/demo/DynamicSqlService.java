package com.cole.project.web.service.demo;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cole.bean.Page;
import com.cole.project.web.dao.demo.DynamicSqlMapper;
import com.cole.util.timecategories.TimePoints;
import com.cole.web.bean.AjaxResult;
 
@Service
public class DynamicSqlService {

	@Autowired
	DynamicSqlMapper dynamicSqlMapper;
	
	public AjaxResult findAllData(String funcname,Date startTime, Date endTime){
		AjaxResult ajaxResult = new AjaxResult();
		Map<String, Object> map = new HashMap<>();

		List<Date> categories = TimePoints.getTimePoints(startTime, endTime);
		Date[] date = TimePoints.ceilDates(startTime, endTime);

		Map<String, Object> sqlMap = new HashMap<>();
		sqlMap.put("sqlDynamicStatement", "select"
				+ "			stat_begin_tm as 'time',"
				+ "       	round((sum(execute_time)/sum(execute_num)),2) as 'y',"
				+ "        	sum(execute_num) as 'total',"
				+ "        	max(execute_time_max) as 'max',"
				+ "        	min(execute_time_min) as 'min'"
				+ "        from application_transaction_func_stat_minute   "
				+ "          where"
				+ "        	stat_begin_tm >= #{startTime}  "
				+ "            and stat_begin_tm < #{endTime}  "
				+ "            and funcname = #{funcname}"
				+ "        group by stat_begin_tm"
				+ "        order by stat_begin_tm asc");
		sqlMap.put("funcname", funcname);
		sqlMap.put("startTime", date[0]);
		sqlMap.put("endTime", date[1]);
		List<Map> series = dynamicSqlMapper.executeSelectSql(sqlMap);

		map.put("categories", categories);
		map.put("series", series);

		ajaxResult.setCode(0);
		ajaxResult.setData(map);
		return ajaxResult;
	}
	
	
	public AjaxResult findAllDataListPage(String funcname,Date startTime, Date endTime){
		AjaxResult ajaxResult = new AjaxResult();
		Map<String, Object> map = new HashMap<>();

		List<Date> categories = TimePoints.getTimePoints(startTime, endTime);
		Date[] date = TimePoints.ceilDates(startTime, endTime);
		Page page = new Page(0, 20); 
		ajaxResult.setPage(page);
		Map<String, Object> sqlMap = new HashMap<>();
		sqlMap.put("sqlDynamicStatement", "select"
				+ "			stat_begin_tm as 'time',"
				+ "       	round((sum(execute_time)/sum(execute_num)),2) as 'y',"
				+ "        	sum(execute_num) as 'total',"
				+ "        	max(execute_time_max) as 'max',"
				+ "        	min(execute_time_min) as 'min'"
				+ "        from application_transaction_func_stat_minute   "
				+ "          where"
				+ "        	stat_begin_tm >= #{startTime}  "
				+ "            and stat_begin_tm < #{endTime}  "
				+ "            and funcname = #{funcname}"
				+ "        group by stat_begin_tm"
				+ "        order by stat_begin_tm asc");
		sqlMap.put("funcname", funcname);
		sqlMap.put("page", page);
		sqlMap.put("startTime", date[0]);
		sqlMap.put("endTime", date[1]);
		
		List<Map> series = dynamicSqlMapper.executeSelectListPage(sqlMap);

		map.put("categories", categories);
		map.put("series", series);

		ajaxResult.setCode(0);
		ajaxResult.setData(map);
		return ajaxResult;
	}
}
