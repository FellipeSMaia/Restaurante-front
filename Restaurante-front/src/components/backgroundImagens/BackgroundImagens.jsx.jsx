import React, { useState, useRef, useEffect } from "react";

const BackgroundImagens = ({
  webpSrc,
  fallbackSrc,
  alt,
  className = "",
  loadingComponent: CustomLoading = null,
  errorComponent: CustomError = null,
  rootMargin = "50px",
  threshold = 0.1,
  loadingText = "Carregando...",
  errorText = "Sem imagem disponível",
  errorEmoji = "🍽️",
  onLoad = null,
  onError = null,
  enableIntersectionObserver = true,
  preload = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(!enableIntersectionObserver);
  const [finalSrc, setFinalSrc] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    if (!enableIntersectionObserver) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [enableIntersectionObserver, threshold, rootMargin]);

  useEffect(() => {
    if (preload && webpSrc) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = webpSrc;
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [preload, webpSrc]);

  useEffect(() => {
    if (!isVisible || imageLoaded || imageError) return;

    const img = new Image();

    img.onload = () => {
      setImageLoaded(true);
      setFinalSrc(webpSrc);
      onLoad && onLoad();
    };

    img.onerror = () => {
      if (fallbackSrc) {
        const imgFallback = new Image();
        imgFallback.onload = () => {
          setImageLoaded(true);
          setFinalSrc(fallbackSrc);
          onLoad && onLoad();
        };
        imgFallback.onerror = () => {
          setImageError(true);
          onError && onError();
        };
        imgFallback.src = fallbackSrc;
      } else {
        setImageError(true);
        onError && onError();
      }
    };

    img.src = webpSrc;
  }, [
    isVisible,
    imageLoaded,
    imageError,
    webpSrc,
    fallbackSrc,
    onLoad,
    onError,
  ]);

  const DefaultLoadingPlaceholder = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 animate-pulse">
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-orange-600 text-lg font-semibold">
            {loadingText}
          </div>
        </div>
      </div>
    </div>
  );

  const DefaultErrorFallback = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">{errorEmoji}</div>
          <div className="text-orange-600 text-lg font-semibold">
            {errorText}
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingComponent = CustomLoading || DefaultLoadingPlaceholder;
  const ErrorComponent = CustomError || DefaultErrorFallback;

  return (
    <div ref={containerRef} className="w-full h-full">
      {isVisible && !imageLoaded && !imageError && <LoadingComponent />}
      {imageError && <ErrorComponent />}
      {imageLoaded && finalSrc && (
        <img
          src={finalSrc}
          alt={alt}
          className={`opacity-0 transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : ""
          } ${className}`}
          draggable={false}
        />
      )}
    </div>
  );
};

export default BackgroundImagens;
