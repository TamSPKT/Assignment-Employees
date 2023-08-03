package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.demo.model.Employee;
import com.example.demo.model.Manager;
import com.example.demo.repository.ManagerRepository;

@Component
@RepositoryEventHandler(Employee.class)
public class SpringDataRestEventHandler {
	@Autowired
	private ManagerRepository managerRepository;

	@HandleBeforeCreate
	@HandleBeforeSave
	public void applyUserInformationUsingSecurityContext(Employee employee) {

		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		Manager manager = this.managerRepository.findByName(name);
		if (manager == null) {
			Manager newManager = new Manager();
			newManager.setName(name);
			newManager.setPassword("{noop}password");
			newManager.setRoles(new String[] { "ROLE_MANAGER" });
			manager = this.managerRepository.save(newManager);
		}
		employee.setManager(manager);
	}
}
