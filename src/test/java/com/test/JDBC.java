package com.test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class JDBC {
//	private static String url = "jdbc:oracle:thin:@10.90.2.52:1521/qfylcspdb";
	private static String url = "jdbc:mysql://104.225.152.150:3306/cole";
	private static String user = "root"; // qfcs
	private static String password = "123456"; // qfcs911
	private static Connection conn;
	private static PreparedStatement ps;
	private static ResultSet rs;
	private static Statement st;
	private static JDBC instance = null;
	
	/**建立单例模式
	 * Single
	 * @return
	 */
	public static JDBC getInstance() {
		if (instance == null) {
			synchronized (JDBC.class) {
				instance = new JDBC();
			}
		}
		return instance;
	}
	
	/**
	 * 连接数据库的方法
	 * @return
	 */
	public Connection getConnection() {
		try {
			// 初始化驱动包oracle.jdbc.driver.OracleDriver
			Class.forName("com.mysql.jdbc.Driver");
			// 根据数据库连接字符，名称，密码给conn赋值
			conn = DriverManager.getConnection(url, user, password);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return conn;
	}

	public static void test() {
		String sql = "SELECT * FROM ACTUAL_LINE_DETAIL WHERE ROWNUM < 10";
		try {
			JDBC.getInstance().getConnection();
			ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            while(rs.next()){
            	System.out.println(rs.getString("PERCENT"));
            }
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			releaseAll();
		}
	}
	
	/**
     * 释放资源
     */
    public static void releaseAll() {
		if (rs != null) {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (ps != null) {
			try {
				ps.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (st != null) {
			try {
				st.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (conn != null) {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
    
}