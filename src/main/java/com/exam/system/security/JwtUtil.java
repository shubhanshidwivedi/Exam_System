package com.exam.system.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    // ================= SIGNING KEY =================
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

        if (keyBytes.length < 32) {
            throw new RuntimeException("JWT secret must be at least 32 characters long");
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ================= EXTRACT USERNAME =================
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // ================= EXTRACT EXPIRATION =================
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // ================= EXTRACT CLAIM =================
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        } catch (JwtException e) {
            e.printStackTrace(); // helps debug real error
            return null;
        }
    }

    // ================= PARSE TOKEN =================
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ================= CHECK EXPIRED =================
    public Boolean isTokenExpired(String token) {
        Date exp = extractExpiration(token);
        return exp == null || exp.before(new Date());
    }

    // ================= GENERATE TOKEN =================
    public String generateToken(UserDetails userDetails) {

        Map<String, Object> claims = new HashMap<>();

        // Add ROLE claim (optional but useful)
        claims.put("role",
                userDetails.getAuthorities().stream()
                        .findFirst()
                        .map(a -> a.getAuthority())
                        .orElse("ROLE_USER"));

        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    // ================= VALIDATE TOKEN =================
    public Boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);

            return (username != null
                    && username.equals(userDetails.getUsername())
                    && !isTokenExpired(token));

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
