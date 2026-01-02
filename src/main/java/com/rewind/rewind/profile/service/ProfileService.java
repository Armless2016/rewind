package com.rewind.rewind.profile.service;

import com.rewind.rewind.list.repo.MovieListRepository;
import com.rewind.rewind.profile.dto.ProfileResponse;
import com.rewind.rewind.rating.repo.RatingRepository;
import com.rewind.rewind.review.repo.ReviewRepository;
import com.rewind.rewind.user.repo.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final UserRepository users;
    private final MovieListRepository lists;
    private final RatingRepository ratings;
    private final ReviewRepository reviews;

    public ProfileService(UserRepository users, MovieListRepository lists, RatingRepository ratings, ReviewRepository reviews) {
        this.users = users;
        this.lists = lists;
        this.ratings = ratings;
        this.reviews = reviews;
    }

    public ProfileResponse myProfile(String email) {
        var user = users.findByEmail(email).orElseThrow();

        var listItems = lists.findAllByUser(user).stream()
                .map(l -> new ProfileResponse.ProfileListItem(
                        l.getId(), l.getName(), l.getListType(), l.getIsPublic()
                ))
                .collect(Collectors.toList());

        var recentRatings = ratings.findAllByUserIdOrderByUpdatedAtDesc(user.getId(), PageRequest.of(0, 10))
                .getContent()
                .stream()
                .map(r -> new ProfileResponse.ProfileRatingItem(
                        r.getMovie().getId(),
                        r.getMovie().getTitle(),
                        r.getMovie().getPhotoUrl(),
                        r.getRating().intValue(),      // Byte -> Integer
                        r.getUpdatedAt()
                ))
                .collect(Collectors.toList());

        var recentReviews = reviews.findAllByUserIdOrderByUpdatedAtDesc(user.getId(), PageRequest.of(0, 10))
                .getContent()
                .stream()
                .map(rv -> new ProfileResponse.ProfileReviewItem(
                        rv.getId(),
                        rv.getMovie().getId(),
                        rv.getMovie().getTitle(),
                        rv.getContent(),
                        rv.getUpdatedAt()
                ))
                .collect(Collectors.toList());

        return new ProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getAvatarUrl(),
                listItems,
                recentRatings,
                recentReviews
        );
    }
}
