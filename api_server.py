# api_server.py

from flask import Flask, jsonify
import subprocess
import sys

# Inisialisasi aplikasi Flask
app = Flask(__name__)

@app.route('/scrape', methods=['POST'])
def trigger_scrape():
    """
    Endpoint untuk memicu eksekusi skrip scraper.py.
    """
    print("Menerima permintaan untuk menjalankan scraper...")
    try:
        # Menentukan path ke interpreter python di dalam virtual environment
        # agar library yang benar digunakan.
        python_executable = sys.executable

        # Menjalankan scraper.py sebagai proses terpisah
        # Ini memastikan bahwa scraper berjalan di lingkungannya sendiri
        result = subprocess.run(
            [python_executable, 'scraper.py'],
            capture_output=True,
            text=True,
            check=True, # Akan error jika skrip mengembalikan non-zero exit code
            timeout=120 # Timeout 2 menit
        )

        print("Output dari scraper.py:")
        print(result.stdout)
        
        # Cek jika ada pesan error spesifik di output
        if "Scraping gagal" in result.stdout or "Tidak dapat menemukan" in result.stdout:
             return jsonify({
                "status": "gagal", 
                "message": "Scraper berjalan tetapi tidak menemukan data.",
                "output": result.stdout
            }), 500

        return jsonify({
            "status": "sukses", 
            "message": "Scraping berhasil dijalankan.",
            "output": result.stdout
        })

    except subprocess.CalledProcessError as e:
        # Error jika skrip itu sendiri gagal (misal: syntax error)
        print(f"Error saat menjalankan scraper.py: {e.stderr}")
        return jsonify({
            "status": "error", 
            "message": "Skrip scraper gagal dieksekusi.",
            "error": e.stderr
        }), 500
    except subprocess.TimeoutExpired:
        return jsonify({
            "status": "error",
            "message": "Proses scraping timeout (lebih dari 120 detik)."
        }), 500
    except Exception as e:
        print(f"Terjadi kesalahan tidak terduga: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Jalankan server di port 5000 (port umum untuk pengembangan Flask)
    app.run(debug=True, port=5000)