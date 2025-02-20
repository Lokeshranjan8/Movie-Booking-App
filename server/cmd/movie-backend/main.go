//go run cmd/movie-backend/main.go  go to cmd/movie-backend the run---->> air
//$(go env GOPATH)/bin/air -c .air.toml
//sudo mv $(go env GOPATH)/bin/air /usr/local/bin/

package main

import (
	"fmt"
	"log"
	"os"
	"github.com/joho/godotenv"
	"http"
)

func main() {
	err := godotenv.Load()
	log.Print("hello")
	if err != nil {
		log.Println(err)
		log.Fatal("error loading file")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s ssl=disable",
		os.Getenv("HOST"), os.Getenv("USER"), os.Getenv("PASSWORD"), os.Getenv("DBNAME"), os.Getenv("PORT"),
	)

	log.Println("Connected to database successfully")
	log.Printf("starting server at port %s", os.Getenv("PORT"))
	log.Println("ssss",dsn)
	log.Fatal(http.ListenAndServe(":" + os.Getenv("PORT"), r))

}

// func main() {
// 	router := mux.NewRouter()
// 	router.Use(middleware.LoggingMiddleware)

// 	router.HandleFunc("/chat", handler.ChatHandler).Methods("POST", "OPTIONS")
// 	log.Printf("Starting server on port %s", port)
// 	if err := http.ListenAndServe(":"+port, router); err != nil {
// 		log.Fatalf("Could not start server: %s\n", err)
// 	}
// }
