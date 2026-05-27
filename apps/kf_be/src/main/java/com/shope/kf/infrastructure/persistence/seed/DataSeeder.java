package com.shope.kf.infrastructure.persistence.seed;

import com.shope.kf.infrastructure.persistence.jpa.BannerJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.PaymentMethodJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.RoleJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ShippingMethodJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.SiteSettingJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.StorePolicyJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.BannerJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.PaymentMethodJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.RoleJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ShippingMethodJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.SiteSettingJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.StorePolicyJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import com.shope.kf.infrastructure.security.RoleConstants;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleJpaRepository roleRepo;
    private final UserJpaRepository userRepo;
    private final BannerJpaRepository bannerRepo;
    private final SiteSettingJpaRepository siteSettingRepo;
    private final ShippingMethodJpaRepository shippingMethodRepo;
    private final PaymentMethodJpaRepository paymentMethodRepo;
    private final StorePolicyJpaRepository storePolicyRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            RoleJpaRepository roleRepo,
            UserJpaRepository userRepo,
            BannerJpaRepository bannerRepo,
            SiteSettingJpaRepository siteSettingRepo,
            ShippingMethodJpaRepository shippingMethodRepo,
            PaymentMethodJpaRepository paymentMethodRepo,
            StorePolicyJpaRepository storePolicyRepo,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepo = roleRepo;
        this.userRepo = userRepo;
        this.bannerRepo = bannerRepo;
        this.siteSettingRepo = siteSettingRepo;
        this.shippingMethodRepo = shippingMethodRepo;
        this.paymentMethodRepo = paymentMethodRepo;
        this.storePolicyRepo = storePolicyRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        RoleJpaEntity adminRole = ensureRole(RoleConstants.ROLE_ADMIN);
        ensureRole(RoleConstants.ROLE_STAFF);
        ensureRole(RoleConstants.ROLE_SHIPPER);
        ensureRole(RoleConstants.ROLE_CUSTOMER);

        // create an admin if not exists
        if (userRepo.findByUsername("admin").isEmpty()) {
            UserJpaEntity admin = new UserJpaEntity();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("adminpass"));
            admin.setEmail("admin@example.com");
            admin.setRoles(new HashSet<>());
            admin.getRoles().add(adminRole);
            userRepo.save(admin);
        }

        if (siteSettingRepo.findById("default").isEmpty()) {
            SiteSettingJpaEntity setting = new SiteSettingJpaEntity();
            setting.setId("default");
            setting.setSiteName("Korea Fashion");
            setting.setSiteDescription("Thoi trang Han Quoc chon loc voi form dang hien dai, de mac hang ngay.");
            setting.setMainLogoUrl("/korea-fashion-logo.svg");
            setting.setFooterLogoUrl("/korea-fashion-logo.svg");
            setting.setPrimaryColor("#111827");
            setting.setSecondaryColor("#E11D48");
            setting.setAccentColor("#F59E0B");
            setting.setBackgroundColor("#FFFFFF");
            setting.setTextColor("#111827");
            setting.setSeoTitle("Korea Fashion - Thoi trang Han Quoc chinh hang");
            setting.setSeoDescription("Mua sam thoi trang Han Quoc voi ao khoac, dam, ao so mi, chan vay va phu kien duoc tuyen chon.");
            setting.setSeoKeywords("thoi trang han quoc,korea fashion,ao khoac han quoc,dam han quoc");
            setting.setSeoThumbnailUrl("/korea-fashion-logo.svg");
            setting.setCanonicalUrl("https://korea-fashion.example.com");
            setting.setFacebookUrl("https://facebook.com/koreafashion");
            setting.setInstagramUrl("https://instagram.com/koreafashion");
            setting.setTiktokUrl("https://tiktok.com/@koreafashion");
            setting.setYoutubeUrl("https://youtube.com/@koreafashion");
            setting.setHotline("0900000000");
            setting.setEmail("support@korea-fashion.example.com");
            setting.setAddress("TP. Ho Chi Minh, Viet Nam");
            setting.setFooterAbout("Korea Fashion tap trung vao cac san pham de phoi, chat lieu tot va phong cach Han Quoc ung dung.");
            siteSettingRepo.save(setting);
        }

        if (bannerRepo.findById("home-hero").isEmpty()) {
            BannerJpaEntity banner = new BannerJpaEntity();
            banner.setId("home-hero");
            banner.setTitle("Korean Daily Wear");
            banner.setSubtitle("New season collection");
            banner.setDescription("Nhung thiet ke toi gian, chat lieu thoang va form dang hop voi nhip song moi ngay.");
            banner.setImageUrl("https://images.unsplash.com/photo-1483985988355-763728e1935b");
            banner.setMobileImageUrl("https://images.unsplash.com/photo-1483985988355-763728e1935b");
            banner.setCtaLabel("Mua ngay");
            banner.setCtaUrl("/products");
            banner.setPlacement("home-hero");
            banner.setDisplayOrder(1);
            banner.setActive(true);
            bannerRepo.save(banner);
        }

        if (shippingMethodRepo.findById("standard").isEmpty()) {
            ShippingMethodJpaEntity shipping = new ShippingMethodJpaEntity();
            shipping.setId("standard");
            shipping.setName("Giao hang tieu chuan");
            shipping.setDescription("Giao hang trong 2-5 ngay lam viec tuy khu vuc.");
            shipping.setFee(new BigDecimal("30000"));
            shipping.setFreeThreshold(new BigDecimal("500000"));
            shipping.setCarrier("Standard");
            shipping.setEstimatedDelivery("2-5 ngay");
            shipping.setDisplayOrder(1);
            shipping.setActive(true);
            shippingMethodRepo.save(shipping);
        }

        if (paymentMethodRepo.findById("cod").isEmpty()) {
            PaymentMethodJpaEntity payment = new PaymentMethodJpaEntity();
            payment.setId("cod");
            payment.setName("Thanh toan khi nhan hang");
            payment.setType("COD");
            payment.setDescription("Khach hang thanh toan truc tiep cho don vi van chuyen khi nhan hang.");
            payment.setInstructions("Vui long chuan bi dung so tien can thanh toan.");
            payment.setDisplayOrder(1);
            payment.setActive(true);
            paymentMethodRepo.save(payment);
        }

        if (storePolicyRepo.findById("return-policy").isEmpty()) {
            StorePolicyJpaEntity policy = new StorePolicyJpaEntity();
            policy.setId("return-policy");
            policy.setTitle("Chinh sach doi tra");
            policy.setSlug("chinh-sach-doi-tra");
            policy.setSummary("Ho tro doi tra theo dieu kien san pham va thoi gian quy dinh.");
            policy.setContent("San pham con nguyen tem mac, chua qua su dung va duoc gui yeu cau trong thoi han ho tro.");
            policy.setType("RETURN");
            policy.setDisplayOrder(1);
            policy.setActive(true);
            storePolicyRepo.save(policy);
        }
    }

    private RoleJpaEntity ensureRole(String name) {
        return roleRepo.findByName(name).orElseGet(() -> {
            RoleJpaEntity role = new RoleJpaEntity();
            role.setName(name);
            return roleRepo.save(role);
        });
    }
}
