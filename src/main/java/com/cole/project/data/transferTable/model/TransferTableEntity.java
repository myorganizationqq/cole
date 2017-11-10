package com.cole.project.data.transferTable.model;

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
    /*查询列个数 存变量用*/
    private int columnNum;
    /*查询需要的sql*/
    private String sql;

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

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }
}
