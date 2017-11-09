package com.cole.project.web.controller.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 异常控制类
 */
@Controller
public class ExceptionController {

  @RequestMapping("/error")
  public String error() {

    return "../500";
  }
}
