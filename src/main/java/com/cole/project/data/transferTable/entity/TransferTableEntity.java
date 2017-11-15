package com.cole.project.data.transferTable.entity;

import java.io.Serializable;

/**
 *@author  JiangFeng
 * on 2017/11/10.
 */
public class TransferTableEntity implements Serializable{
    /*输入表名*/
    private String impTableName;
    /*输出表名*/
    private String expTableName;
    /*查询列*/
    private String tableColumn;
    /*查询需要的sql*/
    private String extraSql;
    /*状态 0 不可用 1 可用 */
    private int stat;
    /*查类型,用来区分不同表的不同处理*/
    private String tableType;

    /*查询列个数 存变量用*/
    private int columnNum;
    public int getStat() {
        return stat;
    }

    public void setStat(int stat) {
        this.stat = stat;
    }

    public String getImpTableName() {
        return impTableName;
    }

    public void setImpTableName(String impTableName) {
        this.impTableName = impTableName;
    }

    public String getExpTableName() {
        return expTableName;
    }

    public void setExpTableName(String expTableName) {
        this.expTableName = expTableName;
    }

    public String getTableColumn() {
        return tableColumn;
    }

    public void setTableColumn(String tableColumn) {
        this.tableColumn = tableColumn;
    }

    public int getColumnNum() {
        return columnNum;
    }

    public void setColumnNum(int columnNum) {
        this.columnNum = columnNum;
    }
    public String getExtraSql() {
        return extraSql;
    }

    public void setExtraSql(String extraSql) {
        this.extraSql = extraSql;
    }
    public String getTableType() {
        return tableType;
    }

    public void setTableType(String tableType) {
        this.tableType = tableType;
    }

}
