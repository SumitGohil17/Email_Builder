export const generateHtml = (canvasElements) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Preview</title>
    <style>
        body { margin: 0; padding: 20px; }
        .canvas-container {
            position: relative;
            width: 800px;
            margin: 0 auto;
            min-height: 600px;
            background: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        @media (max-width: 820px) {
            .canvas-container {
                width: 100%;
                transform: scale(1);
                transform-origin: top center;
            }
        }
    </style>
</head>
<body>
    ${canvasElements}
</body>
</html>`;
};