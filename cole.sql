
CREATE TABLE `logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户帐号',
  `ip` varchar(45) DEFAULT NULL COMMENT '来源ip',
  `content` varchar(1024) DEFAULT NULL COMMENT '访问资源名称',
  `type` smallint(6) NOT NULL COMMENT '日志类型 1、系统日志 2、操作日志',
  `url` varchar(1024) DEFAULT NULL COMMENT '发生源',
  `createtime` datetime NOT NULL COMMENT '记录时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='操作日志';