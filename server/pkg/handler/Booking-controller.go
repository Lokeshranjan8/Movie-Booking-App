package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/Lokeshranjan8/movie-backend/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func NewBooking(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var booking models.Booking
	if err := json.NewDecoder(r.Body).Decode(&booking); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("JSON Decode Error:", err)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid inputs"})
		return
	}

	///////////////////////////////////////////////////////////////////
	movieID, err := primitive.ObjectIDFromHex(booking.MovieID)
	if err != nil {
		fmt.Println("Invalid Movie ID --movieIdpart :", booking.MovieID)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid Movie ID"})
		return
	}

	userID, err := primitive.ObjectIDFromHex(booking.UserID)
	if err != nil {
		fmt.Println("Invalid User Id --useridpart", booking.UserID)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid User ID"})
	}

	objID, err := primitive.ObjectIDFromHex(movieID.Hex())
	if err != nil {
		fmt.Println("Invalid Movie ID format:", movieID)
		http.Error(w, "Invalid Movie ID objID", http.StatusBadRequest)
		return
	}
	objUserID, err := primitive.ObjectIDFromHex(userID.Hex())
	if err != nil {
		fmt.Println("Invalid User ID format:", movieID)
		http.Error(w, "Invalid User ID objID", http.StatusBadRequest)
		return
	}
	///////////////////////////////////////////////////////////////////



	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	movieCollection := client.Database("movie-backend").Collection("movies")
	userCollection := client.Database("movie-backend").Collection("user")
	bookingCollection := client.Database("movie-backend").Collection("bookings")
	var existingMovie models.Movie
	var existingUser models.User

	err = movieCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&existingMovie)
	if err != nil {
		fmt.Println("Movie not found:", err)
		http.Error(w, "Movie not found", http.StatusNotFound)
		return
	}
	err = userCollection.FindOne(ctx, bson.M{"_id": objUserID}).Decode(&existingUser)
	if err != nil {
		fmt.Println("User not found:", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	fmt.Println("✅ Movie found:", existingMovie.Title)
	fmt.Println("✅ Movie found:", existingUser.Name)

	newBooking := models.Booking{
		ID:         primitive.NewObjectID(),
		MovieID:    movieID.Hex(),
		UserID:     userID.Hex(),
		Date:       booking.Date,
		SeatNumber: booking.SeatNumber,
	}

	session, err := client.StartSession()
	if err != nil {
		fmt.Println("Failed to start MongoDB session:", err)
		http.Error(w, "Failed to start session", http.StatusInternalServerError)
		return
	}
	defer session.EndSession(ctx)
	
	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (any, error) {
		_, err := bookingCollection.InsertOne(sessCtx, newBooking)
		if err != nil {
			return nil, err
		}
		fmt.Println("✅ Booking inserted successfully.")

		_, err = movieCollection.UpdateOne(sessCtx, bson.M{"_id": movieID}, bson.M{"$push": bson.M{"bookings": newBooking.ID}})
		if err != nil {
			return nil, err
		}
		fmt.Println("✅ Booking added to movie document.")

		_, err = userCollection.UpdateOne(sessCtx, bson.M{"_id": userID}, bson.M{"$push": bson.M{"bookings": newBooking.ID}})
		if err != nil {
			return nil, err
		}
		fmt.Println("✅ Booking added to user document.")

		return nil, nil
	})

	if err != nil {
		fmt.Println("Failed to create booking:", err)
		http.Error(w,"Failed to create booking", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{"message": "Booking successful", "booking": newBooking})
	fmt.Println("Booking response sent.")
}
