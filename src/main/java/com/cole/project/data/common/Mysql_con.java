package com.cole.project.data.common;

import com.cole.project.web.util.PropertiesUtil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Created by JiangFeng
 * on 2017/11/9.
 */
public class Mysql_con {
    public static Connection getConnection(){
        Connection conn = null;
        String driver= PropertiesUtil.getValue("cole.driverClassName");
        String url = PropertiesUtil.getValue("cole.url");
        String user = PropertiesUtil.getValue("cole.username");
        String password = PropertiesUtil.getValue("cole.password");
        try {
            Class.forName(driver);// 加载数据库驱动程序
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        try {
            conn = DriverManager.getConnection(url, user, password);// 获得Connection对象
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }

    public static boolean isValid(Connection conn){
        boolean flag =false;
        if (conn != null) {
            try {
                flag = conn.isValid(5);
            } catch (SQLException e) {
                e.printStackTrace();
            }
            //如果连接失效关闭连接
            if(!flag){
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return  flag;
    }
    public static void close(Connection conn){
        if (conn != null ){
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public static Connection createIfNon(Connection conn){
        if (conn == null){
            conn=getConnection();
        }else {
            if(!isValid(conn)){
                conn=getConnection();
            }
        }
        return  conn;
    }
}
