// Preview uploaded diagram
function previewDiagram(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
    preview.innerHTML = ''; // Clear previous preview

    if (file) {
        const fileType = file.type;
        if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
        } else if (fileType === 'application/pdf') {
            preview.innerHTML = '<p>PDF uploaded: ' + file.name + '</p>';
        } else {
            preview.innerHTML = '<p>Unsupported file format.</p>';
        }
    }
}

// Simulate submission and grading (placeholder for backend)
function submitDiagram() {
    const fileInput = document.getElementById('diagramUpload');
    const results = document.getElementById('results');

    if (!fileInput.files.length) {
        results.innerHTML = '<p>Please upload a diagram first.</p>';
        return;
    }

    // Simulate backend call
    results.innerHTML = '<p>Grading in progress...</p>';
    setTimeout(() => {
        // Placeholder for backend response
        const mockResponse = {
            score: 85,
            feedback: 'Good structure, but missing a key relationship between components. Consider adding an association between Class A and Class B.'
        };
        results.innerHTML = `
            <h3>Score: ${mockResponse.score}/100</h3>
            <p><strong>Feedback:</strong> ${mockResponse.feedback}</p>
        `;
    }, 2000); // Simulate 2-second delay
}