package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Name     string               `json:"name" bson:"name" validate:"required,min=2,max=50"`
	Email    string               `json:"email" bson:"email" validate:"required,email"`
	Password string               `json:"password,omitempty" bson:"password" validate:"required,min=8"`
	Bookings []primitive.ObjectID `json:"bookings,omitempty" bson:"bookings"`
}
