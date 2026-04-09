"use client";

import { useState, useRef, useCallback } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type AspectOption = { label: string; value: number | undefined };

const ASPECT_OPTIONS: AspectOption[] = [
  { label: "Libre", value: undefined },
  { label: "Carré", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
];

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
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const handleAspectChange = useCallback(
    (value: number | undefined) => {
      setAspect(value);
      const cropper = cropperRef.current?.cropper;
      if (cropper) {
        cropper.setAspectRatio(value || NaN);
      }
    },
    []
  );

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
      {/* Aspect ratio buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 self-center mr-1">Format :</span>
        {ASPECT_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => handleAspectChange(opt.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              aspect === opt.value
                ? "bg-teal-dark text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Cropper */}
      <div className="rounded-lg overflow-hidden bg-gray-900">
        <Cropper
          ref={cropperRef}
          src={imageSrc}
          style={{ height: 350, width: "100%" }}
          aspectRatio={aspect || NaN}
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
