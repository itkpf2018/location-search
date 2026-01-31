// Utility function to create a canvas element for image manipulation
export function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })
}

// Get radians from degrees
export function getRadianAngle(degreeValue: number): number {
    return (degreeValue * Math.PI) / 180
}

// Rotate size based on angle
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

// Crop image to specified area
export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<string> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    const rotRad = getRadianAngle(rotation)

    // Calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // Set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // Translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // Draw rotated image
    ctx.drawImage(image, 0, 0)

    // Create data from the rotated image
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    // Set canvas width to final desired crop size
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0)

    // As Base64 string
    return canvas.toDataURL('image/jpeg', 0.95)
}

// Apply filters to image
export async function applyFilters(
    imageSrc: string,
    filters: {
        brightness?: number
        contrast?: number
        saturation?: number
    }
): Promise<string> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    canvas.width = image.width
    canvas.height = image.height

    // Apply CSS filters
    const filterString = [
        filters.brightness ? `brightness(${filters.brightness}%)` : '',
        filters.contrast ? `contrast(${filters.contrast}%)` : '',
        filters.saturation ? `saturate(${filters.saturation}%)` : '',
    ]
        .filter(Boolean)
        .join(' ')

    ctx.filter = filterString
    ctx.drawImage(image, 0, 0)

    return canvas.toDataURL('image/jpeg', 0.95)
}
