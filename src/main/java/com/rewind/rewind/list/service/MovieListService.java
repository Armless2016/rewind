package com.rewind.rewind.list.service;

import com.rewind.rewind.list.dto.*;
import com.rewind.rewind.list.entity.ListItem;
import com.rewind.rewind.list.entity.ListType;
import com.rewind.rewind.list.entity.MovieList;
import com.rewind.rewind.list.repo.ListItemRepository;
import com.rewind.rewind.list.repo.MovieListRepository;
import com.rewind.rewind.movie.repo.MovieRepository;
import com.rewind.rewind.user.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieListService {

    private final MovieListRepository lists;
    private final ListItemRepository items;
    private final UserRepository users;
    private final MovieRepository movies;

    public MovieListService(MovieListRepository lists, ListItemRepository items, UserRepository users, MovieRepository movies) {
        this.lists = lists;
        this.items = items;
        this.users = users;
        this.movies = movies;
    }

    public List<MovieListResponse> myLists(String email) {
        var user = users.findByEmail(email).orElseThrow();
        return lists.findAllByUser(user).stream()
                .map(l -> new MovieListResponse(l.getId(), l.getName(), l.getDescription(), l.getListType(), l.getIsPublic()))
                .toList();
    }

    public MovieListResponse create(String email, CreateListRequest req) {
        var user = users.findByEmail(email).orElseThrow();

        MovieList list = new MovieList();
        list.setUser(user);
        list.setName(req.getName());
        list.setDescription(req.getDescription());
        list.setListType(ListType.CUSTOM);
        list.setIsPublic(req.getIsPublic() != null && req.getIsPublic());

        MovieList saved = lists.save(list);

        return new MovieListResponse(saved.getId(), saved.getName(), saved.getDescription(), saved.getListType(), saved.getIsPublic());
    }

    public void addItem(String email, Long listId, AddListItemRequest req) {
        var user = users.findByEmail(email).orElseThrow();
        var list = lists.findByIdAndUser(listId, user)
                .orElseThrow(() -> new IllegalArgumentException("List not found"));

        if (items.existsByListAndMovieId(list, req.getMovieId())) {
            return; // вже є, не дублюємо
        }

        var movie = movies.findById(req.getMovieId())
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        ListItem item = new ListItem();
        item.setList(list);
        item.setMovie(movie);
        item.setPosition(req.getPosition());

        items.save(item);
    }

    public void removeItem(String email, Long listId, Long movieId) {
        var user = users.findByEmail(email).orElseThrow();
        var list = lists.findByIdAndUser(listId, user)
                .orElseThrow(() -> new IllegalArgumentException("List not found"));

        items.deleteByListIdAndMovieId(list.getId(), movieId);
    }
}
