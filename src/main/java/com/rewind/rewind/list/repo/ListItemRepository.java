package com.rewind.rewind.list.repo;

import com.rewind.rewind.list.entity.ListItem;
import com.rewind.rewind.list.entity.MovieList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ListItemRepository extends JpaRepository<ListItem, Long> {
    Optional<ListItem> findByListIdAndMovieId(Long listId, Long movieId);
    boolean existsByListAndMovieId(MovieList list, Long movieId);
    void deleteByListIdAndMovieId(Long listId, Long movieId);
}
