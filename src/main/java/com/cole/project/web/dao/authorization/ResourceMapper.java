package com.cole.project.web.dao.authorization;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.cole.project.web.entity.Resource;

@Repository
public interface ResourceMapper {

	List<Resource> findResourceByUid(long uid);
	
	List<Resource> findALLResource();
	
	int insertResource(Resource resource);
	
	int updateResourceByResid(Resource resource);
	
	int deleteResourceByResid(long resid);
	
}
