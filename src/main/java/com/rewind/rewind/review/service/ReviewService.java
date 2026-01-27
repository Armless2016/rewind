package com.rewind.rewind.review.service;

import com.rewind.rewind.rating.dto.UpsertRatingRequest;
import com.rewind.rewind.rating.service.RatingService;
import com.rewind.rewind.movie.repo.MovieRepository;
import com.rewind.rewind.review.dto.CreateReviewRequest;
import com.rewind.rewind.review.dto.ReviewResponse;
import com.rewind.rewind.review.dto.UpdateReviewRequest;
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
    private final RatingService ratingService;

    public ReviewService(ReviewRepository reviews, UserRepository users, MovieRepository movies, RatingService ratingService) {
        this.reviews = reviews;
        this.users = users;
        this.movies = movies;
        this.ratingService = ratingService;
    }

    public ReviewResponse create(String email, Long movieId, CreateReviewRequest req) {
        var user = users.findByEmail(email).orElseThrow();
        var movie = movies.findById(movieId).orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        Review r = new Review();
        r.setUser(user);
        r.setMovie(movie);
        r.setContent(req.getContent());
        r.setRating(req.getRating().byteValue());

        Review saved = reviews.save(r);

        // ✅ синхронізуємо таблицю ratings + оновлюється movies.rating
        UpsertRatingRequest rr = new UpsertRatingRequest();
        rr.setRating(req.getRating());
        ratingService.upsert(email, movieId, rr);

        return new ReviewResponse(
                saved.getId(),
                user.getId(),
                user.getUsername(),
                user.getAvatarUrl(),
                saved.getContent(),
                saved.getRating() == null ? null : saved.getRating().intValue(),
                saved.getCreatedAt()
        );
    }

    public Page<ReviewResponse> listByMovie(Long movieId, int page, int size) {
        var p = reviews.findAllByMovieIdAndIsHiddenFalse(movieId, PageRequest.of(page, size));
        return p.map(r -> new ReviewResponse(
                r.getId(),
                r.getUser().getId(),
                r.getUser().getUsername(),
                r.getUser().getAvatarUrl(),
                r.getContent(),
                r.getRating() == null ? null : r.getRating().intValue(),
                r.getCreatedAt()
        ));
    }

    // ✅ РЕДАГУВАННЯ СВОГО ОГЛЯДУ
    public ReviewResponse updateMy(String email, Long reviewId, UpdateReviewRequest req) {
        var user = users.findByEmail(email).orElseThrow();
        var r = reviews.findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (req.getContent() != null) {
            r.setContent(req.getContent());
        }

        if (req.getRating() != null) {
            r.setRating(req.getRating().byteValue());

            // ✅ синхронізуємо ratings + оновлюємо movies.rating
            UpsertRatingRequest rr = new UpsertRatingRequest();
            rr.setRating(req.getRating());
            ratingService.upsert(email, r.getMovie().getId(), rr);
        }

        Review saved = reviews.save(r);

        return new ReviewResponse(
                saved.getId(),
                saved.getUser().getId(),
                saved.getUser().getUsername(),
                saved.getUser().getAvatarUrl(),
                saved.getContent(),
                saved.getRating() == null ? null : saved.getRating().intValue(),
                saved.getCreatedAt()
        );
    }

    public void deleteMy(String email, Long reviewId) {
        var user = users.findByEmail(email).orElseThrow();
        var r = reviews.findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        Long movieId = r.getMovie().getId();

        reviews.delete(r);

        // ✅ логічно: якщо видалив огляд, видаляємо і rating (бо “огляд = текст+оцінка”)
        ratingService.deleteMyRating(email, movieId);
    }
}
