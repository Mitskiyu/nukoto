package server

import (
	"encoding/json"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
)

type Settings struct {
    Format  string `json:"format"`
    Quality int    `json:"quality"`
}

const (
    maxFileSize = 50 << 20
    maxMemory = 10 << 20
    maxFiles = 30
)

func processUpload(w http.ResponseWriter, r *http.Request) ([]*multipart.FileHeader, []string, Settings, error) {
    r.Body = http.MaxBytesReader(w, r.Body, maxFileSize)
    err := r.ParseMultipartForm(maxMemory)
    if err != nil {
        return nil, nil, Settings{}, fmt.Errorf("Unable to parse multipart form: %v", err)
    }

    fileHeaders := r.MultipartForm.File["images"]
    if len(fileHeaders) == 0 {
        return nil, nil, Settings{}, fmt.Errorf("Unable to retrieve images")
    }

    ids := r.MultipartForm.Value["image-id"]
    if len(ids) == 0 {
        return nil, nil, Settings{}, fmt.Errorf("Unable to retrieve ids")
    }

    settingsValue := r.FormValue("settings")
    var settings Settings
    err = json.Unmarshal([]byte(settingsValue), &settings)
    if err != nil {
        return nil, nil, Settings{}, fmt.Errorf("Unable to decode settings: %v", err)
    }

    if len(fileHeaders) > maxFiles {
        return nil, nil, Settings{}, fmt.Errorf("Too many files")
    }

    if len(fileHeaders) != len(ids) {
        return nil, nil, Settings{}, fmt.Errorf("Number of files does not match number of ids")
    }

    return fileHeaders, ids, settings, nil
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    fileHeaders, ids, settings, err := processUpload(w, r)
    if err != nil {
        log.Println(err.Error())
        http.Error(w, "Unable to process upload", http.StatusBadRequest)
        return
    }

    imagesData := processImage(fileHeaders, ids)
    for _, imageData := range imagesData {
        if imageData.Error != "" {
            log.Println(imageData.Error)
            http.Error(w, "Unable to process images", http.StatusBadRequest)
            return
        }
    }

    imagesData = convertImage(imagesData, settings)

    w.WriteHeader(http.StatusOK)
    for _, imageData := range imagesData {
        log.Println(imageData.OriginalFormat, imageData.ConvertedFormat, settings, imageData.Error)
    }
}

func NewServer() *http.Server {
    mux := http.NewServeMux()
    mux.Handle("/", web())
    mux.HandleFunc("/api/upload", uploadHandler)

    return &http.Server{
        Addr: ":8080",
        Handler: mux,
    }
}
