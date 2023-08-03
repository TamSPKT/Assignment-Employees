package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor // JpaSystemException: No default constructor for entity
@RequiredArgsConstructor
@Entity
public class Manager {
	@Id
	@GeneratedValue
	private Long id;

	@NonNull
	private String name;

	@JsonIgnore
	@NonNull
	private String password;

	@NonNull
	private String[] roles;
}
