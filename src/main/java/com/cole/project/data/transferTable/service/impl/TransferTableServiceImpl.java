package com.cole.project.data.transferTable.service.impl;

import com.cole.project.data.transferTable.dao.TransferTableDao;
import com.cole.project.data.transferTable.model.TransferTableEntity;
import com.cole.project.data.transferTable.service.TransferTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by JiangFeng
 * on 2017/11/10.
 */
@Service("transferTableService")
public class TransferTableServiceImpl implements TransferTableService {
    @Autowired
    private TransferTableDao transferTableDao;
    @Override
    public List<TransferTableEntity> getList(Map params) {
        return transferTableDao.getList(params);
    }
}
