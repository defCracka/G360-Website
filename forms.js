// script.js

function initImageUpload() {
    const fileInput = document.getElementById('fileInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const maxFiles = 5;
    let selectedFiles = []; // We'll store selected files here manually

    if (!fileInput || !imagePreviewContainer) {
        console.error('Required elements not found');
        return;
    }

    fileInput.addEventListener('change', function(event) {
        const newFiles = Array.from(event.target.files);

        // Check if adding new files exceeds the maxFiles limit
        if (selectedFiles.length + newFiles.length > maxFiles) {
            showMessage(`You can upload at most ${maxFiles} photos in total`, 'error');
            fileInput.value = ''; // Reset input
            return;
        }

        newFiles.forEach(file => {
            if (!file.type.startsWith('image/')) {
                showMessage(`Skipped non-image file: ${file.name}`, 'warning');
                return;
            }
            selectedFiles.push(file); // Add to our manual array
        });

        renderThumbnails();
        fileInput.value = ''; // Important: clear the input so user can select the same file again if needed
    });

    function renderThumbnails() {
        imagePreviewContainer.innerHTML = '';

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'thumbnail-wrapper';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Preview ${index + 1}`;
                img.className = 'thumbnail';

                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-thumbnail';
                removeBtn.innerHTML = '&times;';
                removeBtn.onclick = () => removeImage(index);

                imgWrapper.appendChild(img);
                imgWrapper.appendChild(removeBtn);
                imagePreviewContainer.appendChild(imgWrapper);
            };

            reader.readAsDataURL(file);
        });
    }

    function removeImage(index) {
        selectedFiles.splice(index, 1); // Remove from array
        renderThumbnails(); // Re-render after removal
    }

    function showMessage(text, type) {
        const messages = document.getElementById('uploadMessages') || createMessageContainer();
        const message = document.createElement('div');
        message.className = `upload-message ${type}`;
        message.textContent = text;
        messages.appendChild(message);

        setTimeout(() => message.remove(), 5000);
    }

    function createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'uploadMessages';
        container.className = 'upload-messages';
        document.querySelector('.image-upload-container').appendChild(container);
        return container;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageUpload);
} else {
    initImageUpload();
}
