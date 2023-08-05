package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class SpringBootRestApiApplicationTests {
	@LocalServerPort
	int port;

	@Test
	void contextLoads() {
		assertThat(port).isGreaterThan(0);
		System.out.println(" - Listening at port: " + port);
	}

}
