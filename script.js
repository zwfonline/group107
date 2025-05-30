
// Preview uploaded diagram
function previewDiagram(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
    preview.innerHTML = ''; // Clear previous preview

    if (file) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            preview.innerHTML = '<p>File too large (max 10MB).</p>';
            return;
        }

        const fileType = file.type;
        if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
        } else if (fileType === 'application/pdf') {
            preview.innerHTML = `<p>PDF uploaded: ${file.name}</p><i class="fas fa-file-pdf" style="font-size: 40px; color: #003087;"></i>`;
        } else {
            preview.innerHTML = '<p>Unsupported file format.</p>';
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
    syntax: [
        {
            details: 'All class names are correctly spelled and adhere to standard UML naming conventions, ensuring the diagram is clear and professional. No typographical errors were detected, which reflects careful preparation.',
            score: 30,
            max: 30
        },
        {
            details: 'A minor spelling error was found in the class name "Custmer" instead of "Customer", which slightly affects readability. Correcting this typo will align the diagram with the reference model. Please review all class names for accuracy.',
            score: 28,
            max: 30
        },
        {
            details: 'Attribute names like "id_number" use inconsistent formatting, such as underscores instead of camelCase (e.g., "idNumber"). Adopting a consistent naming convention will enhance the diagram’s clarity. Consider following UML best practices for attribute naming.',
            score: 25,
            max: 30
        },
        {
            details: 'Operation name "calculate" is vague and lacks a specific verb prefix, such as "computeTotal". Renaming operations to be more descriptive will improve the diagram’s expressiveness. Check the reference model for suggested operation names.',
            score: 26,
            max: 30
        },
        {
            details: 'Multiple classes use generic names like "Class1" instead of descriptive ones like "Student". Using meaningful, domain-specific names will make the diagram more intuitive. Refer to the problem domain for appropriate terminology.',
            score: 24,
            max: 30
        },
        {
            details: 'Operation parameters in "processOrder" are missing, reducing clarity about input types (e.g., "amount: float"). Adding parameter details will enhance the operation’s specificity. Review the reference model for parameter examples.',
            score: 27,
            max: 30
        }
    ],
    semantics: [
        {
            details: 'All attributes and operations accurately reflect the intended meaning within the problem domain, demonstrating a strong grasp of the system requirements. The diagram effectively captures the semantics of the modeled system.',
            score: 30,
            max: 30
        },
        {
            details: 'The attribute "status" is incorrectly placed in class "City" instead of "Flight", where it should represent a booking state (e.g., "booked"). Relocating this attribute to the appropriate class will ensure semantic correctness. Consult the reference model for correct placement.',
            score: 25,
            max: 30
        },
        {
            details: 'The class name "Order" is ambiguous and could be confused with "Booking" in this context, reducing clarity. Using domain-specific terminology, such as "Booking", will better convey the class’s purpose. Review the problem description for suitable terms.',
            score: 27,
            max: 30
        },
        {
            details: 'The operation "update" in class "Customer" lacks specificity about what is being updated (e.g., profile or order details). Renaming it to something like "updateProfile" will improve semantic precision. Check the reference operations for clarity.',
            score: 26,
            max: 30
        },
        {
            details: 'The attribute "price" in class "Product" uses a generic term that doesn’t specify the currency or context. Adding context (e.g., "unitPriceUSD") will make the attribute’s meaning clearer. Refer to the domain model for precise terminology.',
            score: 25,
            max: 30
        },
        {
            details: 'The operation "getData" in class "Order" is too broad and doesn’t indicate what data is retrieved. Specifying the data type (e.g., "getOrderDetails") will enhance the operation’s semantic accuracy. Review UML operation guidelines.',
            score: 26,
            max: 30
        }
    ],
    structure: [
        {
            details: 'All associations, generalizations, and dependencies are correctly defined with accurate multiplicities and directions, fully matching the reference model. The diagram’s topology is well-structured, reflecting excellent design skills.',
            score: 40,
            max: 40
        },
        {
            details: 'The association between "Customer" and "Order" is missing, which is essential for representing the relationship in the system. Adding a 1..* association will complete the diagram’s structure. Check the reference model for the correct connection details.',
            score: 30,
            max: 40
        },
        {
            details: 'The generalization between "Vehicle" and "Car" is reversed, incorrectly suggesting "Car" is the parent class. Correcting the arrow direction will align the hierarchy with the reference model. Verify the inheritance structure in the problem domain.',
            score: 32,
            max: 40
        },
        {
            details: 'A dependency between "Booking" and "Payment" is present but lacks a stereotype (e.g., <<use>>), reducing clarity. Adding the appropriate stereotype will clarify the relationship’s purpose. Refer to UML standards for dependency notation.',
            score: 35,
            max: 40
        },
        {
            details: 'The diagram includes an extra association between "Product" and "Inventory" that is not required, causing redundancy. Removing this unnecessary relationship will streamline the structure. Compare with the reference model to identify required associations.',
            score: 33,
            max: 40
        },
        {
            details: 'Multiplicities in the association between "Order" and "Item" are incorrect (e.g., 1..1 instead of 1..*). Adjusting the multiplicities to reflect the correct cardinality will improve accuracy. Check the reference model for multiplicity details.',
            score: 34,
            max: 40
        }
    ]
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
                // Randomly select feedback
                const getRandomFeedback = (category) => feedbackLibrary[category][Math.floor(Math.random() * feedbackLibrary[category].length)];
                const feedback = [
                    { category: 'Syntax', ...getRandomFeedback('syntax') },
                    { category: 'Semantics', ...getRandomFeedback('semantics') },
                    { category: 'Structure', ...getRandomFeedback('structure') }
                ];
                const score = feedback.reduce((sum, item) => sum + item.score, 0);
                const maxScore = feedback.reduce((sum, item) => sum + item.max, 0);
                const percentage = Math.round((score / maxScore) * 100);

                let feedbackHtml = `
                    <div class="score-circle" style="width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(#003087 ${percentage}%, #ddd 0); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <span style="font-size: 20px; color: #003087;">${percentage}%</span>
                    </div>
                    <h3>Score: ${score}/${maxScore}</h3>
                `;
                feedback.forEach(item => {
                    feedbackHtml += `
                        <details class="feedback-item">
                            <summary>${item.category} (${item.score}/${item.max})</summary>
                            <p>${item.details}</p>
                        </details>
                    `;
                });
                feedbackHtml += `
                    <p style="color: green;">Submission graded successfully!</p>
                    <a href="history.html" class="cta-btn" style="display: inline-block; margin-top: 10px;">View History</a>
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
