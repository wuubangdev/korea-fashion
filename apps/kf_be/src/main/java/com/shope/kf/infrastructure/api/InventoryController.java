package com.shope.kf.infrastructure.api;

import com.shope.kf.application.service.InventoryService;
import com.shope.kf.infrastructure.api.dto.request.InventoryAdjustmentRequest;
import com.shope.kf.infrastructure.api.dto.response.InventoryAdjustmentResponse;
import com.shope.kf.infrastructure.security.RequireAuth;
import com.shope.kf.infrastructure.security.RoleConstants;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth(roles = {RoleConstants.ADMIN, RoleConstants.STAFF})
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/adjust")
    public ResponseEntity<InventoryAdjustmentResponse> adjust(@Valid @RequestBody InventoryAdjustmentRequest request) {
        return ResponseEntity.ok(inventoryService.apply(request));
    }
}
