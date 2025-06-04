
// Preview uploaded diagram
function previewDiagram(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
    preview.innerHTML = ''; // Clear previous preview

    if (file) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            preview.innerHTML = '<p>File too large (max 10MB).</p>';
            alert('File too large (max 10MB).');
            fileInput.value = '';
            return;
        }

        const fileType = file.type;
        if (fileType === 'image/png') {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
        } else {
            preview.innerHTML = '<p>Only PNG files are supported.</p>';
            alert('Only PNG files are supported.');
            fileInput.value = '';
            return;
        }
        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = () => {
            fileInput.value = '';
            preview.innerHTML = '';
        };
        preview.appendChild(removeBtn);
    }
}

// Drag-and-drop functionality
const uploadBox = document.querySelector('.upload-box');
const fileInput = document.getElementById('diagramUpload');
if (uploadBox && fileInput) {
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.backgroundColor = '#e6f0ff';
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.style.backgroundColor = 'transparent';
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.backgroundColor = 'transparent';
        fileInput.files = e.dataTransfer.files;
        previewDiagram({ target: fileInput });
    });
}

// Feedback library for random generation
const feedbackLibrary = {
    overall: [
        {
            details: 'Your diagram is very similar to the reference model, with only minor adjustments needed.',
            score: 85
        },
        {
            details: 'Some parts of your diagram match well, but consider reviewing connections and labels.',
            score: 80
        },
        {
            details: 'The diagram has some correct elements, but significant revisions are needed for accuracy.',
            score: 70
        }
    ],
    semantic: [
        {
            details: 'Labels generally match the reference model, indicating good semantic alignment.',
            score: 25
        },
        {
            details: 'Minor label refinements may improve semantic match with the reference.',
            score: 22
        },
        {
            details: 'Consider re-evaluating class names and properties for better semantic accuracy.',
            score: 18
        }
    ],
    structural: [
        {
            details: 'Structure closely mirrors the reference model, with accurate relationships.',
            score: 35
        },
        {
            details: 'Some structural elements differ; review associations and multiplicities.',
            score: 30
        },
        {
            details: 'Reassess your class layout and relationships to align with the reference.',
            score: 25
        }
    ]
};

// Fixed feedback for specific files
const fixedFeedback = {
    'uml1.png': {
        overall: {
            details: 'Your diagram is very similar to the reference model, with only minor adjustments needed.',
            score: 25,
            max: 30
        },
        semantic: [
            {
                className: 'Driver',
                details: 'Labels generally match reference, with accurate attribute names.',
                score: 10,
                max: 10
            },
            {
                className: 'Vehicle',
                details: 'Labels align well with the reference, reflecting correct semantics.',
                score: 10,
                max: 10
            },
            {
                className: 'Car',
                details: 'Labels are consistent with the reference model, ensuring clarity.',
                score: 8,
                max: 10
            }
        ],
        structural: {
            details: 'Structure closely mirrors reference, with correct associations and multiplicities.',
            score: 35,
            max: 40
        }
    },
    'uml2.png': {
        overall: {
            details: 'Some parts match well, but consider reviewing connections for better alignment.',
            score: 20,
            max: 30
        },
        semantic: [
            {
                className: 'Operator',
                details: 'Minor label refinements may improve semantic match with the reference.',
                score: 8,
                max: 10
            },
            {
                className: 'Vehicle',
                details: 'Labels generally match reference, with minor adjustments needed.',
                score: 9,
                max: 10
            },
            {
                className: 'Car',
                details: 'Labels align with the reference, ensuring good semantic clarity.',
                score: 9,
                max: 10
            }
        ],
        structural: {
            details: 'Some structural elements differ; review associations and dependencies.',
            score: 30,
            max: 40
        }
    },
    'uml3.png': {
        overall: {
            details: 'Some parts match well, but significant revisions are needed for accuracy.',
            score: 15,
            max: 30
        },
        semantic: [
            {
                className: 'Car',
                details: 'Minor label refinements may improve semantic match with the reference.',
                score: 8,
                max: 10
            },
            {
                className: 'Vehicle',
                details: 'Labels generally match reference, with correct attribute naming.',
                score: 9,
                max: 10
            },
            {
                className: 'Flight',
                details: 'Consider re-evaluating class names and properties for semantic accuracy.',
                score: 6,
                max: 10
            }
        ],
        structural: {
            details: 'Reassess your class layout and relationships to align with the reference.',
            score: 5,
            max: 40
        }
    }
};

// Submit diagram with mock API call
async function submitDiagram() {
    const fileInput = document.getElementById('diagramUpload');
    const results = document.getElementById('results');

    if (!fileInput.files.length) {
        results.innerHTML = '<p>Please upload a diagram first.</p>';
        return;
    }

    results.innerHTML = `
        <p>Grading in progress...</p>
        <div class="progress-bar" style="width: 100%; height: 10px; background: #ddd; border-radius: 5px;">
            <div style="width: 0%; height: 100%; background: #003087; transition: width 2s ease;"></div>
        </div>
    `;

    try {
        // Simulate API call
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({ file: fileInput.files[0].name }),
            headers: { 'Content-Type': 'application/json' }
        });
        await response.json();

        setTimeout(() => {
            const progress = results.querySelector('.progress-bar div');
            progress.style.width = '100%';
            setTimeout(() => {
                // Check for specific files
                const fileName = fileInput.files[0].name.toLowerCase();
                let feedback;
                if (fileName in fixedFeedback) {
                    feedback = fixedFeedback[fileName];
                } else {
                    // Random feedback
                    const getRandomFeedback = (category) => feedbackLibrary[category][Math.floor(Math.random() * feedbackLibrary[category].length)];
                    feedback = {
                        overall: getRandomFeedback('overall'),
                        semantic: [
                            { className: 'Class A', ...getRandomFeedback('semantic') },
                            { className: 'Class B', ...getRandomFeedback('semantic') },
                            { className: 'Class C', ...getRandomFeedback('semantic') }
                        ],
                        structural: getRandomFeedback('structural')
                    };
                }
                const score = feedback.overall.score + feedback.semantic.reduce((sum, item) => sum + item.score, 0) + feedback.structural.score;
                const maxScore = feedback.overall.max + feedback.semantic.reduce((sum, item) => sum + item.max, 0) + feedback.structural.max;
                const percentage = Math.round((score / maxScore) * 100);
                const grade = score >= 85 ? 'HD' : score >= 75 ? 'D' : 'F';

                let feedbackHtml = `
                    <div class="score-circle" style="width: 90px; height: 90px; border-radius: 50%; background: conic-gradient(#003087 ${percentage}%, #ddd 0); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <span style="font-size: 24px; color: white;">${grade}</span>
                    </div>
                    <h3>Grading Results </h3>
                    <details class="feedback-item">
                        <summary>Overall Grade and Feedback</summary>
                        <p><strong>Grade:</strong> ${grade}</p>
                        <p>${feedback.overall.details}</p>
                    </details>
                    <details class="feedback-item">
                        <summary>Semantic Similarity (Labels)</summary>
                        ${feedback.semantic.map(item => `
                            <p><strong>Class "${item.className}":</strong> ${item.details}</p>
                        `).join('')}
                    </details>
                    <details class="feedback-item">
                        <summary>Structural Similarity</summary>
                        <p>${feedback.structural.details}</p>
                    </details>
                    <p style="color: green;">Submission graded successfully!</p>
                    <a href="history.html" class="cta-btn" style="display: inline-block; margin-top: 10px;">View History</a>
                    <a class="cta-btn" style="display: inline-block; margin-top: 10px;cursor: pointer;">Download Result</a>
                `;
                results.innerHTML = feedbackHtml;
            }, 500);
        }, 100);
    } catch (error) {
        results.innerHTML = '<p>Error grading diagram. Please try again.</p>';
    }
}

// View feedback for static history
function viewFeedback(id) {
    const staticFeedback = {
        1: [
            { 
                category: 'Syntax', 
                details: 'Class names are correctly spelled and follow standard naming conventions, ensuring clarity in the diagram. No typographical errors were detected, which is excellent.', 
                score: 30, 
                max: 30 
            },
            { 
                category: 'Semantics', 
                details: 'The attribute "status" in class "Flight" should represent a booking state (e.g., "booked" or "cancelled") but is misplaced in "City". Relocating it to the correct class will ensure semantic accuracy. Refer to the reference model for guidance.', 
                score: 25, 
                max: 30 
            },
            { 
                category: 'Structure', 
                details: 'The association between "Customer" and "Order" is missing, which is critical for representing the relationship in the system. Adding a 1..* association will complete the structure. Check the reference model for the correct connection.', 
                score: 30, 
                max: 40 
            }
        ],
        2: [
            { 
                category: 'Syntax', 
                details: 'A minor spelling error was found in the class name "Custmer" instead of "Customer". Correcting this typo will align the diagram with the reference model.', 
                score: 28, 
                max: 30 
            },
            { 
                category: 'Semantics', 
                details: 'The attributes and operations in all classes accurately reflect their intended meaning, demonstrating a strong understanding of the system requirements.', 
                score: 30, 
                max: 30 
            },
            { 
                category: 'Structure', 
                details: 'All associations and generalizations are correctly defined, with accurate multiplicities. The diagram’s topology fully matches the reference model.', 
                score: 40, 
                max: 40 
            }
        ],
        3: [
            { 
                category: 'Syntax', 
                details: 'Attribute names like "id_number" use inconsistent formatting (e.g., underscores instead of camelCase). Standardizing to camelCase (e.g., "idNumber") will improve consistency. Consider reviewing naming conventions.', 
                score: 25, 
                max: 30 
            },
            { 
                category: 'Semantics', 
                details: 'The class "Order" uses an ambiguous term that could be confused with "Booking". Using domain-specific terminology (e.g., "Booking") will clarify the class’s purpose. Consider consulting the problem description.', 
                score: 27, 
                max: 30 
            },
            { 
                category: 'Structure', 
                details: 'A dependency between "Booking" and "Payment" is present but lacks a clear stereotype (e.g., <<use>>). Adding the appropriate stereotype will clarify the relationship’s purpose. Refer to UML standards for dependency notation.', 
                score: 35, 
                max: 40 
            }
        ]
    };
    const feedback = staticFeedback[id];
    if (feedback) {
        let feedbackText = `Feedback for Submission ${id}:\n\n`;
        feedback.forEach(item => {
            feedbackText += `${item.category} (${item.score}/${item.max}):\n${item.details}\n\n`;
        });
        alert(feedbackText);
    }
}
