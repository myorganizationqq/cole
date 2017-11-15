package com.cole.project.data.tradeFileRpt.entity;

/**
 * @author JiangFeng
 * @date 2017/11/14
 */
public class TradeFileRptVO {
    private long id;
    /*清算流水号*/
    private String balanceWaterNo;
    /*文件类型*/
    private String fileType;
    /*文件数量*/
    private int fileCount;
    /*处理数量*/
    private int handleCount;
    /*不合法数据*/
    private int wrongfulCount;
    /*重复数据*/
    private int duplicateCount;
    /*无法预处理的数据*/
    private int noPretreatmentCount;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getBalanceWaterNo() {
        return balanceWaterNo;
    }

    public void setBalanceWaterNo(String balanceWaterNo) {
        this.balanceWaterNo = balanceWaterNo;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public long getFileCount() {
        return fileCount;
    }

    public void setFileCount(int fileCount) {
        this.fileCount = fileCount;
    }

    public long getHandleCount() {
        return handleCount;
    }

    public void setHandleCount(int handleCount) {
        this.handleCount = handleCount;
    }

    public long getWrongfulCount() {
        return wrongfulCount;
    }

    public void setWrongfulCount(int wrongfulCount) {
        this.wrongfulCount = wrongfulCount;
    }

    public long getDuplicateCount() {
        return duplicateCount;
    }

    public void setDuplicateCount(int duplicateCount) {
        this.duplicateCount = duplicateCount;
    }

    public long getNoPretreatmentCount() {
        return noPretreatmentCount;
    }

    public void setNoPretreatmentCount(int noPretreatmentCount) {
        this.noPretreatmentCount = noPretreatmentCount;
    }
}
