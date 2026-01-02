package com.rewind.rewind.movie.controller.admin;

import com.rewind.rewind.movie.dto.MovieDetailsResponse;
import com.rewind.rewind.movie.dto.admin.CreateMovieRequest;
import com.rewind.rewind.movie.dto.admin.UpdateMovieRequest;
import com.rewind.rewind.movie.service.admin.AdminMovieService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/movies")
public class AdminMovieController {

    private final AdminMovieService service;

    public AdminMovieController(AdminMovieService service) {
        this.service = service;
    }

    @PostMapping
    public MovieDetailsResponse create(@Valid @RequestBody CreateMovieRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public MovieDetailsResponse update(@PathVariable Long id, @RequestBody UpdateMovieRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
