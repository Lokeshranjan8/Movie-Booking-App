//go run cmd/movie-backend/main.go  go to cmd/movie-backend the run---->> air
package main

import (
	"net/http"
    "context"

	//"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Lokeshranjan8/movie-backend/pkg/repository"
)


func initMongo() *mongo.Client {
    _ = godotenv.Load()

    uri := os.Getenv("MONGO_DB")
    if uri == "" {
        uri = "mongodb://localhost:27017/"
    }

    clientOptions := options.Client().ApplyURI(uri)
    var err error
    client, err := mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal("Failed to connect to MongoDB:", err)
    }
    if err := client.Ping(context.TODO(), nil); err != nil {
        log.Fatal("Failed to ping MongoDB:", err)
    }
    log.Println("Connected to MongoDB!")
    return client
}


func main() {
    client := initMongo()
    repository.SetClient(client)

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    http.HandleFunc("/signup",repository.Signup)
    http.HandleFunc("/login",repository.Login)
    http.HandleFunc("/addadmin",repository.AddAdmin)
    http.HandleFunc("/admin/login",repository.AdminLogin)
    http.HandleFunc("/admins",repository.GetAdmins)
    http.HandleFunc("/getadminbyid/",repository.GetAdminById)

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("MongoDB connection successful!"))
    })

    log.Printf("Server running on http://localhost:%s\n", port)
    log.Fatal(http.ListenAndServe(":"+port, nil))
}
//vihaan@1234