package models

import ( 
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"	
)

type Movie struct {
	ID          primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	Title       string               `bson:"title" json:"title"`
	Description string               `bson:"description" json:"description"`
	Actors      []string             `bson:"actors" json:"actors"`
	ReleaseDate time.Time            `bson:"releaseDate" json:"releaseDate"`
	PosterUrl   string               `bson:"posterUrl" json:"posterUrl"`
	Featured    bool                 `bson:"featured,omitempty" json:"featured,omitempty"`
	Bookings    []primitive.ObjectID `bson:"bookings,omitempty" json:"bookings,omitempty"`
	Admin       primitive.ObjectID   `bson:"admin" json:"admin"`
}