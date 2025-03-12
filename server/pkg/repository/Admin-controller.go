package repository

//	"github.com/Lokeshranjan8/movie-backend/pkg/models"

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
	"time"
	"github.com/Lokeshranjan8/movie-backend/pkg/models"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

var SECRET_KEY1 = []byte("gosecretkey")

func AddAdmin(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-Type","application/json")

	var admin models.Admin
	if err := json.NewDecoder(r.Body).Decode(&admin); err != nil{
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid inputs"})
		return
	}

	if admin.Email =="" || admin.Password ==""{
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message":"inavlid emails and inputs"})
		return
	}

	collection := client.Database("movie-backend").Collection("admin")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var existingAdmin models.Admin
	if err := collection.FindOne(ctx,bson.M{"email":admin.Email}).Decode(&existingAdmin); err == nil{
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message":"admin already exists"})
		return

	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(admin.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Error hashing password"})
		return
	}
	admin.Password = string(hashedPassword)
	result,err := collection.InsertOne(ctx,admin)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(result)
}

// AdminLogin authenticates an admin and returns a JWT.

func AdminLogin( w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-Type","application/json")

	//read
	var input struct{
		Email string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err !=nil{
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid Inputs"})
		return
	}

	if input.Email == "" || input.Password == "" {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]string{"message": "Email and password are required"})
		return
	}
	collection := client.Database("movie-backend").Collection("admin")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var admin models.Admin
	if err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&admin); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Admin not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(input.Password)); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Incorrect Password"})
		return
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = admin.ID.Hex() // Convert ObjectID to hex string.
	claims["exp"] = time.Now().Add(7 * 24 * time.Hour).Unix() // Expires in 7 days.

	tokenString, err := token.SignedString(SECRET_KEY1)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Error generating token"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "authentication complete",
		"token": tokenString,
		"id": admin.ID.Hex(),
	})
}

func GetAdmins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	collection := client.Database("movie-backend").Collection("admin")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var admins []models.Admin
	if err = cursor.All(ctx, &admins); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"admins": admins})
}

func GetAdminById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	idParam := params["id"]

	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid admin id"})
		return
	}

	collection := client.Database("movie-backend").Collection("admin")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var admin models.Admin
	if err := collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&admin); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Cannot find admin"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"admin": admin})
}