package com.example.demo.controller;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.OpenApi3Config;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/auth")
public class AuthorizationController {
	@Autowired
	JwtEncoder encoder;

	@PostMapping(value = "/token", produces = MediaType.TEXT_PLAIN_VALUE)
	@SecurityRequirement(name = OpenApi3Config.basicSecuritySchemeName)
	public String token(Authentication authentication) {
		System.out.println(authentication.getClass());
		Instant now = Instant.now();
		long expiry = 36000L; // 10 hours
		// @formatter:off
		String scope = authentication.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.collect(Collectors.joining(" "));
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuer("self")
				.issuedAt(now)
				.expiresAt(now.plusSeconds(expiry))
				.subject(authentication.getName())
				.claim("scope", scope)
				.build();
		// @formatter:on
		return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
	}

	@PostMapping(value = "/introspect", produces = MediaType.APPLICATION_JSON_VALUE)
	@SecurityRequirement(name = OpenApi3Config.bearerSecuritySchemeName)
	public Map<String, Object> introspect(Authentication authentication) {
		if (authentication.getPrincipal() instanceof Jwt) {
			Jwt jwt = (Jwt) authentication.getPrincipal();
			return jwt.getClaims();
		}
		return null;
	}
}
