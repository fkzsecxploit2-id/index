// document.addEventListener('DOMContentLoaded', function() {
//     const backendURL = "https://fkzproject-backend.vercel.app/api/feedback";

//         document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
//             e.preventDefault();
            
//             const name = document.getElementById("name").value;
//             const message = document.getElementById("message").value;

//             const response = await fetch(backendURL, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ name, message })
//             });

//             if (response.ok) {
//                 alert("Ulasan berhasil dikirim!");
//                 document.getElementById("feedbackForm").reset();
//                 loadFeedback(); 
//             } else {
//                 alert("Gagal mengirim ulasan!");
//             }
//         });

//         async function loadFeedback() {
//             const response = await fetch(backendURL);
//             if (response.ok) {
//                 const feedbacks = await response.json();
//                 const feedbackList = document.getElementById("feedbackList");
//                 feedbackList.innerHTML = "";
//                 feedbacks.forEach(fb => {
//                     const li = document.createElement("li");
//                     li.textContent = `${fb.name}: ${fb.message}`;
//                     feedbackList.appendChild(li);
//                 });
//             } else {
//                 alert('umm.. something is wrong..');
//             }
//         }

//         loadFeedback();
// });

document.addEventListener('DOMContentLoaded', function () {
    const backendURL = "https://fkzproject-backend.vercel.app/api/feedback";
    const feedbackForm = document.getElementById("feedbackForm");
    const submitButton = feedbackForm.querySelector("button[type='submit']");
    let box = document.getElementById('alert6');
    let isSubmitting = false; // Flag untuk mencegah multiple submissions

    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // Jika sedang proses submit, jangan lanjutkan
        isSubmitting = true;
        submitButton.disabled = true; // Nonaktifkan tombol submit
        submitButton.textContent = "Mengirim..."; // Ubah teks tombol

        const name = document.getElementById("name").value.trim();
        const message = document.getElementById("message").value.trim();
        const recaptchaResponse = grecaptcha.getResponse(); // Ambil response reCAPTCHA

        // Validasi input
        if (!name || !message) {
            alert("Nama dan pesan harus diisi!");
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = "Kirim Ulasan!";
            return;
        }

        if (!recaptchaResponse) {
            alert("Silahkan verifikasi bahwa kamu bukan robot!");
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = "Kirim Ulasan!";
            return;
        }

        try {
            const response = await fetch(backendURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, message, recaptchaResponse }),
            });

            if (response.ok) {
                show();
                feedbackForm.reset(); // Reset form
                grecaptcha.reset(); // Reset reCAPTCHA
                loadFeedback(); // Muat ulang feedback
            } else {
                const errorData = await response.json();
                alert(`Gagal mengirim ulasan: ${errorData.error || "Terjadi kesalahan!"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat mengirim ulasan!");
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = "Kirim Ulasan!";
        }
    });

    function show(){
        try {
            setTimeout(() => {
                box.classList.add('show');
            }, 2000);
            box.classList.remove('show');

        } catch (error) {
            console.error("error:", error)
        }
    }

    async function loadFeedback() {
        try {
            const response = await fetch(backendURL);
            if (response.ok) {
                const feedbacks = await response.json();
                const feedbackList = document.getElementById("feedbackList");
                feedbackList.innerHTML = ""; // Kosongkan list sebelum mengisi ulang

                feedbacks.forEach((fb) => {
                    const li = document.createElement("li");
                    li.textContent = `${fb.name}: ${fb.message}`;
                    feedbackList.appendChild(li);
                });
            } else {
                alert("Gagal memuat ulasan!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat memuat ulasan!");
        }
    }

    loadFeedback(); // Muat feedback saat halaman dimuat
});