/**
 * 
 */
package com.example.demo;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.example.demo.controller.AuthorizationController;

/**
 * Tests for {@link AuthorizationController}
 */
@WebMvcTest({ AuthorizationController.class })
@Import({ SecurityConfig.class })
class AuthorizationControllerTests {
	@Autowired
	MockMvc mvc;

	@Test
	@WithMockUser(username = "user", password = "password")
	void getToken() throws Exception {
		// @formatter:off
		MvcResult result = this.mvc.perform(post("/auth/token")
				.with(httpBasic("user", "password")))
				.andExpect(status().isOk())
				.andReturn();
		// @formatter:on
		String token = result.getResponse().getContentAsString();
		// @formatter:off
		this.mvc.perform(post("/auth/introspect")
				.header("Authorization", "Bearer " + token))
				.andExpectAll(
						status().isOk(),
						content().contentType(MediaType.APPLICATION_JSON),
						jsonPath("$.sub").value("user")
				);
		// @formatter:on
	}

	@Test
	void getTokenWithBadCredentials() throws Exception {
		// @formatter:off
		this.mvc.perform(post("/auth/token")
				.with(httpBasic("user", "password")))
				.andExpect(status().isUnauthorized());
		// @formatter:on
	}
}
