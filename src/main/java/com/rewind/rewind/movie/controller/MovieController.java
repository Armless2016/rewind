package com.rewind.rewind.movie.controller;

import com.rewind.rewind.movie.dto.MovieCardResponse;
import com.rewind.rewind.movie.dto.MovieDetailsResponse;
import com.rewind.rewind.movie.repo.MovieRepository;
import com.rewind.rewind.movie.service.MovieDetailsService;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieRepository movies;
    private final MovieDetailsService movieDetailsService;

    public MovieController(MovieRepository movies, MovieDetailsService movieDetailsService) {
        this.movies = movies;
        this.movieDetailsService = movieDetailsService;
    }

    // GET /api/movies?page=0&size=20
    @GetMapping
    public Page<MovieCardResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return movies.findAll(pageable).map(m -> new MovieCardResponse(
                m.getId(),
                m.getTitle(),
                m.getReleaseDate(),
                m.getRating(),
                m.getPhotoUrl()
        ));
    }

    // GET /api/movies/1  -> повертає повну деталку
    @GetMapping("/{id}")
    public ResponseEntity<MovieDetailsResponse> getById(
            @PathVariable Long id,
            Authentication auth
    ) {
        // Якщо фільму нема — 404
        if (!movies.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        String email = (auth == null ? null : auth.getName());
        return ResponseEntity.ok(movieDetailsService.getDetails(id, email));
    }
}
