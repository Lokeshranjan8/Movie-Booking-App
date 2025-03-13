package models

import ( 
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Booking struct {
	ID         primitive.ObjectID    `bson:"_id,omitempty"`
	MovieID    primitive.ObjectID    `bson:"movie,omitempty"`
	UserID     primitive.ObjectID    `bson:"user"`
	Date       time.Time             `bson:"date"`
	SeatNumber int                   `bson:"seatNumber"`

}