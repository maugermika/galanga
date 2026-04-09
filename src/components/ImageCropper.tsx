"use client";

import { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

// Menu card ratio: full-width image with h-52 (208px) in ~368px wide cards ≈ 16:9
const CARD_ASPECT_RATIO = 16 / 9;

export default function ImageCropper({
  imageSrc,
  onCrop,
  onCancel,
}: {
  imageSrc: string;
  onCrop: (file: File) => void;
  onCancel: () => void;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);

  function handleCrop() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas({
      maxWidth: 1200,
      maxHeight: 1200,
      imageSmoothingQuality: "high",
    }).toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `crop-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onCrop(file);
        }
      },
      "image/jpeg",
      0.85
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Format carte menu (16:9)</p>

      {/* Cropper */}
      <div className="rounded-lg overflow-hidden bg-gray-900">
        <Cropper
          ref={cropperRef}
          src={imageSrc}
          style={{ height: 350, width: "100%" }}
          aspectRatio={CARD_ASPECT_RATIO}
          viewMode={1}
          guides
          background={false}
          responsive
          autoCropArea={0.9}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCrop}
          className="bg-teal-dark hover:bg-teal-medium text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Valider le recadrage
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
