package com.rewind.rewind.profile.controller;

import com.rewind.rewind.profile.dto.ProfileResponse;
import com.rewind.rewind.profile.service.ProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    @GetMapping("/me")
    public ProfileResponse me(Authentication auth) {
        return service.myProfile(auth.getName());
    }
}
