package com.vys.staff_evaluation_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class StaffEvaluationSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(StaffEvaluationSystemApplication.class, args);
	}

}
