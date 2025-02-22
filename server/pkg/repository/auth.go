package repository

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"
    //"github.com/gorilla/mux"
	"github.com/Lokeshranjan8/movie-backend/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
	//"github.com/dgrijalva/jwt-go"
	"github.com/golang-jwt/jwt/v4"

)

var client *mongo.Client
func SetClient(mongoClient *mongo.Client) {
	client = mongoClient
}


func getHash(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println("Error hashing password:", err)
	}
	return string(hash)
}

func Signup(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")

	var user models.User
	// Decode the incoming JSON request into the User struct.
	if err := json.NewDecoder(request.Body).Decode(&user); err != nil {
		response.WriteHeader(http.StatusBadRequest)
		response.Write([]byte(`{"message": "Invalid request"}`))
		return
	}

	user.Password = getHash([]byte(user.Password))

	collection := client.Database("movie-backend").Collection("user")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, user)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}

	json.NewEncoder(response).Encode(result)
}


var SECRET_KEY = []byte("gosecretkey")


func Login(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	var user models.User
	var dbUser models.User

	if err := json.NewDecoder(request.Body).Decode(&user); err != nil {
		response.WriteHeader(http.StatusBadRequest)
		response.Write([]byte(`{"message": "Invalid request"}`))
		return
	}

	collection := client.Database("movie-backend").Collection("user")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&dbUser)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}

	if passErr := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)); passErr != nil {
		log.Println("Password comparison error:", passErr)
		response.Write([]byte(`{"message": "Wrong password!"}`))
		return
	}

	jwtToken, err := GenerateJWT()
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}

	response.Write([]byte(`{"token": "` + jwtToken + `"}`))
	log.Println("login successfull")
}

func GenerateJWT()(string,error){
	token:=jwt.New(jwt.SigningMethodHS256)
	tokenString, err :=  token.SignedString(SECRET_KEY)
	if err !=nil{
		log.Println("Error in JWT token generation")
		return "",err
	}
	return tokenString, nil
}