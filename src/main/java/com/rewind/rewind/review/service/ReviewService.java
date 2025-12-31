package com.rewind.rewind.review.service;

import com.rewind.rewind.movie.repo.MovieRepository;
import com.rewind.rewind.review.dto.CreateReviewRequest;
import com.rewind.rewind.review.dto.ReviewResponse;
import com.rewind.rewind.review.entity.Review;
import com.rewind.rewind.review.repo.ReviewRepository;
import com.rewind.rewind.user.repo.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviews;
    private final UserRepository users;
    private final MovieRepository movies;

    public ReviewService(ReviewRepository reviews, UserRepository users, MovieRepository movies) {
        this.reviews = reviews;
        this.users = users;
        this.movies = movies;
    }

    public ReviewResponse create(String email, Long movieId, CreateReviewRequest req) {
        var user = users.findByEmail(email).orElseThrow();
        var movie = movies.findById(movieId).orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        Review r = new Review();
        r.setUser(user);
        r.setMovie(movie);
        r.setContent(req.getContent());

        Review saved = reviews.save(r);

        return new ReviewResponse(
                saved.getId(),
                user.getId(),
                user.getUsername(),
                user.getAvatarUrl(),
                saved.getContent(),
                saved.getCreatedAt() // якщо IDE скаже, що немає — додамо getter
        );
    }

    public Page<ReviewResponse> listByMovie(Long movieId, int page, int size) {
        var p = reviews.findAllByMovieId(movieId, PageRequest.of(page, size));
        return p.map(r -> new ReviewResponse(
                r.getId(),
                r.getUser().getId(),
                r.getUser().getUsername(),
                r.getUser().getAvatarUrl(),
                r.getContent(),
                r.getCreatedAt()
        ));
    }

    public void deleteMy(String email, Long reviewId) {
        var user = users.findByEmail(email).orElseThrow();
        var r = reviews.findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        reviews.delete(r);
    }
}
