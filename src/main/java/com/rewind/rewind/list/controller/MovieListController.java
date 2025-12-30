package com.rewind.rewind.list.controller;

import com.rewind.rewind.list.dto.*;
import com.rewind.rewind.list.service.MovieListService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
public class MovieListController {

    private final MovieListService service;

    public MovieListController(MovieListService service) {
        this.service = service;
    }

    @GetMapping("/my")
    public List<MovieListResponse> my(Authentication auth) {
        return service.myLists(auth.getName());
    }

    @PostMapping
    public MovieListResponse create(Authentication auth, @Valid @RequestBody CreateListRequest req) {
        return service.create(auth.getName(), req);
    }

    @PostMapping("/{listId}/items")
    public ResponseEntity<?> addItem(Authentication auth, @PathVariable Long listId, @Valid @RequestBody AddListItemRequest req) {
        service.addItem(auth.getName(), listId, req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{listId}/items/{movieId}")
    public ResponseEntity<?> removeItem(Authentication auth, @PathVariable Long listId, @PathVariable Long movieId) {
        service.removeItem(auth.getName(), listId, movieId);
        return ResponseEntity.noContent().build();
    }
}
