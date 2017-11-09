package com.cole.project.web.dao.demo;

import java.util.List;
import java.util.Map;
 
import org.springframework.stereotype.Repository; 

@Repository
public interface DynamicSqlMapper {

	/**
	 * 执行动态sql
	 * @param map
	 * @return
	 */
	List<Map> executeSelectSql(Map map);
	
	/**
	 * 执行动态sql
	 * @param map
	 * @return
	 */
	List<Map> executeSelectListPage(Map map);
}
