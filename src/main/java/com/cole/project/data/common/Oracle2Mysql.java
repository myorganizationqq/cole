package com.cole.project.data.common;

import com.cole.project.data.transferTable.model.TransferTableEntity;
import com.cole.project.web.util.DateUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.FileNotFoundException;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.TimeZone;

/**
 * @author  JiangFeng
 * on 2017/11/9.
 */
public class Oracle2Mysql {

   private static Connection mysqlConn;
   private static Connection oracleConn;

    public Oracle2Mysql(){

    }
    public static List<List<String>> tableInput(TransferTableEntity transferTableEntity) throws FileNotFoundException,
            SQLException {
        List<List<String>> findList = new ArrayList<List<String>>();
        oracleConn = Oracle_con.createIfNon(oracleConn);
        PreparedStatement pre = null;
        ResultSet resultSet = null;
        String sql = "SELECT "+transferTableEntity.getTableColumn()+"  FROM "+transferTableEntity.getImpTableName();
        String extraSql = transferTableEntity.getExtraSql();
        if (StringUtils.isNotBlank(extraSql)){
            sql +=" WHERE "+ extraSql;
        }
        try {
            pre = oracleConn.prepareStatement(sql);
            resultSet = pre.executeQuery();
            String[] column = transferTableEntity.getTableColumn().split(",");
            //设置列数
            transferTableEntity.setColumnNum(column.length);
            int i=0;
            while (resultSet.next()) {
                List<String> minList = new ArrayList<String>();
                for(String each:column){
                    minList.add(resultSet.getString(each));
                }
                findList.add(minList);
                i++;
                //设置的每次提交大小为10000
                if(i%10000==0){
                    executeManySql(findList,transferTableEntity);
                    findList.removeAll(findList);
                    System.out.println(transferTableEntity.getImpTableName()+":"+i);
                }
            }
            //最后别忘了提交剩余的
            if(findList.size() > 0){
                executeManySql(findList,transferTableEntity);
            }
            return findList;
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            try {
                pre.close();// 关闭Statement
            } catch (SQLException e) {
                e.printStackTrace();
            }
            try {
                oracleConn.close();// 关闭Connection
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public static void executeManySql(List<List<String>> findList,TransferTableEntity entity) throws SQLException {

        mysqlConn=Mysql_con.createIfNon(mysqlConn);

        mysqlConn.setAutoCommit(false);
        Statement stat = null;
        String pstSql="insert into "+entity.getExpTableName()+" values (";
        List<String> tempList = new ArrayList<>();
        for(int i=0;i<entity.getColumnNum();i++){
            tempList.add("?");
        }
        pstSql += StringUtils.join(tempList, ",")+")";
        PreparedStatement pst = (PreparedStatement) mysqlConn
                .prepareStatement(pstSql);
        for (List<String> minList: findList) {
            for(int i=0;i<minList.size();i++){
                pst.setString(i+1, minList.get(i));
            }
            // 把一个SQL命令加入命令列表
            pst.addBatch();
        }
        // 执行批量更新
        pst.executeBatch();
        // 语句执行完毕，提交本事务
        mysqlConn.commit();
        pst.close();
        mysqlConn.close();//一定要记住关闭连接，不然mysql回应为too many connection自我保护而断开。
    }
    public static void oracle2mysql(List<TransferTableEntity> transferTables) {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss:SS");
        TimeZone t = sdf.getTimeZone();
        t.setRawOffset(0);
        sdf.setTimeZone(t);
        Long startTime = System.currentTimeMillis();
        String sql = " BALANCE_WATER_NO = "+ DateUtils.toString(new java.util.Date(),"yyyyMMdd")+"01";
       //String sql = " BALANCE_WATER_NO = 2017110401";
        for (TransferTableEntity transferTable : transferTables) {
            System.out.println(transferTable.getImpTableName()+"--------------------------------------------"+sql);
            transferTable.setExtraSql(sql);
            mysqlConn= Mysql_con.createIfNon(mysqlConn);
            String delSql="delete FROM "+transferTable.getExpTableName();
            if(StringUtils.isNotBlank(sql)){
                delSql+=" WHERE "+sql;
            }
            try {
                mysqlConn.createStatement().execute(delSql);
                List<List<String>> newDrug = tableInput(transferTable);
            } catch (Exception e) {
                e.printStackTrace();
                continue;
            }finally {
                Mysql_con.close(mysqlConn);
            }
        }
        Long endTime = System.currentTimeMillis();
        System.out.println("用时：" + sdf.format(new Date(endTime - startTime)));
    }


    public static void main(String[] args) throws FileNotFoundException,
            SQLException {
    }
}
