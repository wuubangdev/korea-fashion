package com.shope.kf.application.service;

import com.shope.kf.application.port.out.DashboardQueryPort;
import com.shope.kf.application.result.DashboardStats;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class DashboardServiceTest {

    @Test
    void stats_delegatesToDashboardQueryPort() {
        DashboardQueryPort port = mock(DashboardQueryPort.class);
        DashboardStats expected = new DashboardStats(10, 20, 30, 4, 2, BigDecimal.valueOf(99));
        when(port.stats(5)).thenReturn(expected);

        DashboardService service = new DashboardService(port);

        assertEquals(expected, service.stats(5));
    }

    @Test
    void recentOrders_delegatesToDashboardQueryPort() {
        DashboardQueryPort port = mock(DashboardQueryPort.class);
        when(port.recentOrders(3)).thenReturn(List.of());

        DashboardService service = new DashboardService(port);

        assertEquals(List.of(), service.recentOrders(3));
    }
}
