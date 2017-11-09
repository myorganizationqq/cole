package com.cole.project.web.dao.authorization;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.cole.bean.Page;
import com.cole.project.web.entity.Logs;

@Repository
public interface LogsMapper {

	int insert(Logs record);

	List<Logs> getLogsListPage(@Param("log") Logs log, @Param("startTime") Date startTime, @Param("endTime") Date endTime,
			@Param("page") Page page);
}
