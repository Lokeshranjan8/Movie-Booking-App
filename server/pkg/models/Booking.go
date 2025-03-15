package models

import ( 
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Booking struct {
	ID         primitive.ObjectID    `bson:"_id,omitempty"`
	MovieID    string                `bson:"movie" json:"movie"`
	UserID     string                `bson:"user" json:"user"`
	Date       time.Time             `bson:"date"`
	SeatNumber int                   `bson:"seatNumber"`
}
