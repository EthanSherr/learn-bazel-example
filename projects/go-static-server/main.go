package main

import (
	"compress/gzip"
	"fmt"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

var defaultPort = 3000

func main() {
	assetsDir := os.Getenv("STATIC_DIR")
	portStr := os.Getenv("PORT")
	println("Ethan debugging launch params", assetsDir, portStr)

	port, err := strconv.Atoi(portStr)
	if err != nil {
		// Parsing failed, use the default port
		fmt.Printf("Invalid port value (%s), using default port: %d\n", portStr, defaultPort)
		port = defaultPort
	}

	distAbsPath, _ := filepath.Abs(assetsDir)
	println("Debugging distAbsPath = ", distAbsPath)

	mux := http.NewServeMux()

	// Serve files directly, default to index.html
	mux.Handle("/", customFileServer(distAbsPath))

	addr := fmt.Sprintf(":%d", port)
	server := http.Server{
		Addr:    addr,
		Handler: mux, // Wrap the mux with Gzip middleware
	}

	println("Server listening on", port)

	// Start the server
	err = server.ListenAndServe()
	if err != nil {
		println("Error starting server:", err)
		os.Exit(1)
	}
}

func customFileServer(distAbsPath string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		filePath := path.Join(distAbsPath, r.URL.Path)

		info, err := os.Stat(filePath)
		if err != nil || info.IsDir() {
			filePath = path.Join(distAbsPath, "index.html")
		}

		// File exists, serve it using the default file server
		serveWithCacheHeaders(w, r, filePath)
	})
}

func serveWithCacheHeaders(w http.ResponseWriter, r *http.Request, filePath string) {
	// Open the file
	// println("Ethan debugging r.URL.Path", r.URL.Path)
	file, err := os.Open(filePath)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Set caching headers for static assets
	if !strings.HasSuffix(filePath, "index.html") {
		// println("!index.html")
		// Cache static assets with a far-future expiration date (1 year)
		expires := time.Now().AddDate(1, 0, 0)
		w.Header().Set("Cache-Control", fmt.Sprintf("public, max-age=%d", int(expires.Sub(time.Now()).Seconds())))
		w.Header().Set("Expires", expires.Format(time.RFC1123))
	} else {
		// Disable caching for index.html
		// println("index.html")
		w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
	}

	// Serve the file
	// println("filePath is", filePath)
	http.ServeContent(w, r, filePath, time.Now(), file)
}

func enableGzip(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the client supports gzip
		if strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			// Create a gzip response writer
			gzipWriter := gzip.NewWriter(w)
			defer gzipWriter.Close()

			// Set the appropriate headers
			w.Header().Set("Content-Encoding", "gzip")
			w.Header().Set("Vary", "Accept-Encoding")

			// Serve the request with the gzip writer
			next.ServeHTTP(w, r)
		} else {
			// Serve the request as usual without gzip
			next.ServeHTTP(w, r)
		}
	})
}
