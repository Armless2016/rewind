package com.rewind.rewind.movie.dto;

import java.time.LocalDate;

public class MovieCardResponse {
    private Long id;
    private String title;
    private LocalDate releaseDate;
    private Double rating;
    private String photoUrl;

    public MovieCardResponse(Long id, String title, LocalDate releaseDate, Double rating, String photoUrl) {
        this.id = id;
        this.title = title;
        this.releaseDate = releaseDate;
        this.rating = rating;
        this.photoUrl = photoUrl;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public Double getRating() { return rating; }
    public String getPhotoUrl() { return photoUrl; }
}
