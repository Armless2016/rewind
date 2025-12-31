package com.rewind.rewind.review.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateReviewRequest {

    @NotBlank
    @Size(min = 1, max = 5000)
    private String content;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
