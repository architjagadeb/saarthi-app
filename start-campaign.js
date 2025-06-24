// Start Campaign Form JavaScript

// Start Campaign Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('campaign-form');
    const customTopicCheckbox = document.getElementById('tag-custom');
    const customTopicGroup = document.getElementById('custom-topic-group');
    const previewBtn = document.getElementById('preview-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // File upload elements
    const coverImageInput = document.getElementById('cover-image');

    // Voice text elements
    const voiceTextarea = document.getElementById('voice-text');
    const audioPreview = document.getElementById('audio-preview');
    
    // Character counters
    const shortDescTextarea = document.getElementById('short-description');
    const fullDescTextarea = document.getElementById('full-description');

    // Initialize form functionality
    initializeForm();

    function initializeForm() {
        // Custom topic toggle
        customTopicCheckbox.addEventListener('change', toggleCustomTopic);
        
        // File upload handlers
        if (coverImageInput) {
            setupFileUpload(coverImageInput, 'image');
        }
        
        // Character counters
        if (shortDescTextarea) {
            setupCharacterCounter(shortDescTextarea, 200);
        }
        if (fullDescTextarea) {
            setupCharacterCounter(fullDescTextarea, 500, true);
        }
        if (voiceTextarea) {
            setupCharacterCounter(voiceTextarea, 2000);
        }


        
        // Form validation
        setupFormValidation();
        
        // Button handlers
        previewBtn.addEventListener('click', handlePreview);
        form.addEventListener('submit', handleSubmit);
        
        // Real-time validation
        setupRealTimeValidation();
    }

    function toggleCustomTopic() {
        if (customTopicCheckbox.checked) {
            customTopicGroup.style.display = 'block';
            document.getElementById('custom-topic').required = true;
        } else {
            customTopicGroup.style.display = 'none';
            document.getElementById('custom-topic').required = false;
            document.getElementById('custom-topic').value = '';
        }
    }

    function setupFileUpload(input, type) {
        const uploadArea = input.closest('.file-upload-area');
        
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
            uploadArea.style.backgroundColor = 'rgba(249, 115, 22, 0.05)';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.backgroundColor = 'transparent';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.backgroundColor = 'transparent';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                updateFileDisplay(input, files[0]);
            }
        });
        
        // File input change
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                updateFileDisplay(input, e.target.files[0]);
            }
        });
    }

    function updateFileDisplay(input, file) {
        const uploadArea = input.closest('.file-upload-area');
        const uploadContent = uploadArea.querySelector('.file-upload-content');
        
        // Validate file
        if (!validateFile(file, input.accept)) {
            showError(`Invalid file type. Please select a valid ${input.accept} file.`);
            return;
        }
        
        // Update display
        uploadContent.innerHTML = `
            <div class="upload-icon">✅</div>
            <p class="upload-text">${file.name}</p>
            <p class="upload-formats">${formatFileSize(file.size)}</p>
        `;
        
        uploadArea.style.borderColor = 'var(--success)';
        uploadArea.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
    }

    function validateFile(file, acceptedTypes) {
        const types = acceptedTypes.split(',').map(type => type.trim());
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        return types.includes(fileExtension);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function setupCharacterCounter(textarea, maxLength, isMinLength = false) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: 0.75rem;
            color: var(--text-light);
            text-align: right;
            margin-top: 0.25rem;
        `;
        
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const length = textarea.value.length;
            if (isMinLength) {
                counter.textContent = `${length}/${maxLength} characters (minimum)`;
                counter.style.color = length >= maxLength ? 'var(--success)' : 'var(--text-light)';
            } else {
                counter.textContent = `${length}/${maxLength} characters`;
                counter.style.color = length > maxLength ? 'var(--error)' : 'var(--text-light)';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    }

    function setupFormValidation() {
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
        });
    }

    function setupRealTimeValidation() {
        // Topic tags validation
        const topicCheckboxes = form.querySelectorAll('input[name="topicTags"]');
        topicCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', validateTopicTags);
        });
        
        // Distribution method validation
        const distributionCheckboxes = form.querySelectorAll('input[name="distributionMethod"]');
        distributionCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', validateDistributionMethods);
        });
    }

    function validateField(field) {
        const isValid = field.checkValidity();
        
        if (!isValid) {
            field.style.borderColor = 'var(--error)';
            showFieldError(field, field.validationMessage);
        } else {
            field.style.borderColor = 'var(--success)';
            hideFieldError(field);
        }
        
        return isValid;
    }

    function validateTopicTags() {
        const checkedTags = form.querySelectorAll('input[name="topicTags"]:checked');
        const isValid = checkedTags.length > 0;
        
        const tagGroup = form.querySelector('.checkbox-grid');
        if (!isValid) {
            tagGroup.style.borderColor = 'var(--error)';
            showError('Please select at least one topic tag.');
        } else {
            tagGroup.style.borderColor = 'transparent';
            hideError();
        }
        
        return isValid;
    }

    function validateDistributionMethods() {
        const checkedMethods = form.querySelectorAll('input[name="distributionMethod"]:checked');
        const isValid = checkedMethods.length > 0;
        
        if (!isValid) {
            showError('Please select at least one distribution method.');
        } else {
            hideError();
        }
        
        return isValid;
    }

    function showFieldError(field, message) {
        hideFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: var(--error);
            font-size: 0.75rem;
            margin-top: 0.25rem;
        `;
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    function hideFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    function showError(message) {
        // Remove existing error
        hideError();
        
        const errorDiv = document.createElement('div');
        errorDiv.id = 'form-error';
        errorDiv.style.cssText = `
            background-color: rgba(239, 68, 68, 0.1);
            border: 1px solid var(--error);
            color: var(--error);
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        `;
        errorDiv.textContent = message;
        
        form.insertBefore(errorDiv, form.firstChild);
    }

    function hideError() {
        const existingError = document.getElementById('form-error');
        if (existingError) {
            existingError.remove();
        }
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            background-color: rgba(16, 185, 129, 0.1);
            border: 1px solid var(--success);
            color: var(--success);
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        `;
        successDiv.textContent = message;
        
        form.insertBefore(successDiv, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    function handlePreview(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const formData = collectFormData();
        showPreviewModal(formData);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Simulate form submission
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Campaign';

            showSuccess('🎉 Campaign submitted successfully! We will review it and redirect you within 24 hours.');

            // Reset form
            form.reset();
            if (customTopicGroup) {
                customTopicGroup.style.display = 'none';
            }

            // Reset file uploads
            resetFileUploads();

        }, 2000);
    }

    function validateForm() {
        hideError();
        
        let isValid = true;
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate topic tags
        if (!validateTopicTags()) {
            isValid = false;
        }
        
        // Validate distribution methods
        if (!validateDistributionMethods()) {
            isValid = false;
        }
        
        if (!isValid) {
            showError('Please fix the errors above before submitting.');
        }
        
        return isValid;
    }

    function collectFormData() {
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    function showPreviewModal(data) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                width: 100%;
            ">
                <h2 style="margin-bottom: 1rem; color: var(--primary-color);">Campaign Preview</h2>
                <div style="margin-bottom: 1.5rem;">
                    <h3>${data.campaignTitle || 'Untitled Campaign'}</h3>
                    <p style="color: var(--text-gray); margin: 0.5rem 0;">${data.shortDescription || 'No description'}</p>
                    <p><strong>Location:</strong> ${data.locationState || 'Not specified'}</p>
                    <p><strong>Topics:</strong> ${Array.isArray(data.topicTags) ? data.topicTags.join(', ') : data.topicTags || 'None'}</p>
                    <p><strong>Creator:</strong> ${data.creatorName || 'Anonymous'}</p>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                            style="padding: 0.5rem 1rem; border: 1px solid var(--border-color); background: white; border-radius: 0.5rem; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function resetFileUploads() {
        // Reset cover image upload
        if (coverImageInput) {
            const uploadArea = coverImageInput.closest('.file-upload-area');
            if (uploadArea) {
                const uploadContent = uploadArea.querySelector('.file-upload-content');
                if (uploadContent) {
                    uploadContent.innerHTML = `
                        <div class="upload-icon">📷</div>
                        <p class="upload-text">Click to upload or drag and drop</p>
                        <p class="upload-formats">JPG, PNG, WEBP (max 5MB)</p>
                    `;
                    uploadArea.style.borderColor = 'var(--border-color)';
                    uploadArea.style.backgroundColor = 'transparent';
                }
            }
        }

        // Reset voice text area
        if (voiceTextarea) {
            voiceTextarea.value = '';
        }

        // Hide audio preview
        if (audioPreview) {
            audioPreview.style.display = 'none';
        }
    }

    // Murf AI TTS direct API integration with voice selection
    const generateVoiceBtn = document.getElementById("generate-voice-btn");
    const voiceInput = document.getElementById("voice-text");
    const voiceStatus = document.getElementById("voice-status");
    const voicePreview = document.getElementById("voice-preview");
    const voiceGender = document.getElementById("voice-gender");
    const voiceType = document.getElementById("voice-type");

    // Voice mapping based on your provided voice IDs
    const voiceMap = {
        "female_hindi": { voice_id: "hi-IN-shweta", style: "Conversational" },
        "male_hindi": { voice_id: "hi-IN-rahul", style: "General" },
        "female_english": { voice_id: "en-US-natalie", style: "Promo" },
        "male_english": { voice_id: "en-US-ken", style: "Conversational" }
    };

    // Function to get voice ID based on gender and language selection
    function getVoiceId(gender, type) {
        const voiceKey = `${gender}_${type}`;
        const selectedVoice = voiceMap[voiceKey];
        return selectedVoice ? selectedVoice.voice_id : "en-US-natalie"; // Default fallback
    }

    // WebSocket for Murf AI
    let murfSocket = null;
    let murfSocketReady = false;
    let murfSocketAuthSent = false;
    const MURF_API_KEY = "ap2_397f1024-c966-4e6a-b8ed-ed607d8bc59d"; // TODO: Replace with your real API key
    let pendingSpeakRequest = null;

    // Warn if not served over HTTPS
    if (location.protocol !== 'https:') {
        setTimeout(() => {
            alert('⚠️ This page is not served over HTTPS. Secure WebSocket (wss://) connections will not work on file:// or http://. Please use Live Server or deploy to a secure host for full functionality.');
        }, 500);
    }

    function isValidSpeakPayload(payload) {
        if (!payload) return false;
        if (!payload.voice_config) return false;
        if (typeof payload.voice_config.voice_id !== 'string' || !payload.voice_config.voice_id.trim()) return false;
        if (typeof payload.voice_config.text !== 'string' || !payload.voice_config.text.trim()) return false;
        return true;
    }

    function initMurfSocket() {
        murfSocket = new WebSocket("wss://api.murf.ai/v1/speech/stream-input");
        murfSocketReady = false;
        murfSocketAuthSent = false;

        murfSocket.onopen = () => {
            murfSocket.send(JSON.stringify({
                type: "auth",
                apiKey: MURF_API_KEY
            }));
            murfSocketAuthSent = true;
        };
        murfSocket.onerror = (err) => {
            voiceStatus.textContent = "❌ WebSocket error. Try again.";
            console.error("WebSocket error:", err);
        };
        murfSocket.onclose = () => {
            voiceStatus.textContent = "ℹ️ WebSocket connection closed.";
            murfSocketReady = false;
        };
        murfSocket.onmessage = async (event) => {
            // Handle JSON (auth success) or audio Blob
            if (typeof event.data === "string") {
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.type === "auth" && msg.success) {
                        murfSocketReady = true;
                        // Send pending speak request if any
                        if (pendingSpeakRequest && isValidSpeakPayload(pendingSpeakRequest)) {
                            murfSocket.send(JSON.stringify(pendingSpeakRequest));
                            pendingSpeakRequest = null;
                        }
                    } else if (msg.error) {
                        voiceStatus.textContent = "❌ " + msg.error;
                    }
                } catch (e) {
                    // Not JSON, ignore
                }
            } else if (event.data instanceof Blob) {
                // Streamed audio
                const arrayBuffer = await event.data.arrayBuffer();
                const context = new (window.AudioContext || window.webkitAudioContext)();
                context.decodeAudioData(arrayBuffer, (buffer) => {
                    const source = context.createBufferSource();
                    source.buffer = buffer;
                    source.connect(context.destination);
                    source.start();
                });
                voiceStatus.textContent = `✅ Voice generated successfully!`;
            }
        };
    }

    generateVoiceBtn.addEventListener("click", async () => {
        const text = voiceInput.value.trim();
        const gender = voiceGender.value;
        const type = voiceType.value;

        if (!text) {
            voiceStatus.textContent = "❌ Please enter a message first.";
            return;
        }

        if (!gender || !type) {
            voiceStatus.textContent = "❌ Please select voice gender and type.";
            return;
        }

        // Get selected voice configuration
        const selectedVoiceId = getVoiceId(gender, type);

        voiceStatus.textContent = "⏳ Generating voice, please wait...";

        const speakRequest = {
            voice_config: {
                voice_id: selectedVoiceId,
                text: text
            }
        };

        if (!isValidSpeakPayload(speakRequest)) {
            voiceStatus.textContent = "❌ Internal error: Invalid payload. Please check your input.";
            return;
        }

        // If socket is not ready, (re)initialize and store the request
        if (!murfSocket || murfSocket.readyState !== 1 || !murfSocketReady) {
            pendingSpeakRequest = speakRequest;
            initMurfSocket();
        } else {
            murfSocket.send(JSON.stringify(speakRequest));
        }
    });


});
