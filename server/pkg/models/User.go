package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Name string  `json:"name" bson:"name"`
	Email string `json:"email" bson:"email" gorm:"unique"`
	Password string `json:"password" bson:"password"`
	Bookings []primitive.ObjectID `bson:"bookings"`
}