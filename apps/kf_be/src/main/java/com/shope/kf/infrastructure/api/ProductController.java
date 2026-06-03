package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.request.CreateProductRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateProductRequest;
import com.shope.kf.infrastructure.api.dto.response.ProductResponse;
import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.ProductFilter;
import com.shope.kf.application.port.in.ProductUseCase;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.mapper.ProductApiMapper;
import com.shope.kf.infrastructure.persistence.jpa.ReviewJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ReviewReactionJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import com.shope.kf.infrastructure.persistence.repository.ReviewImageJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ReviewJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ReviewReactionJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import com.shope.kf.infrastructure.security.RoleConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductUseCase productUseCase;
    private final ReviewJpaRepository reviewRepository;
    private final ReviewImageJpaRepository reviewImageRepository;
    private final ReviewReactionJpaRepository reviewReactionRepository;
    private final UserJpaRepository userRepository;

    public ProductController(
            ProductUseCase productUseCase,
            ReviewJpaRepository reviewRepository,
            ReviewImageJpaRepository reviewImageRepository,
            ReviewReactionJpaRepository reviewReactionRepository,
            UserJpaRepository userRepository
    ) {
        this.productUseCase = productUseCase;
        this.reviewRepository = reviewRepository;
        this.reviewImageRepository = reviewImageRepository;
        this.reviewReactionRepository = reviewReactionRepository;
        this.userRepository = userRepository;
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping
    public ResponseEntity<ProductResponse> create(@jakarta.validation.Valid @RequestBody CreateProductRequest req) {
        Product p = ProductApiMapper.toDomain(req);
        Product saved = productUseCase.create(p);
        return ResponseEntity.ok(ProductApiMapper.toResponse(saved));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/{id}/copy")
    public ResponseEntity<ProductResponse> copy(@PathVariable Long id) {
        Product copied = productUseCase.copy(id);
        return ResponseEntity.ok(ProductApiMapper.toResponse(copied));
    }

    @GetMapping
    public ResponseEntity<PageResult<ProductResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String brandId,
            @RequestParam(required = false) String collectionId,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean newArrival,
            @RequestParam(required = false) Boolean bestSeller,
            @RequestParam(required = false) Boolean sale,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        ProductFilter filter = new ProductFilter(search, categoryId, brand, brandId, collectionId, gender, style, season, priceMin, priceMax, status, inStock, featured, newArrival, bestSeller, sale);
        return ResponseEntity.ok(productUseCase.list(filter, PageQuery.of(page, size, sort)).map(ProductApiMapper::toResponse));
    }

    @GetMapping("/trash")
    public ResponseEntity<PageResult<ProductResponse>> trash(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "deletedAt,desc") String sort
    ) {
        return ResponseEntity.ok(productUseCase.trash(search, PageQuery.of(page, size, sort)).map(ProductApiMapper::toResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Long id) {
        Product p = productUseCase.findById(id);
        return ResponseEntity.ok(ProductApiMapper.toResponse(p));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<PageResult<ReviewJpaEntity>> reviews(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "reviewedAt,desc") String sort,
            Authentication authentication
    ) {
        var result = reviewRepository.findByProductIdAndStatusIgnoreCase(id, "APPROVED", PageMapper.toPageable(PageQuery.of(page, size, sort)));
        Map<Long, String> avatarsByUserId = new HashMap<>();
        userRepository.findAllById(
                result.getContent().stream()
                        .map(ReviewJpaEntity::getUserId)
                        .filter(Objects::nonNull)
                        .distinct()
                        .toList()
        ).forEach(user -> avatarsByUserId.put(user.getId(), user.getAvatarUrl()));
        Map<String, String> reactionsByReviewId = currentUserReactions(authentication, result.getContent());

        return ResponseEntity.ok(PageMapper.toResult(result, review -> withCurrentReaction(withCurrentAvatar(withImages(review), avatarsByUserId), reactionsByReviewId)));
    }

    private ReviewJpaEntity withImages(ReviewJpaEntity review) {
        review.setImages(reviewImageRepository.findByReviewIdAndActiveTrueOrderByDisplayOrderAscIdAsc(review.getId()));
        return review;
    }

    private ReviewJpaEntity withCurrentAvatar(ReviewJpaEntity review, Map<Long, String> avatarsByUserId) {
        if (review.getUserId() != null && avatarsByUserId.containsKey(review.getUserId())) {
            review.setReviewerAvatarUrl(avatarsByUserId.get(review.getUserId()));
        }
        return review;
    }

    private Map<String, String> currentUserReactions(Authentication authentication, List<ReviewJpaEntity> reviews) {
        if (authentication == null || authentication.getName() == null || reviews.isEmpty()) {
            return Map.of();
        }

        return userRepository.findByUsername(authentication.getName())
                .map(user -> reviewReactionRepository.findByReviewIdInAndUserId(
                        reviews.stream().map(ReviewJpaEntity::getId).toList(),
                        user.getId()
                ).stream().collect(Collectors.toMap(ReviewReactionJpaEntity::getReviewId, ReviewReactionJpaEntity::getReaction)))
                .orElse(Map.of());
    }

    private ReviewJpaEntity withCurrentReaction(ReviewJpaEntity review, Map<String, String> reactionsByReviewId) {
        review.setCurrentUserReaction(reactionsByReviewId.get(review.getId()));
        return review;
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @jakarta.validation.Valid @RequestBody UpdateProductRequest req) {
        Product p = ProductApiMapper.toDomain(req);
        Product updated = productUseCase.update(id, p);
        return ResponseEntity.ok(ProductApiMapper.toResponse(updated));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productUseCase.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> deleteAll(@RequestBody List<Long> ids) {
        productUseCase.deleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restore(@PathVariable Long id) {
        productUseCase.restore(id);
        return ResponseEntity.ok(ApiResponse.ok("Restored successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/trash/restore/bulk")
    public ResponseEntity<ApiResponse<Void>> restoreAll(@RequestBody List<Long> ids) {
        productUseCase.restoreAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Restored successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable Long id) {
        productUseCase.hardDelete(id);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/hard/bulk")
    public ResponseEntity<ApiResponse<Void>> hardDeleteAll(@RequestBody List<Long> ids) {
        productUseCase.hardDeleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

}
