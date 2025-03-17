package server

import (
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
)

const (
    maxFileSize = 50 << 20
    maxMemory = 10 << 20
    maxFiles = 30
)

func processUpload(w http.ResponseWriter, r *http.Request) ([]*multipart.FileHeader, error) {
    r.Body = http.MaxBytesReader(w, r.Body, maxFileSize)

    err := r.ParseMultipartForm(maxMemory)
    if err != nil {
        return nil, fmt.Errorf("Unable to parse multipart form: %v", err)
    }

    fileHeaders := r.MultipartForm.File["images"]
    if len(fileHeaders) == 0 {
        return nil, fmt.Errorf("Unable to retrieve images")
    }

    if len(fileHeaders) > maxFiles {
        return nil, fmt.Errorf("Too many files")
    }

    return fileHeaders, nil
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    fileHeaders, err := processUpload(w, r)
    if err != nil {
        log.Println(err.Error())
        http.Error(w, "Unable to process upload", http.StatusBadRequest)
        return
    }

    images, formats, err := processImage(fileHeaders)
    if err != nil {
        log.Println(err.Error())
        http.Error(w, "Unable to process images", http.StatusBadRequest)
        return
    }

    w.WriteHeader(http.StatusOK)
    log.Println(len(images), formats)
}

func NewServer() *http.Server {
    mux := http.NewServeMux()
    mux.Handle("/", Web())
    mux.HandleFunc("/api/upload", uploadHandler)

    return &http.Server{
        Addr: ":8080",
        Handler: mux,
    }
}
