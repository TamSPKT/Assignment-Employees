package com.example.demo.model;

import java.sql.Date;

import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.ReadOnlyProperty;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Version;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor // JpaSystemException: No default constructor for entity
@RequiredArgsConstructor
@Entity
public class Employee {
	@Id
	@GeneratedValue
	private Long id;

	@NonNull
	private String firstName;

	@NonNull
	private String lastName;

	@NonNull
	private String description;

	@Version
	@JsonIgnore
	private Long version;

	@LastModifiedDate
	@JsonIgnore
	private Date lastModified;

	@ManyToOne
	@NonNull
	@ReadOnlyProperty // Will show as readOnly:"true" in schema+json
	private Manager manager;
}
