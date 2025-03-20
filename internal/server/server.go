package server

import (
	"encoding/base64"
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

type ImageResponse struct {
    ID              string `json:"id"`
    OriginalFormat  string `json:"originalFormat"`
    ConvertedFormat string `json:"convertedFormat"`
    Data            string `json:"data"`
    Error           bool   `json:"error"`
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

func processResponse(imagesData []ImageData) []ImageResponse {
    imagesResponse := make([]ImageResponse, 0, len(imagesData))
    var res ImageResponse

    for _, imageData := range imagesData {
        res = ImageResponse {
            ID: imageData.ID,
            OriginalFormat: imageData.OriginalFormat,
            ConvertedFormat: imageData.ConvertedFormat,
            Error: imageData.Error != "",
        }

        if imageData.Buffer != nil && res.Error == false {
            res.Data = base64.StdEncoding.EncodeToString(imageData.Buffer.Bytes())
        }

        imagesResponse = append(imagesResponse, res)

    }
    return imagesResponse

}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

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

    var imageErrors int
    imagesData := processImage(fileHeaders, ids)

    imagesData = convertImage(imagesData, settings)
    for _, imageData := range imagesData {
        if imageData.Error != "" {
            imageErrors++
        }
    }

    if imageErrors == len(fileHeaders) {
        http.Error(w, "Could not process images", http.StatusBadRequest)
        return
    }

    imagesResponse := processResponse(imagesData)

    if imageErrors != 0 {
        for _, imageData := range imagesData {
            log.Printf("Could not process all images: %v", imageData.Error)
        }
        w.WriteHeader(http.StatusPartialContent)
    } else {
        w.WriteHeader(http.StatusOK)
    }

    if err := json.NewEncoder(w).Encode(imagesResponse); err != nil {
        log.Printf("Could not encode response: %v", err)
        http.Error(w, "Unable to encode response", http.StatusInternalServerError)
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
