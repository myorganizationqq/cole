package com.cole.project.data.transferTable.service;

import com.cole.project.data.transferTable.model.TransferTableEntity;

import java.util.List;
import java.util.Map;

/**
 * Created by JiangFeng
 * on 2017/11/10.
 */
public interface TransferTableService {
    List<TransferTableEntity> getList(Map params);
}
