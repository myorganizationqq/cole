package com.cole.project.data.tradeFileRpt.service.impl;

import com.cole.project.data.tradeFileRpt.dao.ITradeFileRptDao;
import com.cole.project.data.tradeFileRpt.entity.TradeFileRptVO;
import com.cole.project.data.tradeFileRpt.service.ITradeFileRptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author JiangFeng
 * @date 2017/11/14
 * @Description
 */
@Service("tradeFileRptService")
public class TradeFileRptService  implements ITradeFileRptService  {
    @Autowired
    private ITradeFileRptDao tradeFileRptDao;

    @Override
    public List<TradeFileRptVO> getList(TradeFileRptVO vo) {
        return tradeFileRptDao.getList(vo);
    }

    @Override
    public TradeFileRptVO getOne(long id) {
        return tradeFileRptDao.getOne(id);
    }

    @Override
    public void insert(TradeFileRptVO vo) {
        tradeFileRptDao.insert(vo);
    }

    @Override
    public void insertBatch(List<TradeFileRptVO> vos) {
        tradeFileRptDao.insertBatch(vos);
    }

    @Override
    public void delete(long id) {
        tradeFileRptDao.delete(id);
    }

    @Override
    public void update(TradeFileRptVO vo) {
        tradeFileRptDao.update(vo);
    }

}
