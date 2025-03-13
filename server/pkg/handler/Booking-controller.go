package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/Lokeshranjan8/movie-backend/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func NewBooking( w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-Type","application/json")

	var booking models.Booking
	if err := json.NewDecoder(r.Body).Decode(&booking); err != nil{
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message":"invalid inputs"})
		return 
	}

	movieID,_ := primitive.ObjectIDFromHex(booking.MovieID.Hex())
	userID,_ := primitive.ObjectIDFromHex(booking.UserID.Hex())

	movieCollection := client.Database("movieDB").Collection("movies")
	userCollection  := client.Database("movieDB").Collection("users")
	bookingCollection := client.Database("movieDB").Collection("bookings")

	var existingMovie models.Movie
	var existingUser models.User

	err := movieCollection.FindOne(context.TODO(), bson.M{"_id": movieID}).Decode(&existingMovie)
	if err != nil {
		http.Error(w, "Movie not found", http.StatusNotFound)
		return
	}
	err = userCollection.FindOne(context.TODO(), bson.M{"_id": userID}).Decode(&existingUser)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	newBooking := models.Booking{
		ID:         primitive.NewObjectID(),
		MovieID:    booking.MovieID,
		UserID:     booking.UserID,
		Date:       booking.Date,
		SeatNumber: booking.SeatNumber,
	}

	// MongoDB Transaction to update user, movie and create booking
	session, err := client.StartSession()
	if err != nil {
		http.Error(w, "Failed to start session", http.StatusInternalServerError)
		return
	}
	defer session.EndSession(context.Background())

	_, err = session.WithTransaction(context.Background(), func(sessCtx mongo.SessionContext) (interface{}, error) {
		// Insert booking in the booking collection
		_, err := bookingCollection.InsertOne(sessCtx, newBooking)
		if err != nil {
			return nil, err
		}

		// Push booking ID to Movie's `bookings[]`
		_, err = movieCollection.UpdateOne(sessCtx, bson.M{"_id": movieID}, bson.M{"$push": bson.M{"bookings": newBooking.ID}})
		if err != nil {
			return nil, err
		}

		// Push booking ID to User's `bookings[]`
		_, err = userCollection.UpdateOne(sessCtx, bson.M{"_id": userID}, bson.M{"$push": bson.M{"bookings": newBooking.ID}})
		if err != nil {
			return nil, err
		}

		return nil, nil
	})

	if err != nil {
		http.Error(w, "Failed to create booking", http.StatusInternalServerError)
		return
	}

	// Return successful response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{"booking": newBooking})
}