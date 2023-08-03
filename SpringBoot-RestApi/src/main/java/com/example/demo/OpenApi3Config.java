package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApi3Config {
	public static final String bearerSecuritySchemeName = "bearerAuth";
	public static final String basicSecuritySchemeName = "basicAuth";

	@Bean
	public OpenAPI openAPI() {
		// @formatter:off
		return new OpenAPI()
				.addSecurityItem( // Default global SecurityRequirement is "Bearer"
						new SecurityRequirement().addList(bearerSecuritySchemeName))
				.components(
						new Components()
						.addSecuritySchemes(bearerSecuritySchemeName,
								new SecurityScheme()
										.name(bearerSecuritySchemeName)
										.type(SecurityScheme.Type.HTTP)
										.scheme("bearer")
										.bearerFormat("JWT")
						)
						.addSecuritySchemes(basicSecuritySchemeName,
								new SecurityScheme()
										.name(basicSecuritySchemeName)
										.type(SecurityScheme.Type.HTTP)
										.scheme("basic")
						)
				)
				.info(new Info().title("OpenAPI definition").version("v3"));
		// @formatter:on
	}
}
