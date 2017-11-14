package com.test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class DealTables {
	private static Connection conn;
	private static PreparedStatement ps;
	private static ResultSet rs;
	
	static StringBuilder sbd = new StringBuilder();
	
	public static void main(String[] args) throws IOException {
	}
	
	public static void dealTables() throws IOException {
		List<String> tbList = getTables();
		String sql = "insert into transfer_table values('%s','%s','%s','',1);";
		for (String table : tbList) {
			List<String> columnList = getColumns(table);
			String columns = "";
			for (String column : columnList) {
				columns += column + ",";
			}
			sbd.append(String.format(sql, table.replace("_dt", ""), table, columns.substring(0, columns.length()-1))).append("\n");
		}
		System.out.println(sbd.toString());
		writeFile("D://trans_table.sql");
	}
	
	public static List<String> getTables() {
    	List<String> tbList = new ArrayList<>();
    	String sql = "select table_name from information_schema.tables where table_schema='cole'";
		try {
			conn = JDBC.getInstance().getConnection();
			ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            while(rs.next()) {
            	String tbName = rs.getString("table_name");
            	if(tbName.endsWith("_dt")) {
            		tbList.add(tbName);
            	}
            }
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			JDBC.releaseAll();
		}
		return tbList;
    }
    
    public static List<String> getColumns(String tableName) {
    	List<String> columnList = new ArrayList<>();
    	String sql = "select column_name from information_schema.columns where table_schema='cole' and table_name='%s'";
		try {
			conn = JDBC.getInstance().getConnection();
			ps = conn.prepareStatement(String.format(sql, tableName));
            rs = ps.executeQuery();
            while(rs.next()) {
            	String column = rs.getString("column_name");
        		columnList.add(column);
            }
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			JDBC.releaseAll();
		}
		return columnList;
    }
    
    /**
	 * 写文件
	 * @param path
	 * @throws IOException
	 * @throws IOException
	 */
	public static void writeFile(String path) throws IOException {
		FileWriter fw = null;
		PrintWriter out = null;
		try {
			File file = new File(path);
			if (!file.exists()) {
				file.createNewFile();
			}
			fw = new FileWriter(file);
			out = new PrintWriter(fw);
			out.write(sbd.toString());
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fw != null)
				fw.close();
			if (out != null)
				out.close();
		}
	}
	
}
