package com.cole.project.web.dao.demo;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionFunMapper {

	List<Map> findTransactionFun(@Param("startTime") Date start, @Param("endTime") Date end);
}
