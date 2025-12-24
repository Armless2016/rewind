package com.rewind.rewind.movie.controller;

import com.rewind.rewind.movie.dto.MovieCardResponse;
import com.rewind.rewind.movie.dto.MovieDetailsResponse;
import com.rewind.rewind.movie.entity.Movie;
import com.rewind.rewind.movie.repo.MovieRepository;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieRepository movies;

    public MovieController(MovieRepository movies) {
        this.movies = movies;
    }

    // GET /api/movies?page=0&size=20&q=inception
    @GetMapping
    public Page<MovieCardResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<Movie> result = (q == null || q.isBlank())
                ? movies.findAll(pageable)
                : movies.findByTitleContainingIgnoreCase(q, pageable);

        return result.map(m -> new MovieCardResponse(
                m.getId(),
                m.getTitle(),
                m.getReleaseDate(),
                m.getRating(),
                m.getPhotoUrl()
        ));
    }

    // GET /api/movies/1
    @GetMapping("/{id}")
    public ResponseEntity<MovieDetailsResponse> getById(@PathVariable Long id) {
        return movies.findById(id)
                .map(m -> new MovieDetailsResponse(
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
                ))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
