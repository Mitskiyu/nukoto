package server

import (
	"bytes"
	"fmt"
	"image"
	"mime/multipart"
	"strings"
	"sync"

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
	imagesData := make([]ImageData, len(fileHeaders))

	var wg sync.WaitGroup
	semaphore := make(chan struct{}, 2)

	for i := range fileHeaders {
		wg.Add(1)

		go func(i int) {
			defer wg.Done()

			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			data := ImageData{
				ID: ids[i],
			}

			file, err := fileHeaders[i].Open()
			if err != nil {
				data.Error = fmt.Sprintf("Could not open file: %v", err)
				imagesData[i] = data
				return
			}
			defer file.Close()
			img, format, err := image.Decode(file)
			if err != nil {
				data.Error = fmt.Sprintf("Could not decode image: %v", err)
				imagesData[i] = data
				return
			}

			data.Image = img
			data.OriginalFormat = format
			imagesData[i] = data
		}(i)
	}

	wg.Wait()
	return imagesData
}

func convertImage(imagesData []ImageData, settings Settings) []ImageData {
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, 2)

	for i := range imagesData {
		if imagesData[i].Error != "" {
			continue
		}

		wg.Add(1)

		go func(i int) {
			defer wg.Done()

			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			imagesData[i].Buffer = new(bytes.Buffer)

			var err error
			switch strings.ToLower(settings.Format) {
			case "png":
				err = png.Encode(imagesData[i].Buffer, imagesData[i].Image)
			case "jpg", "jpeg":
				err = jpeg.Encode(imagesData[i].Buffer, imagesData[i].Image, &jpeg.Options{
					Quality: settings.Quality,
				})
			case "webp":
				err = webp.Encode(imagesData[i].Buffer, imagesData[i].Image, webp.Options{
					Lossless: settings.Quality >= 100,
					Quality:  settings.Quality,
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
		}(i)

	}

	wg.Wait()
	return imagesData
}
