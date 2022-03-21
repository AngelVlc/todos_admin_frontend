package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	for _, item := range os.Environ() {
		log.Println(item)
	}

	port := fmt.Sprintf(":%v", os.Getenv("PORT"))

	log.Printf("Starting listener on port %v ...", port)

	router := NewRouter()
	if err := http.ListenAndServe(port, router); err != nil {
		log.Fatal("ListenAndServe Error: ", err)
	}
}

func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	// Create the route
	router.
		PathPrefix("/").
		Handler(http.FileServer(http.Dir("../build")))

	return router
}
