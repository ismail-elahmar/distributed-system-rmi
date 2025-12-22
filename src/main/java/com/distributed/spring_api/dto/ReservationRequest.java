package com.distributed.spring_api.dto;

import lombok.Data;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat; // Import nécessaire

@Data
public class ReservationRequest {
    private Long clientId;
    private int voitureId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private String insurance;
    private java.util.List<String> extras;
    private String paymentMethod;
}