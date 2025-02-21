//go run cmd/movie-backend/main.go  go to cmd/movie-backend the run---->> air
//$(go env GOPATH)/bin/air -c .air.toml
//sudo mv $(go env GOPATH)/bin/air /usr/local/bin/

package main

import (
	"context"
	"net/http"

	//"fmt"
	"log"
	"os"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
    collection *mongo.Collection
    ctx        = context.TODO()
)

func initMongo() {
    // Load env if needed
    _ = godotenv.Load()

    // Use either local or env-based URI
    uri := os.Getenv("MONGO_URI")
    if uri == "" {
        uri = "mongodb://localhost:27017/"
    }

    clientOptions := options.Client().ApplyURI(uri)
    client, err := mongo.Connect(ctx, clientOptions)
    if err != nil {
        log.Fatal("Failed to connect to MongoDB:", err)
    }

    // Ping to confirm connection
    if err := client.Ping(ctx, nil); err != nil {
        log.Fatal("Failed to ping MongoDB:", err)
    }

    // Choose your database & collection
    collection = client.Database("movie-backend").Collection("tasks")
    log.Println("Connected to MongoDB!")
}

func main() {
    // 1. Initialize Mongo connection
    initMongo()

    // 2. Start an HTTP server (port from env or default 8080)
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    // Simple example: handle root path
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("MongoDB connection successful!"))
    })

    log.Printf("Server running on http://localhost:%s\n", port)
    log.Fatal(http.ListenAndServe(":"+port, nil))
}