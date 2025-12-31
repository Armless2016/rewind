package com.rewind.rewind.rating.service;

import com.rewind.rewind.movie.repo.MovieRepository;
import com.rewind.rewind.rating.dto.UpsertRatingRequest;
import com.rewind.rewind.rating.entity.Rating;
import com.rewind.rewind.rating.repo.RatingRepository;
import com.rewind.rewind.user.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RatingService {

    private final RatingRepository ratings;
    private final UserRepository users;
    private final MovieRepository movies;

    public RatingService(RatingRepository ratings, UserRepository users, MovieRepository movies) {
        this.ratings = ratings;
        this.users = users;
        this.movies = movies;
    }

    public void upsert(String email, Long movieId, UpsertRatingRequest req) {
        var user = users.findByEmail(email).orElseThrow();
        var movie = movies.findById(movieId).orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        var existing = ratings.findByUserIdAndMovieId(user.getId(), movieId);

        if (existing.isPresent()) {
            Rating r = existing.get();
            r.setRating(req.getRating().byteValue());
            ratings.save(r);
            return;
        }

        Rating r = new Rating();
        r.setUser(user);
        r.setMovie(movie);
        r.setRating(req.getRating().byteValue());
        ratings.save(r);
    }

    public Optional<Integer> getMyRating(String email, Long movieId) {
        var user = users.findByEmail(email).orElseThrow();
        return ratings.findByUserIdAndMovieId(user.getId(), movieId)
                .map(Rating::getRating)
                .map(Byte::intValue);
    }

    public void deleteMyRating(String email, Long movieId) {
        var user = users.findByEmail(email).orElseThrow();
        ratings.deleteByUserIdAndMovieId(user.getId(), movieId);
    }
}
