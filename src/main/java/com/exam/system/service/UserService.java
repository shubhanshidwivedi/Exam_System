package com.exam.system.service;

import com.exam.system.entity.User;
import com.exam.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ================= FIND BY USERNAME =================
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    // ================= FIND BY ID =================
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // ================= GET ALL USERS (OPTIONAL) =================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ================= SAVE USER (OPTIONAL) =================
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
