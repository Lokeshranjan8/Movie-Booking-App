package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/Lokeshranjan8/movie-backend/pkg/models"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var SECRET_KEY2 = []byte("gosecretkey")

func AddMovie(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract token from header
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, "Token not found", http.StatusUnauthorized)
		return
	}
	tokenString = tokenString[len("Bearer "):]

	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return SECRET_KEY2, nil
	})

	if err != nil {
		http.Error(w, "Invalid Token", http.StatusUnauthorized)
		return
	}

	adminID, ok := claims["id"].(string)
	if !ok {
		http.Error(w, "Invalid Token", http.StatusUnauthorized)
		return
	}

	var movie models.Movie
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields() // This will catch extra fields in the body

	if err := decoder.Decode(&movie); err != nil {
		http.Error(w, "Invalid Inputs", http.StatusBadRequest)
		return
	}

	movie.ID = primitive.NewObjectID()
	movie.ReleaseDate = time.Now()
	movie.Admin, _ = primitive.ObjectIDFromHex(adminID)

	movieCollection := client.Database("movieDB").Collection("movies")
	adminCollection := client.Database("movieDB").Collection("admin")

	session, err := client.StartSession()
	if err != nil {
		http.Error(w, "Failed to start session", http.StatusInternalServerError)
		return
	}
	defer session.EndSession(context.Background())

	_, err = movieCollection.InsertOne(context.Background(), movie)
	if err != nil {
		http.Error(w, "Failed to add movie", http.StatusInternalServerError)
		return
	}

	_, err = adminCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": movie.Admin},
		bson.M{"$push": bson.M{"addedMovies": movie.ID}},
	)
	if err != nil {
		http.Error(w, "Failed to link with Admin", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"movie": movie,
	})
}

func GetAllMovies(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	movieCollection := client.Database("movieDB").Collection("movies")
	cursor, err := movieCollection.Find(context.Background(), bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch movies", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var movies []models.Movie
	if err := cursor.All(context.Background(), &movies); err != nil {
		http.Error(w, "Error while decoding", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(movies)
}
// {
// 	"title": "Avengers Endgame",
// 	"description": "The final fight against Thanos",
// 	"releaseDate": "2024-05-15T00:00:00Z",
// 	"posterUrl": "https://image-link.com",
// 	"featured": true,
// 	"actors": ["Robert Downey Jr.", "Chris Evans"]
//   }
  