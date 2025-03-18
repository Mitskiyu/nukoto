package server

import (
	"bytes"
	"fmt"
	"image"
	"mime/multipart"

	_ "image/jpeg"
	_ "image/png"
	_ "github.com/gen2brain/avif"
	_ "github.com/gen2brain/webp"
)

type ImageData struct {
	ID              string        `json:"-"`
	Image           image.Image   `json:"-"`
	OriginalFormat  string        `json:"originalFormat,omitempty"`
	ConvertedFormat string        `json:"convertedFormat,omitempty"`
	Buffer          *bytes.Buffer `json:"-"`
	Error           string        `json:"error,omitempty"`
}

func processImage(fileHeaders []*multipart.FileHeader, ids []string) []ImageData {
    imagesData := make([]ImageData, 0, len(fileHeaders))

    for i, fh := range fileHeaders {
            data := ImageData {
                ID: ids[i],
            }

            file, err := fh.Open()
            if err != nil {
                data.Error = fmt.Sprintf("Could not open file: %v", err)
                imagesData = append(imagesData, data)
                continue
            }

            img, format, err := image.Decode(file)
            file.Close()
            if err != nil {
                data.Error = fmt.Sprintf("Could not decode image: %v", err)
                imagesData = append(imagesData, data)
                continue
            }

            data.Image = img
            data.OriginalFormat = format
            imagesData = append(imagesData, data)
    }

    return imagesData
}
