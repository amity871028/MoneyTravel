package moneyTravel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import moneyTravel.service.CostService;

@RestController
@RequestMapping(value = "/assets")
public class AssetsController {
	@Autowired
	private CostService costService;
	
	@GetMapping(value = "/hello")
	public String hello() {
		return "hello";
	}
}
