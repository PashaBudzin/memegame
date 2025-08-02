package main

import (
	"log"
	"net/http"
	"path/filepath"

	"github.com/PashaBudzin/memegame/routes"
	"github.com/gorilla/mux"
)

const (
	STATIC_DIR = "./web"
	PORT       = ":8080"
)

func main() {
	r := mux.NewRouter()

	apiSubrouter := r.PathPrefix("/api").Subrouter()

	apiSubrouter.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello, world"))
	}).Methods("GET")

	r.HandleFunc("/ws", routes.HandleWebsockets)

	staticDir := http.StripPrefix("/", http.FileServer(http.Dir(STATIC_DIR)))
	r.PathPrefix("/").Handler(staticDir)

	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(STATIC_DIR, "index.html"))
	})

	log.Println("server running on port ", PORT)

	if err := http.ListenAndServe(PORT, r); err != nil {
		log.Fatal(err)
	}
}
