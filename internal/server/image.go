package server

import (
	"bytes"
	"fmt"
	"image"
	"mime/multipart"
	"strings"

	"image/jpeg"
	"image/png"
	"github.com/gen2brain/avif"
	"github.com/gen2brain/webp"
)

type ImageData struct {
	ID              string
	Image           image.Image
	Buffer          *bytes.Buffer
	OriginalFormat  string
	ConvertedFormat string
	Error           string
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

func convertImage(imagesData []ImageData, settings Settings) []ImageData {
    for i := range imagesData {
        if imagesData[i].Error != "" {
            continue
        }

        imagesData[i].Buffer = new(bytes.Buffer)

        var err error
        switch strings.ToLower(settings.Format){
        case "png":
            err = png.Encode(imagesData[i].Buffer, imagesData[i].Image)
        case "jpg", "jpeg":
            err = jpeg.Encode(imagesData[i].Buffer, imagesData[i].Image, &jpeg.Options{
                Quality: settings.Quality,
            })
        case "webp":
            err = webp.Encode(imagesData[i].Buffer, imagesData[i].Image, webp.Options{
                Lossless: settings.Quality >= 100,
                Quality: settings.Quality,
            })
        case "avif":
            err = avif.Encode(imagesData[i].Buffer, imagesData[i].Image, avif.Options{
                Quality: settings.Quality,
            })
        default:
            err = fmt.Errorf("Image format is not supported: %v", settings.Format)
        }

        if err != nil {
            imagesData[i].Error = fmt.Sprintf("Could not convert image: %v", err)
        } else {
            imagesData[i].ConvertedFormat = settings.Format
        }
    }

    return imagesData
}
