import React, { useState, useCallback, useMemo, memo } from 'react';

const AppImage = memo(function AppImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  fill = false,
  onClick,
  fallbackSrc = '/assets/images/no_image.png',
  loading = 'lazy',
  style = {},
  priority: _priority,
  unoptimized: _unoptimized,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  }, [hasError, imageSrc, fallbackSrc]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const imageClassName = useMemo(() => {
    const classes = [className];
    if (isLoading) classes.push('bg-muted/40 animate-pulse');
    if (onClick) classes.push('cursor-pointer hover:opacity-90 transition-opacity duration-200');
    return classes.filter(Boolean).join(' ');
  }, [className, isLoading, onClick]);

  if (fill) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover ${imageClassName}`}
          onError={handleError}
          onLoad={handleLoad}
          onClick={onClick}
          loading={loading}
          style={style}
          {...props}
        />
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={imageClassName}
      onError={handleError}
      onLoad={handleLoad}
      onClick={onClick}
      loading={loading}
      style={style}
      {...props}
    />
  );
});

AppImage.displayName = 'AppImage';

export default AppImage;
