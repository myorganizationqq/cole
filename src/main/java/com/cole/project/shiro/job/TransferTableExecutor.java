package com.cole.project.shiro.job;

import com.cole.project.data.common.Oracle2Mysql;
import com.cole.project.data.transferTable.model.TransferTableEntity;
import com.cole.project.data.transferTable.service.impl.TransferTableServiceImpl;
import com.cole.project.web.util.DateUtils;
import org.springframework.context.ApplicationContext;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author JiangFeng
 * @date 2017/11/13
 * @deprecated 数据库传输任务的逻辑
 */
public class TransferTableExecutor implements Runnable{

    private String jobName;
    private ApplicationContext oAC;
    private TransferTableServiceImpl transferTableService;
    public TransferTableExecutor() {
    }
    public TransferTableExecutor(String jobName,ApplicationContext oAC) {
        this.jobName = jobName;
        this.oAC =oAC;
        transferTableService = oAC.getBean(TransferTableServiceImpl.class);
    }

    @Override
    public void run() {
        Map<String, Integer> params = new HashMap<>();
        params.put("stat",1);
        if(transferTableService == null ){
            transferTableService = oAC.getBean(TransferTableServiceImpl.class);
        }
        List<TransferTableEntity> list = transferTableService.getList(params);
        String sql = " BALANCE_WATER_NO = "+ DateUtils.toString(new java.util.Date(),"yyyyMMdd")+"01";
        for (TransferTableEntity transferTableEntity : list) {
            transferTableEntity.setExtraSql(sql);
        }
        try {
            Oracle2Mysql.oracle2mysql(list);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
