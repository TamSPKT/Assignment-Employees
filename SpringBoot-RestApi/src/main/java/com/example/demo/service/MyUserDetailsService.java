package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.model.Manager;
import com.example.demo.repository.ManagerRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {
	@Autowired
	private ManagerRepository repository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Manager manager = this.repository.findByName(username);
		if (manager == null) {
			throw new UsernameNotFoundException(username);
		}
		return new User(manager.getName(), manager.getPassword(),
				AuthorityUtils.createAuthorityList(manager.getRoles()));
	}

}
