<?php

namespace App\Services;
use File;

class ImageService
{
    public function getFileName($file) {
        return $file->getClientOriginalName();
    }

    public function getFileSize($file) {
        return $file->getSize();
    }

    public function getFileType($file) {
        return $file->getMimeType();
    }

    public function checkFile($file) {
        $type = $this->getFileType($file);
        $size = $this->getFileSize($file);
        $type_img = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        if(in_array($type, $type_img)){
            if($size <= 2097152) {
                return 1;
            }else{
                return 0;
            }
        }
        return -1;
    }

    public function deleteFile($path)
    {
        if(File::exists($path)) {
            File::delete($path);
        }
    }

    public function moveImage($file, $path) {
        $fileName = $this->getFileName($file);
        if($this->checkFile($file) == 1) {
            $fileNameNew = rand() . '-' . utf8tourl($fileName);
            if($file->move($path, $fileNameNew)) {
                return $fileNameNew;
            }
        }
        return 0;
    }
}
