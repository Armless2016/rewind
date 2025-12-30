package com.rewind.rewind.list.repo;

import com.rewind.rewind.list.entity.MovieList;
import com.rewind.rewind.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieListRepository extends JpaRepository<MovieList, Long> {
    List<MovieList> findAllByUser(User user);
    Optional<MovieList> findByIdAndUser(Long id, User user);
}
