package com.cole.project.data.transferTable.dao;

import com.cole.project.data.transferTable.entity.TransferTableEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by JiangFeng
 * on 2017/11/10.
 */
@Repository("transferTableDao")
public interface TransferTableDao {
    List<TransferTableEntity> getList(Map params);
}
