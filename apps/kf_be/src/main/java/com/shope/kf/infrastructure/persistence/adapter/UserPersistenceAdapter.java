package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.port.out.UserPersistencePort;
import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.UserMapper;
import com.shope.kf.infrastructure.persistence.repository.RoleJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserPersistenceAdapter implements UserPersistencePort {

	private final UserJpaRepository userJpaRepository;
	private final RoleJpaRepository roleJpaRepository;

	public UserPersistenceAdapter(UserJpaRepository userJpaRepository, RoleJpaRepository roleJpaRepository) {
		this.userJpaRepository = userJpaRepository;
		this.roleJpaRepository = roleJpaRepository;
	}

	@Override
	public Optional<User> findByUsername(String username) {
		return userJpaRepository.findByUsername(username)
				.map(UserMapper::toDomain);
	}

	@Override
	public User save(User user) {
		UserJpaEntity entity = UserMapper.toEntity(user, roleJpaRepository);
		UserJpaEntity saved = userJpaRepository.save(entity);
		return UserMapper.toDomain(saved);
	}

	@Override
	public Optional<User> findById(Long id) {
		return userJpaRepository.findById(id).map(UserMapper::toDomain);
	}

	@Override
	public void deleteById(Long id) {
		userJpaRepository.deleteById(id);
	}

	@Override
	public Page<User> findAll(String search, Pageable pageable) {
		Page<UserJpaEntity> page = (search == null || search.isBlank())
				? userJpaRepository.findAll(pageable)
				: userJpaRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
		return page.map(UserMapper::toDomain);
	}
}
