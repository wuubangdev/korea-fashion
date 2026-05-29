package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.out.UserPersistencePort;
import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.UserMapper;
import com.shope.kf.infrastructure.persistence.repository.RoleJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserPersistenceAdapter implements UserPersistencePort {

	private final UserJpaRepository userJpaRepository;
	private final RoleJpaRepository roleJpaRepository;
	private final TrashQuerySupport trashQuerySupport;

	public UserPersistenceAdapter(UserJpaRepository userJpaRepository, RoleJpaRepository roleJpaRepository, TrashQuerySupport trashQuerySupport) {
		this.userJpaRepository = userJpaRepository;
		this.roleJpaRepository = roleJpaRepository;
		this.trashQuerySupport = trashQuerySupport;
	}

	@Override
	public Optional<User> findByUsername(String username) {
		return userJpaRepository.findByUsername(username)
				.map(UserMapper::toDomain);
	}

	@Override
	public User save(User user) {
		UserJpaEntity entity = UserMapper.toEntity(user, roleJpaRepository);
		if (user.getId() != null) {
			userJpaRepository.findById(user.getId()).ifPresent(existing -> JpaAuditMetadata.copyVersionAndAudit(existing, entity));
		}
		UserJpaEntity saved = userJpaRepository.save(entity);
		return UserMapper.toDomain(saved);
	}

	@Override
	public Optional<User> findById(Long id) {
		return userJpaRepository.findById(id).map(UserMapper::toDomain);
	}

	@Override
	public void deleteById(Long id) {
		userJpaRepository.findById(id).ifPresent(user -> {
			user.markDeleted("system");
			userJpaRepository.save(user);
		});
	}

	@Override
	public void deleteAllById(List<Long> ids) {
		if (ids == null || ids.isEmpty()) {
			return;
		}
		userJpaRepository.findAllById(ids).forEach(user -> {
			user.markDeleted("system");
			userJpaRepository.save(user);
		});
	}

	@Override
	public void restoreById(Long id) {
		trashQuerySupport.restore(UserJpaEntity.class, id);
	}

	@Override
	public void restoreAllById(List<Long> ids) {
		trashQuerySupport.restoreAll(UserJpaEntity.class, ids);
	}

	@Override
	public void hardDeleteById(Long id) {
		userJpaRepository.hardDeleteRolesByUserId(id);
		userJpaRepository.hardDeleteById(id);
	}

	@Override
	public void hardDeleteAllById(List<Long> ids) {
		if (ids == null || ids.isEmpty()) {
			return;
		}
		userJpaRepository.hardDeleteRolesByUserIdIn(ids);
		userJpaRepository.hardDeleteByIdIn(ids);
	}

	@Override
	public PageResult<User> findAll(String search, PageQuery pageQuery) {
		var pageable = PageMapper.toPageable(pageQuery);
		Page<UserJpaEntity> page = (search == null || search.isBlank())
				? userJpaRepository.findAll(pageable)
				: userJpaRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
		return PageMapper.toResult(page, UserMapper::toDomain);
	}

	@Override
	public PageResult<User> findDeleted(String search, PageQuery pageQuery) {
		return trashQuerySupport.listDeleted(UserJpaEntity.class, search, pageQuery).map(UserMapper::toDomain);
	}
}
