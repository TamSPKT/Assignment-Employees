package com.example.demo;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
	@Value("${jwt.public.key}")
	RSAPublicKey key;

	@Value("${jwt.private.key}")
	RSAPrivateKey priv;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		// @formatter:off
		http
				.authorizeHttpRequests((authorize) -> authorize
						.requestMatchers(toAntPathRequestMatchers(
								"/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
								"/auth/**",
								"/*", "/assets/**" // HAL Explorer
						)).permitAll()
						.anyRequest().authenticated()
				)
				.csrf((csrf) -> csrf.ignoringRequestMatchers(toAntPathRequestMatchers("/auth/**")))
				.cors((cors) -> cors.configurationSource(corsConfigurationSource()))
//				.httpBasic(Customizer.withDefaults())
				.httpBasic(httpBasic -> httpBasic
						.authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint()))
//				.oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt)
				.oauth2ResourceServer((oauth2ResourceServer) -> oauth2ResourceServer
						.jwt((jwt) -> jwt.decoder(jwtDecoder()))
				)
				.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling((exceptions) -> exceptions
						.authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
						.accessDeniedHandler(new BearerTokenAccessDeniedHandler())
				);
		// @formatter:on
		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.addExposedHeader(HttpHeaders.ETAG);
		corsConfiguration.addExposedHeader(HttpHeaders.DATE);
//		corsConfiguration.addExposedHeader(CorsConfiguration.ALL);
		corsConfiguration.setAllowedMethods(Collections.singletonList(CorsConfiguration.ALL));
		source.registerCorsConfiguration("/**", corsConfiguration.applyPermitDefaultValues());
		return source;
	}

//	Don't need as @Service MyUserDetailsService will create @Bean UserDetailsService
//	@Bean
//	UserDetailsService users() {
//		// @formatter:off
//		return new InMemoryUserDetailsManager(
//			User.withUsername("user")
//				.password("{noop}password")
//				.authorities("app")
//				.build()
//		);
//		// @formatter:on
//	}

	@Bean
	JwtDecoder jwtDecoder() {
		return NimbusJwtDecoder.withPublicKey(this.key).build();
	}

	@Bean
	JwtEncoder jwtEncoder() {
		JWK jwk = new RSAKey.Builder(this.key).privateKey(this.priv).build();
		JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
		return new NimbusJwtEncoder(jwks);
	}

	// https://spring.io/security/cve-2023-34035
	private AntPathRequestMatcher[] toAntPathRequestMatchers(String... patterns) {
		List<AntPathRequestMatcher> list = Arrays.asList(patterns).stream()
				.map(pattern -> AntPathRequestMatcher.antMatcher(pattern)).toList();
		return list.toArray(new AntPathRequestMatcher[list.size()]);
	}
}
