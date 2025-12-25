package com.rewind.rewind.movie.dto;

import java.time.LocalDate;
import java.math.BigDecimal;

public class MovieDetailsResponse {

    private Long id;
    private String imdbId;
    private String title;
    private Integer durationMinutes;
    private LocalDate releaseDate;
    private String ageRating;
    private BigDecimal rating;
    private String shortPlot;
    private String photoUrl;
    private String backdropUrl;
    private String trailerUrl;

    public MovieDetailsResponse(
            Long id,
            String imdbId,
            String title,
            Integer durationMinutes,
            LocalDate releaseDate,
            String ageRating,
            BigDecimal rating,
            String shortPlot,
            String photoUrl,
            String backdropUrl,
            String trailerUrl
    ) {
        this.id = id;
        this.imdbId = imdbId;
        this.title = title;
        this.durationMinutes = durationMinutes;
        this.releaseDate = releaseDate;
        this.ageRating = ageRating;
        this.rating = rating;
        this.shortPlot = shortPlot;
        this.photoUrl = photoUrl;
        this.backdropUrl = backdropUrl;
        this.trailerUrl = trailerUrl;
    }

    public Long getId() { return id; }

    public String getImdbId() { return imdbId; }

    public String getTitle() { return title; }

    public Integer getDurationMinutes() { return durationMinutes; }

    public LocalDate getReleaseDate() { return releaseDate; }

    public String getAgeRating() { return ageRating; }

    public BigDecimal getRating() { return rating; }

    public String getShortPlot() { return shortPlot; }

    public String getPhotoUrl() { return photoUrl; }

    public String getBackdropUrl() { return backdropUrl; }

    public String getTrailerUrl() { return trailerUrl; }
}
