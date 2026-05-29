package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(
        name = "contact_messages",
        indexes = {
                @Index(name = "idx_contact_messages_status", columnList = "status,created_at"),
                @Index(name = "idx_contact_messages_email", columnList = "email")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ContactMessageJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String fullName;

    @Email
    @Size(max = 120)
    @Column(length = 120)
    private String email;

    @Size(max = 40)
    @Column(length = 40)
    private String phone;

    @Size(max = 180)
    @Column(length = 180)
    private String subject;

    @NotBlank
    @Size(max = 3000)
    @Column(nullable = false, length = 3000)
    private String message;

    @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String status = "NEW";

    @Size(max = 60)
    @Column(length = 60)
    private String source = "CONTACT_PAGE";

    @Size(max = 1000)
    @Column(length = 1000)
    private String adminNote;
}
