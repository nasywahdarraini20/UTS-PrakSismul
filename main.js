// Get the image and audio input fields
const myImage = document.querySelector("#my_image");
const myAudio = document.querySelector("#my_audio");
const compressAudioButton = document.querySelector("#compress_audio");
const originalImageContainer = document.querySelector("#original_image_container");
const resizeImageContainer = document.querySelector("#resize_image_container");
const compressedAudioContainer = document.querySelector("#compressed_audio_container");

// Add an event listener to the image input field to handle image uploads
myImage.addEventListener("change", (evt) => {
    const image = evt.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
        const newImage = new Image();
        newImage.src = reader.result;
        newImage.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.height = newImage.height;
            canvas.width = newImage.width;
            const ctx = canvas.getContext('2d');

            newImage.width = 150;
            originalImageContainer.appendChild(newImage);

            ctx.drawImage(newImage, 0, 0);

            const newUrl = canvas.toDataURL('image/jpeg', 0.5);

            resizeImageContainer.innerHTML = `<img src="${newUrl}" width="150" onclick="downloadImage(event)">`;
        };

    };
    reader.readAsDataURL(image);
});

// Add an event listener to the audio input field to handle audio uploads
myAudio.addEventListener("change", (evt) => {
    const audioFile = evt.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
        const audioBlob = new Blob([reader.result], { type: 'audio/mpeg' }); // Change the audio type to MPEG

        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();

        audioContext.decodeAudioData(reader.result, (decodedData) => {
            source.buffer = decodedData;
            const filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            source.connect(filter);
            filter.connect(audioContext.destination);
            source.start();

            setTimeout(() => {
                audioContext.close().then(() => {
                    const audioData = source.buffer.getChannelData(0);
                    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' }); // Change the audio type to MPEG
                    const compressedAudioUrl = URL.createObjectURL(audioBlob);
                    compressedAudioContainer.innerHTML = `<a href="${compressedAudioUrl}" download="compressed_audio.mpeg">Download Compressed Audio</a>`; // Change the file extension to .mpeg
                });
            }, source.buffer.duration * 1000);
        });
    };

    reader.readAsArrayBuffer(audioFile);
});

// Function to download the resized image
const downloadImage = (evt) => {
    const a = document.createElement('a');
    a.download = 'resize_image.jpeg';
    a.href = evt.target.src;
    a.target = '_blank';
    a.click();
};






