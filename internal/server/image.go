package server

import (
	"fmt"
	"image"
	"mime/multipart"

    _ "image/png"
    _ "image/jpeg"
    _ "github.com/gen2brain/avif"
    _ "github.com/gen2brain/webp"
)

func processImage(fileHeaders []*multipart.FileHeader) ([]image.Image, []string, error) {
    var imgs []image.Image
    var fmts []string

    for _, fh := range fileHeaders {
            file, err := fh.Open()
            if err != nil {
                return nil, nil, err
            }

            img, format, err := image.Decode(file)
            file.Close()
            if err != nil {
                return nil, nil, err
            }

            imgs = append(imgs, img)
            fmts = append(fmts, format)
    }

    if len(imgs) == 0 {
        return nil, nil, fmt.Errorf("Could not process any images")
    }

    return imgs, fmts, nil
}

