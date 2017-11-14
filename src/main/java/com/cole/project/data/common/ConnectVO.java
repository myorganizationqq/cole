package com.cole.project.data.common;

/**
 * @author  JiangFeng
 * @date 2017/11/14.
 * @deprecated 数据库连接信息表
 */
public class ConnectVO {
    private String dirver;
    private String url;
    private String username;
    private String password;

    public ConnectVO() {
    }

    public ConnectVO(String dirver, String url, String username, String password) {
        this.dirver = dirver;
        this.url = url;
        this.username = username;
        this.password = password;
    }

    public String getDirver() {
        return dirver;
    }

    public void setDirver(String dirver) {
        this.dirver = dirver;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
