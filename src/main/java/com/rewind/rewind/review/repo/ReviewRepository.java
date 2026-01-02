package com.rewind.rewind.review.repo;

import com.rewind.rewind.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findAllByMovieId(Long movieId, Pageable pageable);
    Page<Review> findAllByUserIdOrderByUpdatedAtDesc(Long userId, Pageable pageable);
    Optional<Review> findByIdAndUserId(Long id, Long userId);
}
