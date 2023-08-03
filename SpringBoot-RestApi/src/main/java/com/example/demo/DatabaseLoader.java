package com.example.demo;

import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.model.Employee;
import com.example.demo.model.Manager;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.ManagerRepository;

@Component
public class DatabaseLoader implements ApplicationRunner {
	@Autowired
	private EmployeeRepository employees;
	@Autowired
	private ManagerRepository managers;

	@Override
	public void run(ApplicationArguments args) throws Exception {
		System.out.println(new BCryptPasswordEncoder().encode("password"));
		// https://spring.io/blog/2017/11/01/spring-security-5-0-0-rc1-released#password-encoding

		Manager greg = this.managers
				.save(new Manager("greg", "{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG",
						ArrayUtils.toArray("ROLE_MANAGER")));
		Manager oliver = this.managers
				.save(new Manager("oliver", "{noop}password", ArrayUtils.toArray("ROLE_MANAGER")));

		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("greg",
				"doesn't matter", AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

		this.employees.save(new Employee("Frodo", "Baggins", "ring bearer", greg));
		this.employees.save(new Employee("Bilbo", "Baggins", "burglar", greg));
		this.employees.save(new Employee("Gandalf", "the Grey", "wizard", greg));

		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("oliver",
				"doesn't matter", AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

		this.employees.save(new Employee("Samwise", "Gamgee", "gardener", oliver));
		this.employees.save(new Employee("Merry", "Brandybuck", "pony rider", oliver));
		this.employees.save(new Employee("Peregrin", "Took", "pipe smoker", oliver));

		SecurityContextHolder.clearContext();
	}

}
