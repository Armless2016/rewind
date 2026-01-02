package com.rewind.rewind.movie.service.admin;

import com.rewind.rewind.movie.dto.MovieDetailsResponse;
import com.rewind.rewind.movie.dto.admin.CreateMovieRequest;
import com.rewind.rewind.movie.dto.admin.UpdateMovieRequest;
import com.rewind.rewind.movie.entity.Movie;
import com.rewind.rewind.movie.repo.MovieRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminMovieService {

    private final MovieRepository movies;

    public AdminMovieService(MovieRepository movies) {
        this.movies = movies;
    }

    public MovieDetailsResponse create(CreateMovieRequest req) {
        Movie m = new Movie();
        m.setTitle(req.getTitle());
        m.setImdbId(req.getImdbId());
        m.setDurationMinutes(req.getDurationMinutes());
        m.setReleaseDate(req.getReleaseDate());
        m.setAgeRating(req.getAgeRating());
        m.setRating(req.getRating());
        m.setShortPlot(req.getShortPlot());
        m.setPhotoUrl(req.getPhotoUrl());
        m.setBackdropUrl(req.getBackdropUrl());
        m.setTrailerUrl(req.getTrailerUrl());

        Movie saved = movies.save(m);
        return toDetails(saved);
    }

    public MovieDetailsResponse update(Long id, UpdateMovieRequest req) {
        Movie m = movies.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        if (req.getTitle() != null) m.setTitle(req.getTitle());
        if (req.getImdbId() != null) m.setImdbId(req.getImdbId());
        if (req.getDurationMinutes() != null) m.setDurationMinutes(req.getDurationMinutes());
        if (req.getReleaseDate() != null) m.setReleaseDate(req.getReleaseDate());
        if (req.getAgeRating() != null) m.setAgeRating(req.getAgeRating());
        if (req.getRating() != null) m.setRating(req.getRating());
        if (req.getShortPlot() != null) m.setShortPlot(req.getShortPlot());
        if (req.getPhotoUrl() != null) m.setPhotoUrl(req.getPhotoUrl());
        if (req.getBackdropUrl() != null) m.setBackdropUrl(req.getBackdropUrl());
        if (req.getTrailerUrl() != null) m.setTrailerUrl(req.getTrailerUrl());

        Movie saved = movies.save(m);
        return toDetails(saved);
    }

    public void delete(Long id) {
        if (!movies.existsById(id)) {
            throw new IllegalArgumentException("Movie not found");
        }
        movies.deleteById(id);
    }

    private MovieDetailsResponse toDetails(Movie m) {
        return new MovieDetailsResponse(
                m.getId(),
                m.getImdbId(),
                m.getTitle(),
                m.getDurationMinutes(),
                m.getReleaseDate(),
                m.getAgeRating(),
                m.getRating(),
                m.getShortPlot(),
                m.getPhotoUrl(),
                m.getBackdropUrl(),
                m.getTrailerUrl()
        );
    }
}
