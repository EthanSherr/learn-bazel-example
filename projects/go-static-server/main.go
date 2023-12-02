package main

import (
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	// Define the directory where your static assets are stored
	assetsDir := "./static/assets"

	// Create a new router
	mux := http.NewServeMux()

	// Handle requests to /assets by serving files directly
	mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir(assetsDir))))

	// Handle all other requests by serving the React index.html
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Adjust the path to your actual build directory
		file := filepath.Join("./static", "index.html")
		http.ServeFile(w, r, file)
	})

	// Set up and start the server
	port := ":3000" // Change this to the desired port
	server := http.Server{
		Addr:    port,
		Handler: mux,
	}

	// Inform the user about the server starting
	println("Server listening on", port)

	// Start the server
	err := server.ListenAndServe()
	if err != nil {
		// Handle error, e.g., log it or print to console
		println("Error starting server:", err)
		os.Exit(1)
	}
}
