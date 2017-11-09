package com.cole.project.web.service.authorization;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cole.bean.Page;
import com.cole.project.web.dao.authorization.LogsMapper;
import com.cole.project.web.entity.Logs;

@Service
@Transactional(value = "common")
public class LogsService {
	@Autowired
	private LogsMapper logsMapper;

	public void logRecord(Logs log) {
		logsMapper.insert(log);
	}

	@Transactional(value = "common", readOnly = true)
	public List<Logs> getDataList(Logs logs, Date startTime, Date endTime, Page page) {
		return logsMapper.getLogsListPage(logs, startTime, endTime, page);
	}
 
}
