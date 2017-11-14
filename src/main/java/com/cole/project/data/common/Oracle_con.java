package com.cole.project.data.common;

import com.cole.project.web.util.PropertiesUtil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Created by JiangFeng
 * on 2017/11/9.
 */
public class Oracle_con {
    public static Connection getConnection(){
        Connection conn = null;
        String driver= PropertiesUtil.getValue("oracle.driverClassName");
        String url = PropertiesUtil.getValue("oracle.url");
        String user = PropertiesUtil.getValue("oracle.username");
        String password = PropertiesUtil.getValue("oracle.password");
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

    /**
     * 验证连接是否存在,是否可用
     * @param conn 连接
     * @return
     */
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

    /**
     * 关闭连接
     * @param conn 连接
     */
    public static void close(Connection conn){
        if (conn != null ){
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 创建连接
     * 如果不存在就创建连接
     * 如果连接不可用就close,再创建
     * @param conn 连接
     */
    public static Connection createIfNon(Connection conn){
        if (conn == null){
            conn=getConnection();
        }else {
            if(!isValid(conn)){
                conn=getConnection();
            }
        }
        return conn;
    }
}
