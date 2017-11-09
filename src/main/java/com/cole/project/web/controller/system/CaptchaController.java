package com.cole.project.web.controller.system;

import com.octo.captcha.service.image.ImageCaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 * 验证码控制类.
 */
@Controller
public class CaptchaController {

	private ImageCaptchaService imageService;

	@RequestMapping("/captcher")
	public void getCaptchaImg(HttpServletRequest request, HttpServletResponse response, Model model)
			throws IOException {
		response.setDateHeader("Expires", 0L);
		response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
		response.addHeader("Cache-Control", "post-check=0, pre-check=0");
		response.setHeader("Pragma", "no-cache");
		response.setContentType("image/jpeg");

		BufferedImage bi = imageService.getImageChallengeForID(request.getSession(true).getId());
		ServletOutputStream out = response.getOutputStream();

		ImageIO.write(bi, "jpg", out);
		try {
			out.flush();
		} finally {
			out.close();
		}
	}

	@Autowired
	public void setImageService(ImageCaptchaService imageService) {
		this.imageService = imageService;
	}

}