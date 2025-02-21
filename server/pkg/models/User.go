package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name string  `json:"name" bson:"name"`
	Email string `json:"email" bson:"email" gorm:"unique"`
	Password string `json:"password" bson:"password"`
}