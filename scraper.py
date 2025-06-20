# scraper.py (Implementasi Ide Baru)

import requests
from bs4 import BeautifulSoup
from newspaper import Article, Config as NewspaperConfig
import re
import sqlite3
from datetime import datetime
import random
import time

# --- KONFIGURASI ---
# Keyword yang akan digunakan untuk mencari berita di Bing News
SEARCH_KEYWORD = "harga TBS kelapa sawit hari ini"
# Path ke file database SQLite yang digunakan oleh Next.js
DB_PATH = 'prisma/dev.db'

# Konfigurasi User-Agent untuk menyamar sebagai browser
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
]
NP_CONFIG = NewspaperConfig()
NP_CONFIG.browser_user_agent = random.choice(USER_AGENTS)
NP_CONFIG.request_timeout = 15
NP_CONFIG.fetch_images = False
NP_CONFIG.memoize_articles = False

# --- FUNGSI-FUNGSI PEMBANTU ---

def search_news_urls(keyword, num_results=10):
    """Mencari URL berita dari Bing News berdasarkan keyword."""
    print(f"Mencari URL berita untuk keyword: '{keyword}'...")
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    query = f"https://www.bing.com/news/search?q={keyword.replace(' ', '+')}"
    
    try:
        response = requests.get(query, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        
        links = set()
        # Cari semua link di dalam kartu berita
        for a in soup.select("a.title"):
            href = a.get('href')
            if href and href.startswith("http") and "bing.com" not in href:
                links.add(href)
                if len(links) >= num_results:
                    break
        
        print(f"Menemukan {len(links)} URL berita yang relevan.")
        return list(links)
        
    except requests.RequestException as e:
        print(f"Gagal mengambil halaman Bing: {e}")
        return []

def extract_text_from_url(url):
    """Mengekstrak teks penuh dari sebuah URL menggunakan newspaper3k."""
    try:
        article = Article(url, config=NP_CONFIG)
        article.download()
        article.parse()
        return article.text, article.source_url
    except Exception as e:
        print(f"Gagal memproses URL {url}: {e}")
        return None, None

def clean_price(price_str):
    """Membersihkan string harga dan mengubahnya menjadi angka (float)."""
    cleaned = price_str.replace('Rp', '').replace('.', '').replace(',', '.').strip()
    try:
        # Menghapus semua karakter non-digit kecuali titik desimal
        numeric_only = re.sub(r'[^\d.]', '', cleaned)
        return float(numeric_only)
    except (ValueError, TypeError):
        return None

def find_price_in_text(text):
    """Mencari pola harga yang paling mungkin dalam sebuah teks."""
    # Regex ini mencari "Rp" diikuti angka, spasi opsional, titik, koma, dan "/kg" opsional.
    pattern = re.compile(r'Rp\s?([\d\.,]+)(?:\s?/kg)?')
    matches = pattern.findall(text)
    
    found_prices = []
    for match in matches:
        price = clean_price(match)
        # Filter harga yang masuk akal (antara 1.000 dan 5.000)
        if price and 1000 < price < 5000:
            found_prices.append(price)
    
    if found_prices:
        # Kembalikan harga pertama yang valid ditemukan
        return found_prices[0]
    return None

def save_price_to_db(price, source):
    """Menyimpan atau memperbarui harga ke database SQLite untuk hari ini."""
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        today = datetime.now().date()
        
        # Cek apakah sudah ada data untuk hari ini
        cursor.execute("SELECT id FROM PalmOilPrice WHERE date(date) = ?", (today,))
        existing_record = cursor.fetchone()
        
        if existing_record:
            # Jika ada, UPDATE
            cursor.execute("""
                UPDATE PalmOilPrice SET price = ?, source = ? WHERE id = ?
            """, (price, source, existing_record[0]))
            print(f"Berhasil MEMPERBARUI harga untuk hari ini menjadi Rp {price} dari sumber {source}.")
        else:
            # Jika tidak ada, INSERT
            cursor.execute("""
                INSERT INTO PalmOilPrice (price, date, source)
                VALUES (?, ?, ?)
            """, (price, datetime.combine(today, datetime.min.time()), source))
            print(f"Berhasil MENYIMPAN harga baru Rp {price} untuk hari ini dari sumber {source}.")
        
        conn.commit()

    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()

def main():
    """Fungsi utama untuk menjalankan keseluruhan proses."""
    urls = search_news_urls(SEARCH_KEYWORD)
    if not urls:
        print("Tidak ada URL yang ditemukan. Proses berhenti.")
        return

    price_found = False
    for url in urls:
        print("-" * 20)
        print(f"Memproses artikel dari: {url}")
        
        text, source = extract_text_from_url(url)
        
        if text:
            price = find_price_in_text(text)
            if price:
                print(f"✅ Harga ditemukan: Rp {price}")
                data_source = source.split('//')[-1].split('/')[0] if source else 'Unknown'
                save_price_to_db(price, data_source)
                price_found = True
                break # Hentikan proses setelah harga pertama ditemukan
        
        time.sleep(random.uniform(1, 2)) # Jeda antar permintaan agar tidak membebani server
    
    if not price_found:
        print("\nProses selesai. Tidak ada harga valid yang ditemukan dari semua artikel yang diproses.")

if __name__ == '__main__':
    main()